// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../../src/StrategyVaultV2_Multi.sol";

contract DeployMultiStrategyVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address complianceManager = vm.envAddress("COMPLIANCE_MANAGER");
        address balanceVerifier = vm.envAddress("BALANCE_VERIFIER");

        console.log("Deploying Multi-Strategy Vault...");
        console.log("Compliance Manager:", complianceManager);
        console.log("Balance Verifier:", balanceVerifier);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy vault with 3 strategy support
        StrategyVaultV2Multi vault = new StrategyVaultV2Multi(
            complianceManager,
            balanceVerifier,
            0.001 ether // min deposit
        );

        console.log("StrategyVaultV2Multi deployed:", address(vault));
        console.log("");

        vm.stopBroadcast();

        console.log("=================================");
        console.log("DEPLOYMENT COMPLETE!");
        console.log("=================================");
        console.log("");
        console.log("Add to .env:");
        console.log("VAULT_V2=%s", address(vault));
        console.log("");
        console.log("Next steps:");
        console.log("1. Register 3 mock strategies");
        console.log("2. Set allocation percentages");
        console.log("3. Trigger allocation");
    }
}
