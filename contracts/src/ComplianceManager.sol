// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IVerifier.sol";

/**
 * @title ComplianceManager
 * @notice Manages KYC compliance using zero-knowledge proofs
 * @dev Issues Compliance NFTs after successful ZK-KYC verification
 */
contract ComplianceManager {
    /// @notice Version of the contract
    string public constant VERSION = "1.0.0";

    /// @notice KYC verifier contract
    IVerifier public immutable kycVerifier;

    /// @notice Allowed jurisdiction code
    uint256 public allowedJurisdiction;

    /// @notice Minimum timestamp for credential validity
    uint256 public minTimestamp;

    /// @notice Contract owner
    address public owner;

    /// @notice Compliance status by address
    mapping(address => bool) public isCompliant;

    /// @notice Compliance NFT token ID counter
    uint256 public nextTokenId;

    /// @notice Commitment to user address mapping
    mapping(uint256 => address) public commitmentToAddress;

    /// @notice Address to commitment mapping
    mapping(address => uint256) public addressToCommitment;

    /// @notice Events
    event ComplianceGranted(address indexed user, uint256 indexed commitment, uint256 tokenId);
    event ComplianceRevoked(address indexed user, uint256 indexed commitment);
    event JurisdictionUpdated(uint256 oldJurisdiction, uint256 newJurisdiction);
    event MinTimestampUpdated(uint256 oldTimestamp, uint256 newTimestamp);

    /// @notice Errors
    error Unauthorized();
    error InvalidProof();
    error AlreadyCompliant();
    error NotCompliant();
    error CommitmentAlreadyUsed();

    /**
     * @notice Constructor
     * @param _kycVerifier Address of KYC verifier contract
     * @param _allowedJurisdiction Allowed jurisdiction code
     * @param _minTimestamp Minimum valid timestamp
     */
    constructor(
        address _kycVerifier,
        uint256 _allowedJurisdiction,
        uint256 _minTimestamp
    ) {
        kycVerifier = IVerifier(_kycVerifier);
        allowedJurisdiction = _allowedJurisdiction;
        minTimestamp = _minTimestamp;
        owner = msg.sender;
        nextTokenId = 1;
    }

    /**
     * @notice Modifier to restrict access to owner
     */
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    /**
     * @notice Grant compliance after successful ZK-KYC verification
     * @param a Proof point a
     * @param b Proof point b
     * @param c Proof point c
     * @param commitment Public commitment to user credentials
     */
    function grantCompliance(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint256 commitment
    ) external {
        // Check if already compliant
        if (isCompliant[msg.sender]) revert AlreadyCompliant();
        
        // Check if commitment already used
        if (commitmentToAddress[commitment] != address(0)) revert CommitmentAlreadyUsed();

        // Prepare public inputs for verifier
        uint[3] memory publicInputs = [
            allowedJurisdiction,
            commitment,
            minTimestamp
        ];

        // Verify the ZK proof
        bool proofValid = kycVerifier.verifyProof(a, b, c, publicInputs);
        if (!proofValid) revert InvalidProof();

        // Grant compliance
        isCompliant[msg.sender] = true;
        commitmentToAddress[commitment] = msg.sender;
        addressToCommitment[msg.sender] = commitment;
        
        uint256 tokenId = nextTokenId++;

        emit ComplianceGranted(msg.sender, commitment, tokenId);
    }

    /**
     * @notice Revoke compliance (admin only)
     * @param user Address to revoke compliance from
     */
    function revokeCompliance(address user) external onlyOwner {
        if (!isCompliant[user]) revert NotCompliant();
        
        uint256 commitment = addressToCommitment[user];
        
        isCompliant[user] = false;
        delete commitmentToAddress[commitment];
        delete addressToCommitment[user];

        emit ComplianceRevoked(user, commitment);
    }

    /**
     * @notice Update allowed jurisdiction (admin only)
     * @param newJurisdiction New jurisdiction code
     */
    function updateJurisdiction(uint256 newJurisdiction) external onlyOwner {
        uint256 oldJurisdiction = allowedJurisdiction;
        allowedJurisdiction = newJurisdiction;
        emit JurisdictionUpdated(oldJurisdiction, newJurisdiction);
    }

    /**
     * @notice Update minimum timestamp (admin only)
     * @param newMinTimestamp New minimum timestamp
     */
    function updateMinTimestamp(uint256 newMinTimestamp) external onlyOwner {
        uint256 oldTimestamp = minTimestamp;
        minTimestamp = newMinTimestamp;
        emit MinTimestampUpdated(oldTimestamp, newMinTimestamp);
    }

    /**
     * @notice Check if address is compliant
     * @param user Address to check
     * @return True if compliant, false otherwise
     */
    function checkCompliance(address user) external view returns (bool) {
        return isCompliant[user];
    }

    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
