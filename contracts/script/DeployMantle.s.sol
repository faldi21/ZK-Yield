// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

import "../src/ComplianceManagerV2.sol";
import "../src/StrategyVaultV2_Multi.sol";
import "../src/verifiers/MockVerifier.sol";
import "../src/MockAaveStrategy.sol";
import "../src/MockUniswapStrategy.sol";
import "../src/MockLidoStrategy.sol";

contract DeployMantle is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        console.log("Starting Deployment to Mantle Sepolia...");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Verifiers
        // ALREADY DEPLOYED:
        MockVerifier kycVerifier = MockVerifier(
            0xcF58A15E61CA885cbb158e8Ea8c2224C59D8BA45
        );
        console.log("KYC Verifier (Reused):", address(kycVerifier));

        MockVerifier balanceVerifier = MockVerifier(
            0x1C43248802896b172Aa804dc3FAb1cFF2277a078
        );
        console.log("Balance Verifier (Reused):", address(balanceVerifier));

        // 2. Deploy Compliance Manager
        // ALREADY DEPLOYED:
        ComplianceManagerV2 complianceManager = ComplianceManagerV2(
            0x29f904256DbbaD523316e2de65203351E2D07291
        );
        console.log(
            "Compliance Manager V2 (Reused):",
            address(complianceManager)
        );

        // 3. Deploy Strategy Vault
        uint256 minDeposit = 0.001 ether;
        StrategyVaultV2Multi vault = new StrategyVaultV2Multi(
            address(complianceManager),
            address(balanceVerifier),
            minDeposit
        );
        console.log("StrategyVaultV2Multi:", address(vault));

        // 4. Deploy Strategies
        MockAaveStrategy aave = new MockAaveStrategy(address(vault));
        console.log("Strategy Aave:", address(aave));

        MockUniswapStrategy uniswap = new MockUniswapStrategy(address(vault));
        console.log("Strategy Uniswap:", address(uniswap));

        MockLidoStrategy lido = new MockLidoStrategy(address(vault));
        console.log("Strategy Lido:", address(lido));

        // 5. Configure Vault
        vault.updateStrategy(0, address(aave));
        vault.updateStrategy(1, address(uniswap));
        vault.updateStrategy(2, address(lido));

        // Initial allocation: 40% Aave, 40% Uniswap, 20% Lido
        vault.updateAllocations(4000, 4000, 2000);
        console.log("Vault Configured with Strategies");

        vm.stopBroadcast();

        console.log("=================================");
        console.log("DEPLOYMENT COMPLETE");
        console.log("=================================");
        console.log("Add these to your frontend .env.local:");
        console.log(
            "NEXT_PUBLIC_COMPLIANCE_MANAGER=",
            address(complianceManager)
        );
        console.log("NEXT_PUBLIC_STRATEGY_VAULT=", address(vault)); // Note: update CONTRACTS.strategyVault in lib/contracts.ts
        console.log("NEXT_PUBLIC_MOCK_AAVE_STRATEGY=", address(aave));
        console.log("NEXT_PUBLIC_MOCK_UNISWAP_STRATEGY=", address(uniswap));
        console.log("NEXT_PUBLIC_MOCK_LIDO_STRATEGY=", address(lido));
    }
}
