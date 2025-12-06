// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ComplianceManager.sol";
import "./interfaces/IVerifier.sol";

/**
 * @title StrategyVault
 * @notice Vault contract with ZK-gated access for yield strategies
 * @dev Users must prove compliance and balance threshold to deposit
 */
contract StrategyVault {
    /// @notice Version of the contract
    string public constant VERSION = "1.0.0";

    /// @notice Compliance manager contract
    ComplianceManager public immutable complianceManager;

    /// @notice Balance verifier contract
    IVerifier public immutable balanceVerifier;

    /// @notice Minimum balance threshold for access
    uint256 public minBalanceThreshold;

    /// @notice Total value locked in vault
    uint256 public totalValueLocked;

    /// @notice User deposits
    mapping(address => uint256) public deposits;

    /// @notice User shares
    mapping(address => uint256) public shares;

    /// @notice Total shares
    uint256 public totalShares;

    /// @notice Contract owner
    address public owner;

    /// @notice Paused state
    bool public paused;

    /// @notice Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event ThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event Paused();
    event Unpaused();

    /// @notice Errors
    error Unauthorized();
    error NotCompliant();
    error InvalidProof();
    error InsufficientBalance();
    error InsufficientShares();
    error ContractPaused();
    error ZeroAmount();
    error TransferFailed();

    /**
     * @notice Constructor
     * @param _complianceManager Compliance manager contract address
     * @param _balanceVerifier Balance verifier contract address
     * @param _minBalanceThreshold Minimum balance threshold
     */
    constructor(
        address _complianceManager,
        address _balanceVerifier,
        uint256 _minBalanceThreshold
    ) {
        complianceManager = ComplianceManager(_complianceManager);
        balanceVerifier = IVerifier(_balanceVerifier);
        minBalanceThreshold = _minBalanceThreshold;
        owner = msg.sender;
        paused = false;
    }

    /**
     * @notice Modifier to restrict access to owner
     */
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    /**
     * @notice Modifier to check if contract is not paused
     */
    modifier whenNotPaused() {
        if (paused) revert ContractPaused();
        _;
    }

    /**
     * @notice Deposit funds with ZK proofs
     * @param a Proof point a
     * @param b Proof point b
     * @param c Proof point c
     * @param commitment Commitment to user's balance
     */
    function deposit(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint256 commitment
    ) external payable whenNotPaused {
        if (msg.value == 0) revert ZeroAmount();

        // Check compliance
        if (!complianceManager.isCompliant(msg.sender)) revert NotCompliant();

        // Prepare public inputs for balance verifier
        uint[3] memory publicInputs = [
            commitment,
            minBalanceThreshold,
            0 // placeholder for future use
        ];

        // Verify balance proof
        bool proofValid = balanceVerifier.verifyProof(a, b, c, publicInputs);
        if (!proofValid) revert InvalidProof();

        // Calculate shares
        uint256 sharesToMint;
        if (totalShares == 0) {
            sharesToMint = msg.value;
        } else {
            sharesToMint = (msg.value * totalShares) / totalValueLocked;
        }

        // Update state
        deposits[msg.sender] += msg.value;
        shares[msg.sender] += sharesToMint;
        totalShares += sharesToMint;
        totalValueLocked += msg.value;

        emit Deposited(msg.sender, msg.value, sharesToMint);
    }

    /**
     * @notice Withdraw funds
     * @param sharesToBurn Amount of shares to burn
     */
    function withdraw(uint256 sharesToBurn) external whenNotPaused {
        if (sharesToBurn == 0) revert ZeroAmount();
        if (shares[msg.sender] < sharesToBurn) revert InsufficientShares();

        // Calculate withdrawal amount
        uint256 withdrawAmount = (sharesToBurn * totalValueLocked) / totalShares;

        // Update state
        shares[msg.sender] -= sharesToBurn;
        totalShares -= sharesToBurn;
        totalValueLocked -= withdrawAmount;

        // Transfer funds
        (bool success, ) = msg.sender.call{value: withdrawAmount}("");
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, withdrawAmount, sharesToBurn);
    }

    /**
     * @notice Emergency withdraw (no proof required)
     * @dev Only available to users who already deposited
     */
    function emergencyWithdraw() external {
        uint256 userShares = shares[msg.sender];
        if (userShares == 0) revert InsufficientShares();

        uint256 withdrawAmount = (userShares * totalValueLocked) / totalShares;

        // Update state
        shares[msg.sender] = 0;
        totalShares -= userShares;
        totalValueLocked -= withdrawAmount;

        // Transfer funds
        (bool success, ) = msg.sender.call{value: withdrawAmount}("");
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, withdrawAmount, userShares);
    }

    /**
     * @notice Update minimum balance threshold (admin only)
     * @param newThreshold New threshold value
     */
    function updateThreshold(uint256 newThreshold) external onlyOwner {
        uint256 oldThreshold = minBalanceThreshold;
        minBalanceThreshold = newThreshold;
        emit ThresholdUpdated(oldThreshold, newThreshold);
    }

    /**
     * @notice Pause contract (admin only)
     */
    function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }

    /**
     * @notice Unpause contract (admin only)
     */
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }

    /**
     * @notice Get user's share balance
     * @param user User address
     * @return User's share balance
     */
    function balanceOf(address user) external view returns (uint256) {
        return shares[user];
    }

    /**
     * @notice Calculate withdrawal amount for shares
     * @param sharesToBurn Amount of shares
     * @return Withdrawal amount in wei
     */
    function calculateWithdrawal(uint256 sharesToBurn) external view returns (uint256) {
        if (totalShares == 0) return 0;
        return (sharesToBurn * totalValueLocked) / totalShares;
    }

    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {
        totalValueLocked += msg.value;
    }
}
