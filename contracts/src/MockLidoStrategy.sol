// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MockLidoStrategy
 * @notice Mock implementation of Lido staking strategy for demo/testing
 * @dev Simulates Lido ETH staking with fake staking rewards
 */
contract MockLidoStrategy is Ownable, ReentrancyGuard {
    
    // Strategy info
    string public constant name = "Mock Lido Staking Strategy";
    uint256 public constant BASE_APY = 380; // 3.8% in basis points
    
    // State
    uint256 public totalStaked;
    uint256 public lastHarvestTime;
    uint256 public accumulatedRewards;
    uint256 public totalValidators; // Mock validator count
    
    // Vault address
    address public vault;
    
    // Events
    event Staked(uint256 amount, uint256 timestamp);
    event Unstaked(uint256 amount, uint256 timestamp);
    event RewardsHarvested(uint256 amount, uint256 timestamp);
    event ValidatorsUpdated(uint256 count, uint256 timestamp);
    
    modifier onlyVault() {
        require(msg.sender == vault, "Only vault can call");
        _;
    }
    
    constructor(address _vault) {
        vault = _vault;
        lastHarvestTime = block.timestamp;
    }
    
    /**
     * @notice Deposit ETH to simulate Lido staking
     */
    function deposit() external payable onlyVault nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        
        totalStaked += msg.value;
        
        // Update mock validator count (32 ETH per validator)
        _updateValidatorCount();
        
        emit Staked(msg.value, block.timestamp);
    }
    
    /**
     * @notice Withdraw ETH from strategy (unstake)
     */
    function withdraw(uint256 amount) external onlyVault nonReentrant {
        require(amount <= totalStaked, "Insufficient balance");
        
        totalStaked -= amount;
        _updateValidatorCount();
        
        (bool success, ) = vault.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Unstaked(amount, block.timestamp);
    }
    
    /**
     * @notice Harvest staking rewards and send to vault
     * @dev Simulates Lido staking rewards
     */
    function harvest() external onlyVault nonReentrant returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastHarvestTime;
        
        // Calculate mock rewards: (totalStaked * APY * timeElapsed) / (365 days * 10000)
        uint256 rewards = (totalStaked * BASE_APY * timeElapsed) / (365 days * 10000);
        
        if (rewards > 0) {
            accumulatedRewards += rewards;
            lastHarvestTime = block.timestamp;
            
            emit RewardsHarvested(rewards, block.timestamp);
        }
        
        return rewards;
    }
    
    /**
     * @notice Update mock validator count
     */
    function _updateValidatorCount() internal {
        uint256 newCount = totalStaked / 32 ether;
        if (newCount != totalValidators) {
            totalValidators = newCount;
            emit ValidatorsUpdated(newCount, block.timestamp);
        }
    }
    
    /**
     * @notice Get current APY
     */
    function getAPY() external pure returns (uint256) {
        return BASE_APY; // 3.8%
    }
    
    /**
     * @notice Get strategy balance
     */
    function getBalance() external view returns (uint256) {
        return totalStaked;
    }
    
    /**
     * @notice Get estimated pending rewards
     */
    function getPendingYield() external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastHarvestTime;
        return (totalStaked * BASE_APY * timeElapsed) / (365 days * 10000);
    }
    
    /**
     * @notice Get staking statistics
     */
    function getStakingStats() external view returns (
        uint256 staked,
        uint256 validators,
        uint256 rewards,
        uint256 apy
    ) {
        return (totalStaked, totalValidators, accumulatedRewards, BASE_APY);
    }
    
    /**
     * @notice Get mock stETH exchange rate (1:1 for simplicity)
     */
    function getExchangeRate() external pure returns (uint256) {
        return 1 ether; // 1 stETH = 1 ETH
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
