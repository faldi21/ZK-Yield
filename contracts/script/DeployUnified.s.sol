// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/StrategyVaultV2_Multi.sol";
import "../src/verifiers/Kyc-verificationVerifier.sol";

contract DeployUnified is Script {
    function run() external {
        // Config
        address complianceManager = 0x42b8554BED2bd24D7e5680558CFF82a6E3Fd4A79;
        uint256 minDeposit = 0.001 ether;

        vm.startBroadcast();

        // 1. Deploy Verifier
        Groth16Verifier verifier = new Groth16Verifier();
        console.log("Verifier deployed to:", address(verifier));

        // 2. Deploy Vault
        StrategyVaultV2Multi vault = new StrategyVaultV2Multi(
            complianceManager,
            address(verifier),
            minDeposit
        );
        console.log("Vault deployed to:", address(vault));

        vm.stopBroadcast();
    }
}
