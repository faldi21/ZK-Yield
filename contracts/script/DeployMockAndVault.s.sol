// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/StrategyVaultV2_Multi.sol";
import "../src/verifiers/MockVerifier.sol";

contract DeployMockAndVault is Script {
    function run() external {
        // Config: use same compliance manager as before
        address complianceManager = 0x42b8554BED2bd24D7e5680558CFF82a6E3Fd4A79;
        uint256 minDeposit = 0.001 ether;

        vm.startBroadcast();

        // 1. Deploy Mock Verifier
        MockVerifier verifier = new MockVerifier();
        console.log("Mock Verifier deployed to:", address(verifier));

        // 2. Deploy Vault with Mock Verifier
        StrategyVaultV2Multi vault = new StrategyVaultV2Multi(
            complianceManager,
            address(verifier),
            minDeposit
        );
        console.log("Vault (Mocked ZK) deployed to:", address(vault));

        vm.stopBroadcast();
    }
}
