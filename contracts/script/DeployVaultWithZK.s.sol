// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/StrategyVaultV2_Multi.sol";

contract DeployVaultWithZK is Script {
    function run() external {
        // Get deployment config
        address complianceManager = 0x42b8554BED2bd24D7e5680558CFF82a6E3Fd4A79;
        address balanceVerifier = 0x705AF7A7794D68dbCe872d65541dCc83114E33E4; // New Groth16Verifier
        uint256 minDeposit = 0.001 ether;

        vm.startBroadcast();

        StrategyVaultV2Multi vault = new StrategyVaultV2Multi(
            complianceManager,
            balanceVerifier,
            minDeposit
        );

        console.log("Vault deployed to:", address(vault));

        vm.stopBroadcast();
    }
}
