// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MockUniswapStrategy
 * @notice Mock implementation of Uniswap V3 LP strategy for demo/testing
 * @dev Simulates Uniswap LP positions with fake trading fees
 */
contract MockUniswapStrategy is Ownable, ReentrancyGuard {
    
    // Strategy info
    string public constant name = "Mock Uniswap V3 LP Strategy";
    uint256 public constant BASE_APY = 1230; // 12.3% in basis points
    
    // State
    uint256 public totalDeposited;
    uint256 public lastHarvestTime;
    uint256 public accumulatedFees;
    uint256 public totalTradingVolume; // Mock trading volume
    
    // Vault address
    address public vault;
    
    // Events
    event Deposited(uint256 amount, uint256 timestamp);
    event Withdrawn(uint256 amount, uint256 timestamp);
    event FeesHarvested(uint256 amount, uint256 timestamp);
    event TradingVolumeGenerated(uint256 volume, uint256 timestamp);
    
    modifier onlyVault() {
        require(msg.sender == vault, "Only vault can call");
        _;
    }
    
    constructor(address _vault) {
        vault = _vault;
        lastHarvestTime = block.timestamp;
    }
    
    /**
     * @notice Deposit ETH to simulate Uniswap LP position
     */
    function deposit() external payable onlyVault nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        
        totalDeposited += msg.value;
        
        // Simulate some initial trading volume
        _generateMockVolume();
        
        emit Deposited(msg.value, block.timestamp);
    }
    
    /**
     * @notice Withdraw ETH from strategy
     */
    function withdraw(uint256 amount) external onlyVault nonReentrant {
        require(amount <= totalDeposited, "Insufficient balance");
        
        totalDeposited -= amount;
        
        (bool success, ) = vault.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(amount, block.timestamp);
    }
    
    /**
     * @notice Harvest trading fees and send to vault
     * @dev Simulates Uniswap V3 fee collection
     */
    function harvest() external onlyVault nonReentrant returns (uint256) {
        // Generate mock trading volume
        _generateMockVolume();
        
        uint256 timeElapsed = block.timestamp - lastHarvestTime;
        
        // Calculate mock fees: (totalDeposited * APY * timeElapsed) / (365 days * 10000)
        uint256 fees = (totalDeposited * BASE_APY * timeElapsed) / (365 days * 10000);
        
        if (fees > 0) {
            accumulatedFees += fees;
            lastHarvestTime = block.timestamp;
            
            emit FeesHarvested(fees, block.timestamp);
        }
        
        return fees;
    }
    
    /**
     * @notice Generate mock trading volume
     */
    function _generateMockVolume() internal {
        // Simulate random trading volume (5-20x the deposited amount per day)
        uint256 mockVolume = totalDeposited * (5 + (block.timestamp % 16));
        totalTradingVolume += mockVolume;
        
        emit TradingVolumeGenerated(mockVolume, block.timestamp);
    }
    
    /**
     * @notice Get current APY
     */
    function getAPY() external pure returns (uint256) {
        return BASE_APY; // 12.3%
    }
    
    /**
     * @notice Get strategy balance
     */
    function getBalance() external view returns (uint256) {
        return totalDeposited;
    }
    
    /**
     * @notice Get estimated pending fees
     */
    function getPendingYield() external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastHarvestTime;
        return (totalDeposited * BASE_APY * timeElapsed) / (365 days * 10000);
    }
    
    /**
     * @notice Get mock trading statistics
     */
    function getTradingStats() external view returns (
        uint256 volume,
        uint256 feesCollected,
        uint256 positionValue
    ) {
        return (totalTradingVolume, accumulatedFees, totalDeposited);
    }
    
    /**
     * @notice Emergency withdraw all funds
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = vault.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @notice Update vault address
     */
    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "Invalid address");
        vault = _vault;
    }
    
    // Receive function to accept ETH
    receive() external payable {}
}
