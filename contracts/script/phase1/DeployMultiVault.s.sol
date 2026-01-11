// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../../src/StrategyVaultV2_Multi.sol";

contract DeployMultiVault is Script {
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address complianceManager = vm.envAddress("COMPLIANCE_MANAGER");
        address balanceVerifier = vm.envAddress("BALANCE_VERIFIER");
        
        console.log("Deploying Multi-Strategy Vault...");
        console.log("Compliance:", complianceManager);
        console.log("Verifier:", balanceVerifier);
        
        vm.startBroadcast(deployerPrivateKey);
        
        StrategyVaultV2Multi vault = new StrategyVaultV2Multi(
            complianceManager,
            balanceVerifier,
            0.001 ether
        );
        
        console.log("");
        console.log("VAULT DEPLOYED:", address(vault));
        console.log("");
        
        vm.stopBroadcast();
    }
}
