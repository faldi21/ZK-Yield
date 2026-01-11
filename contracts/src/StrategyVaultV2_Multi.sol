// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IComplianceManager {
    function isCompliant(address user) external view returns (bool);
}

interface IBalanceVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external view returns (bool);
}

interface IYieldStrategy {
    function deposit() external payable;
    function withdraw(uint256 amount) external returns (uint256);
    function harvest() external returns (uint256);
    function getBalance() external view returns (uint256);
    function getPendingYield() external view returns (uint256);
    function getAPY() external pure returns (uint256);
}

contract StrategyVaultV2Multi is Ownable, ReentrancyGuard, Pausable {
    // ========== STATE VARIABLES ==========

    IComplianceManager public complianceManager;
    IBalanceVerifier public balanceVerifier;
    uint256 public minBalanceThreshold;
    uint256 public totalValueLocked;
    uint256 public totalShares;

    mapping(address => uint256) public shares;
    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public totalUserDeposits;
    mapping(address => uint256) public totalUserWithdrawals;

    // ========== 3 STRATEGIES ==========

    address[3] public strategies; // 0: Aave, 1: Uniswap, 2: Lido
    string[3] public strategyNames = ["Aave", "Uniswap", "Lido"];
    uint256[3] public strategyAllocations; // basis points

    uint256 public lastAllocationTime;
    uint256 public allocationFrequency = 1 days;
    uint256 public performanceFee = 1000; // 10%
    uint256 public managementFee = 50; // 0.5%
    address public feeRecipient;

    // ========== EVENTS ==========

    event Deposited(
        address indexed user,
        uint256 amount,
        uint256 shares,
        uint256 timestamp
    );
    event Withdrawn(
        address indexed user,
        uint256 amount,
        uint256 shares,
        uint256 timestamp
    );
    event StrategyUpdated(uint256 indexed index, address strategy, string name);
    event AllocationsUpdated(uint256 aave, uint256 uniswap, uint256 lido);
    event FundsAllocated(
        uint256 aave,
        uint256 uniswap,
        uint256 lido,
        uint256 timestamp
    );
    event YieldHarvested(
        uint256 indexed strategyIndex,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyCompliant() {
        require(complianceManager.isCompliant(msg.sender), "Not compliant");
        _;
    }

    constructor(
        address _complianceManager,
        address _balanceVerifier,
        uint256 _minBalanceThreshold
    ) {
        complianceManager = IComplianceManager(_complianceManager);
        balanceVerifier = IBalanceVerifier(_balanceVerifier);
        minBalanceThreshold = _minBalanceThreshold;
        feeRecipient = msg.sender;
    }

    receive() external payable {
        // Accept ETH from strategies during withdrawal
    }
    // ========== DEPOSIT FUNCTIONS ==========

    /**
     * @notice Public deposit with compliance check
     * @dev Anyone with KYC can deposit
     */
    function deposit() external payable whenNotPaused nonReentrant {
        // Check KYC compliance
        require(complianceManager.isCompliant(msg.sender), "Not compliant");
        require(msg.value >= minBalanceThreshold, "Below minimum deposit");

        uint256 sharesToMint;
        if (totalShares == 0) {
            sharesToMint = msg.value;
        } else {
            sharesToMint = (msg.value * totalShares) / totalValueLocked;
        }

        shares[msg.sender] += sharesToMint;
        userDeposits[msg.sender] += msg.value;
        totalUserDeposits[msg.sender] += msg.value;
        totalShares += sharesToMint;
        totalValueLocked += msg.value;

        emit Deposited(msg.sender, msg.value, sharesToMint, block.timestamp);

        if (block.timestamp >= lastAllocationTime + allocationFrequency) {
            _allocateToStrategies();
        }
    }

    function deposit(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory publicSignals
    ) external payable onlyCompliant whenNotPaused nonReentrant {
        require(msg.value >= minBalanceThreshold, "Below minimum deposit");

        bool valid = balanceVerifier.verifyProof(a, b, c, publicSignals);
        require(valid, "Invalid balance proof");

        uint256 sharesToMint;
        if (totalShares == 0) {
            sharesToMint = msg.value;
        } else {
            sharesToMint = (msg.value * totalShares) / totalValueLocked;
        }

        shares[msg.sender] += sharesToMint;
        userDeposits[msg.sender] += msg.value;
        totalUserDeposits[msg.sender] += msg.value;
        totalShares += sharesToMint;
        totalValueLocked += msg.value;

        emit Deposited(msg.sender, msg.value, sharesToMint, block.timestamp);

        if (block.timestamp >= lastAllocationTime + allocationFrequency) {
            _allocateToStrategies();
        }
    }

    // ========== WITHDRAW FUNCTION ==========

    function withdraw(
        uint256 sharesToBurn
    ) external whenNotPaused nonReentrant {
        require(
            sharesToBurn > 0 && sharesToBurn <= shares[msg.sender],
            "Invalid shares"
        );

        uint256 ethAmount = (sharesToBurn * totalValueLocked) / totalShares;
        uint256 reserveBalance = address(this).balance;

        if (ethAmount > reserveBalance) {
            uint256 needed = ethAmount - reserveBalance;
            withdrawFromStrategies(needed);
        }

        shares[msg.sender] -= sharesToBurn;
        userDeposits[msg.sender] -= ethAmount;
        totalUserWithdrawals[msg.sender] += ethAmount;
        totalShares -= sharesToBurn;
        totalValueLocked -= ethAmount;

        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, ethAmount, sharesToBurn, block.timestamp);
    }

    // ========== STRATEGY MANAGEMENT ==========

    function updateStrategy(
        uint256 index,
        address strategy
    ) external onlyOwner {
        require(index < 3, "Invalid index");
        strategies[index] = strategy;
        emit StrategyUpdated(index, strategy, strategyNames[index]);
    }

    function updateAllocations(
        uint256 aavePercent,
        uint256 uniswapPercent,
        uint256 lidoPercent
    ) external onlyOwner {
        uint256 total = aavePercent + uniswapPercent + lidoPercent;
        require(total <= 10000, "Total > 100%");

        strategyAllocations[0] = aavePercent;
        strategyAllocations[1] = uniswapPercent;
        strategyAllocations[2] = lidoPercent;

        emit AllocationsUpdated(aavePercent, uniswapPercent, lidoPercent);
    }

    function allocateToStrategies() external onlyOwner whenNotPaused {
        _allocateToStrategies();
    }

    function _allocateToStrategies() internal {
        uint256 availableBalance = address(this).balance;
        if (availableBalance == 0) return;

        uint256[3] memory amounts;
        amounts[0] = (availableBalance * strategyAllocations[0]) / 10000;
        amounts[1] = (availableBalance * strategyAllocations[1]) / 10000;
        amounts[2] = (availableBalance * strategyAllocations[2]) / 10000;

        for (uint256 i = 0; i < 3; i++) {
            if (amounts[i] > 0 && strategies[i] != address(0)) {
                try IYieldStrategy(strategies[i]).deposit{value: amounts[i]}() {
                    // Success
                } catch {
                    // Failed, funds stay in vault
                }
            }
        }

        lastAllocationTime = block.timestamp;
        emit FundsAllocated(
            amounts[0],
            amounts[1],
            amounts[2],
            block.timestamp
        );
    }

    function harvestYields() external onlyOwner whenNotPaused nonReentrant {
        uint256 totalYields = 0;

        for (uint256 i = 0; i < 3; i++) {
            if (strategies[i] != address(0)) {
                try IYieldStrategy(strategies[i]).harvest() returns (
                    uint256 yields
                ) {
                    if (yields > 0) {
                        totalYields += yields;
                        totalValueLocked += yields;
                        emit YieldHarvested(i, yields, block.timestamp);
                    }
                } catch {
                    // Harvest failed, continue
                }
            }
        }

        if (
            totalYields > 0 && performanceFee > 0 && feeRecipient != address(0)
        ) {
            uint256 fee = (totalYields * performanceFee) / 10000;
            (bool success, ) = feeRecipient.call{value: fee}("");
            if (success) {
                totalValueLocked -= fee;
            }
        }
    }

    function harvestStrategy(
        uint256 index
    ) external onlyOwner whenNotPaused nonReentrant returns (uint256) {
        require(index < 3, "Invalid index");
        require(strategies[index] != address(0), "Strategy not set");

        uint256 yields = IYieldStrategy(strategies[index]).harvest();

        if (yields > 0) {
            totalValueLocked += yields;
            emit YieldHarvested(index, yields, block.timestamp);

            if (performanceFee > 0 && feeRecipient != address(0)) {
                uint256 fee = (yields * performanceFee) / 10000;
                (bool success, ) = feeRecipient.call{value: fee}("");
                if (success) {
                    totalValueLocked -= fee;
                }
            }
        }

        return yields;
    }

    function withdrawFromStrategies(
        uint256 ethAmount
    ) internal returns (uint256) {
        uint256 totalWithdrawn = 0;
        uint256 remaining = ethAmount;

        for (uint256 i = 0; i < 3; i++) {
            if (remaining == 0) break;
            if (strategies[i] == address(0)) continue;

            try IYieldStrategy(strategies[i]).getBalance() returns (
                uint256 strategyBalance
            ) {
                if (strategyBalance == 0) continue;

                uint256 toWithdraw = remaining > strategyBalance
                    ? strategyBalance
                    : remaining;

                try IYieldStrategy(strategies[i]).withdraw(toWithdraw) returns (
                    uint256 withdrawn
                ) {
                    totalWithdrawn += withdrawn;
                    remaining -= withdrawn;
                } catch {
                    // Withdrawal failed
                }
            } catch {
                // getBalance failed
            }
        }

        return totalWithdrawn;
    }

    // ========== VIEW FUNCTIONS ==========

    function balanceOf(address user) external view returns (uint256) {
        if (totalShares == 0) return 0;
        return (shares[user] * totalValueLocked) / totalShares;
    }

    function getVaultStats()
        external
        view
        returns (
            uint256 tvl,
            uint256 totalSharesValue,
            uint256 reserveBalance,
            uint256 allocatedBalance,
            uint256 currentAPY,
            uint256 sharePrice
        )
    {
        tvl = totalValueLocked;
        totalSharesValue = totalShares;
        reserveBalance = address(this).balance;
        allocatedBalance = getTotalAllocated();
        currentAPY = getWeightedAPY();
        sharePrice = totalShares > 0
            ? (totalValueLocked * 1e18) / totalShares
            : 1e18;
    }

    function getUserStats(
        address user
    )
        external
        view
        returns (
            uint256 userShares,
            uint256 userValue,
            uint256 deposited,
            uint256 withdrawn,
            uint256 netProfit
        )
    {
        userShares = shares[user];
        userValue = totalShares > 0
            ? (userShares * totalValueLocked) / totalShares
            : 0;
        deposited = totalUserDeposits[user];
        withdrawn = totalUserWithdrawals[user];
        netProfit = userValue + withdrawn > deposited
            ? userValue + withdrawn - deposited
            : 0;
    }

    function getTotalAllocated() public view returns (uint256) {
        uint256 total = 0;

        for (uint256 i = 0; i < 3; i++) {
            if (strategies[i] != address(0)) {
                try IYieldStrategy(strategies[i]).getBalance() returns (
                    uint256 balance
                ) {
                    total += balance;
                } catch {
                    // Failed, skip
                }
            }
        }

        return total;
    }

    function getStrategyBalances() external view returns (uint256[3] memory) {
        uint256[3] memory balances;

        for (uint256 i = 0; i < 3; i++) {
            if (strategies[i] != address(0)) {
                try IYieldStrategy(strategies[i]).getBalance() returns (
                    uint256 balance
                ) {
                    balances[i] = balance;
                } catch {
                    balances[i] = 0;
                }
            }
        }

        return balances;
    }

    function getStrategyAPYs() external view returns (uint256[3] memory) {
        uint256[3] memory apys;

        for (uint256 i = 0; i < 3; i++) {
            if (strategies[i] != address(0)) {
                try IYieldStrategy(strategies[i]).getAPY() returns (
                    uint256 apy
                ) {
                    apys[i] = apy;
                } catch {
                    apys[i] = 0;
                }
            }
        }

        return apys;
    }

    function getWeightedAPY() public view returns (uint256) {
        uint256 totalBalance = 0;
        uint256 weightedSum = 0;

        for (uint256 i = 0; i < 3; i++) {
            if (strategies[i] != address(0)) {
                try IYieldStrategy(strategies[i]).getBalance() returns (
                    uint256 balance
                ) {
                    totalBalance += balance;

                    try IYieldStrategy(strategies[i]).getAPY() returns (
                        uint256 apy
                    ) {
                        weightedSum += (balance * apy);
                    } catch {}
                } catch {}
            }
        }

        return totalBalance > 0 ? weightedSum / totalBalance : 0;
    }

    // ========== ADMIN FUNCTIONS ==========

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }

    // receive() external payable {}
}
