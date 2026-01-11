// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AaveStrategy
 * @notice Strategy contract for depositing ETH to Aave and earning yields
 * @dev This contract interacts with Aave V3 lending pool
 */
interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
    function getReserveData(address asset) external view returns (ReserveData memory);
}

interface IWETHGateway {
    function depositETH(address pool, address onBehalfOf, uint16 referralCode) external payable;
    function withdrawETH(address pool, uint256 amount, address to) external;
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

struct ReserveData {
    uint256 configuration;
    uint128 liquidityIndex;
    uint128 currentLiquidityRate;
    uint128 variableBorrowIndex;
    uint128 currentVariableBorrowRate;
    uint128 currentStableBorrowRate;
    uint40 lastUpdateTimestamp;
    uint16 id;
    address aTokenAddress;
    address stableDebtTokenAddress;
    address variableDebtTokenAddress;
    address interestRateStrategyAddress;
    uint128 accruedToTreasury;
    uint128 unbacked;
    uint128 isolationModeTotalDebt;
}

contract AaveStrategy is Ownable, ReentrancyGuard {
    
    // ========== STATE VARIABLES ==========
    
    /// @notice Aave V3 Pool address (Base mainnet)
    address public constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;
    
    /// @notice WETH Gateway for ETH deposits
    address public constant WETH_GATEWAY = 0x8be473dCfA93132658821E67CbEB684ec8Ea2E74;
    
    /// @notice WETH address on Base
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    
    /// @notice aToken address (aWETH on Base)
    address public aToken;
    
    /// @notice Strategy vault address (StrategyVault)
    address public vault;
    
    /// @notice Total deposited to Aave
    uint256 public totalDeposited;
    
    /// @notice Total earned yields
    uint256 public totalYieldsEarned;
    
    /// @notice Last harvest timestamp
    uint256 public lastHarvestTime;
    
    // ========== EVENTS ==========
    
    event Deposited(uint256 amount, uint256 timestamp);
    event Withdrawn(uint256 amount, uint256 yields, uint256 timestamp);
    event YieldsHarvested(uint256 yields, uint256 timestamp);
    event VaultUpdated(address indexed oldVault, address indexed newVault);
    
    // ========== MODIFIERS ==========
    
    modifier onlyVault() {
        require(msg.sender == vault, "Only vault can call");
        _;
    }
    
    // ========== CONSTRUCTOR ==========
    
    constructor(address _vault) {
        require(_vault != address(0), "Invalid vault address");
        vault = _vault;
        
        // Get aToken address from Aave
        IPool pool = IPool(AAVE_POOL);
        ReserveData memory reserveData = pool.getReserveData(WETH);
        aToken = reserveData.aTokenAddress;
        
        require(aToken != address(0), "aToken not found");
    }
    
    // ========== MAIN FUNCTIONS ==========
    
    /**
     * @notice Deposit ETH to Aave
     * @dev Called by StrategyVault to allocate funds
     */
    function deposit() external payable onlyVault nonReentrant {
        require(msg.value > 0, "Deposit amount must be > 0");
        
        uint256 balanceBefore = IERC20(aToken).balanceOf(address(this));
        
        // Deposit ETH to Aave via WETH Gateway
        IWETHGateway(WETH_GATEWAY).depositETH{value: msg.value}(
            AAVE_POOL,
            address(this),
            0 // referral code
        );
        
        uint256 balanceAfter = IERC20(aToken).balanceOf(address(this));
        uint256 actualDeposit = balanceAfter - balanceBefore;
        
        totalDeposited += actualDeposit;
        lastHarvestTime = block.timestamp;
        
        emit Deposited(msg.value, block.timestamp);
    }
    
    /**
     * @notice Withdraw ETH from Aave
     * @param amount Amount to withdraw (in wei)
     * @dev Called by StrategyVault when users withdraw
     */
    function withdraw(uint256 amount) external onlyVault nonReentrant returns (uint256) {
        require(amount > 0, "Withdraw amount must be > 0");
        require(amount <= totalDeposited, "Insufficient balance");
        
        uint256 balanceBefore = address(this).balance;
        
        // Withdraw ETH from Aave
        IWETHGateway(WETH_GATEWAY).withdrawETH(
            AAVE_POOL,
            amount,
            address(this)
        );
        
        uint256 balanceAfter = address(this).balance;
        uint256 actualWithdraw = balanceAfter - balanceBefore;
        
        // Calculate yields earned
        uint256 yields = 0;
        if (actualWithdraw > amount) {
            yields = actualWithdraw - amount;
            totalYieldsEarned += yields;
        }
        
        totalDeposited -= amount;
        
        // Transfer to vault
        (bool success, ) = vault.call{value: actualWithdraw}("");
        require(success, "ETH transfer failed");
        
        emit Withdrawn(amount, yields, block.timestamp);
        
        return actualWithdraw;
    }
    
    /**
     * @notice Harvest yields without withdrawing principal
     * @dev Can be called periodically to compound yields
     */
    function harvestYields() external onlyVault nonReentrant returns (uint256) {
        uint256 currentBalance = IERC20(aToken).balanceOf(address(this));
        
        // Calculate yields (currentBalance - totalDeposited)
        if (currentBalance <= totalDeposited) {
            return 0; // No yields yet
        }
        
        uint256 yields = currentBalance - totalDeposited;
        
        // Withdraw only yields
        uint256 balanceBefore = address(this).balance;
        
        IWETHGateway(WETH_GATEWAY).withdrawETH(
            AAVE_POOL,
            yields,
            address(this)
        );
        
        uint256 balanceAfter = address(this).balance;
        uint256 actualYields = balanceAfter - balanceBefore;
        
        totalYieldsEarned += actualYields;
        lastHarvestTime = block.timestamp;
        
        // Transfer yields to vault
        (bool success, ) = vault.call{value: actualYields}("");
        require(success, "ETH transfer failed");
        
        emit YieldsHarvested(actualYields, block.timestamp);
        
        return actualYields;
    }
    
    /**
     * @notice Withdraw all funds (emergency)
     * @dev Only owner can call this
     */
    function emergencyWithdrawAll() external onlyOwner nonReentrant returns (uint256) {
        uint256 currentBalance = IERC20(aToken).balanceOf(address(this));
        require(currentBalance > 0, "No balance to withdraw");
        
        uint256 balanceBefore = address(this).balance;
        
        // Withdraw entire balance
        IWETHGateway(WETH_GATEWAY).withdrawETH(
            AAVE_POOL,
            currentBalance,
            address(this)
        );
        
        uint256 balanceAfter = address(this).balance;
        uint256 totalWithdrawn = balanceAfter - balanceBefore;
        
        // Transfer to vault
        (bool success, ) = vault.call{value: totalWithdrawn}("");
        require(success, "ETH transfer failed");
        
        // Reset state
        totalDeposited = 0;
        
        return totalWithdrawn;
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @notice Get total balance in Aave (principal + yields)
     */
    function getTotalBalance() external view returns (uint256) {
        return IERC20(aToken).balanceOf(address(this));
    }
    
    /**
     * @notice Get current yields earned
     */
    function getCurrentYields() external view returns (uint256) {
        uint256 currentBalance = IERC20(aToken).balanceOf(address(this));
        if (currentBalance <= totalDeposited) {
            return 0;
        }
        return currentBalance - totalDeposited;
    }
    
    /**
     * @notice Get current APY from Aave
     * @dev Returns APY in basis points (e.g., 250 = 2.5%)
     */
    function getCurrentAPY() external view returns (uint256) {
        IPool pool = IPool(AAVE_POOL);
        ReserveData memory reserveData = pool.getReserveData(WETH);
        
        // currentLiquidityRate is in ray (1e27)
        // Convert to basis points: rate / 1e23
        uint256 apy = uint256(reserveData.currentLiquidityRate) / 1e23;
        
        return apy;
    }
    
    /**
     * @notice Get strategy info
     */
    function getStrategyInfo() external view returns (
        uint256 deposited,
        uint256 currentBalance,
        uint256 currentYields,
        uint256 totalYields,
        uint256 apy
    ) {
        currentBalance = IERC20(aToken).balanceOf(address(this));
        currentYields = currentBalance > totalDeposited ? currentBalance - totalDeposited : 0;
        
        IPool pool = IPool(AAVE_POOL);
        ReserveData memory reserveData = pool.getReserveData(WETH);
        apy = uint256(reserveData.currentLiquidityRate) / 1e23;
        
        return (
            totalDeposited,
            currentBalance,
            currentYields,
            totalYieldsEarned,
            apy
        );
    }
    
    // ========== ADMIN FUNCTIONS ==========
    
    /**
     * @notice Update vault address
     * @param newVault New vault address
     */
    function updateVault(address newVault) external onlyOwner {
        require(newVault != address(0), "Invalid vault address");
        address oldVault = vault;
        vault = newVault;
        emit VaultUpdated(oldVault, newVault);
    }
    
    // ========== RECEIVE FUNCTION ==========
    
    receive() external payable {}
}
