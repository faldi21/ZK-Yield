// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MockAaveStrategy
 * @notice Mock implementation of Aave V3 lending strategy for demo/testing
 * @dev Simulates Aave lending with fake yields
 */
contract MockAaveStrategy is Ownable, ReentrancyGuard {
    // Strategy info
    string public constant name = "Mock Aave V3 Strategy";
    uint256 public constant BASE_APY = 450; // 4.5% in basis points

    // State
    uint256 public totalDeposited;
    uint256 public lastHarvestTime;
    uint256 public accumulatedYield;

    // Vault address
    address public vault;

    // Events
    event Deposited(uint256 amount, uint256 timestamp);
    event Withdrawn(uint256 amount, uint256 timestamp);
    event YieldHarvested(uint256 amount, uint256 timestamp);

    modifier onlyVault() {
        require(msg.sender == vault, "Only vault can call");
        _;
    }

    constructor(address _vault) {
        vault = _vault;
        lastHarvestTime = block.timestamp;
    }

    /**
     * @notice Deposit ETH to simulate Aave lending
     */
    function deposit() external payable onlyVault nonReentrant {
        require(msg.value > 0, "Amount must be > 0");

        totalDeposited += msg.value;

        emit Deposited(msg.value, block.timestamp);
    }

    /**
     * @notice Withdraw ETH from strategy
     */
    function withdraw(
        uint256 amount
    ) external onlyVault nonReentrant returns (uint256) {
        require(amount <= totalDeposited, "Insufficient balance");

        totalDeposited -= amount;

        (bool success, ) = vault.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(amount, block.timestamp);

        return amount;
    }

    /**
     * @notice Harvest yields and send to vault
     * @dev Simulates Aave interest accrual
     */
    function harvest() external onlyVault nonReentrant returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastHarvestTime;

        // Calculate mock yield: (totalDeposited * APY * timeElapsed) / (365 days * 10000)
        uint256 yield = (totalDeposited * BASE_APY * timeElapsed) /
            (365 days * 10000);

        if (yield > 0) {
            // Simulate yield by using contract balance or minting conceptually
            // For demo: add to accumulated yield
            accumulatedYield += yield;
            lastHarvestTime = block.timestamp;

            emit YieldHarvested(yield, block.timestamp);
        }

        return yield;
    }

    /**
     * @notice Get current APY
     */
    function getAPY() external pure returns (uint256) {
        return BASE_APY; // 4.5%
    }

    /**
     * @notice Get strategy balance
     */
    function getBalance() external view returns (uint256) {
        return totalDeposited;
    }

    /**
     * @notice Get estimated pending yield
     */
    function getPendingYield() external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastHarvestTime;
        return (totalDeposited * BASE_APY * timeElapsed) / (365 days * 10000);
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
