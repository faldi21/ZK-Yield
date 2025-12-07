// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ComplianceManager.sol";
import "../src/StrategyVault.sol";

contract MockVerifier {
    function verifyProof(
        uint256[2] memory,
        uint256[2][2] memory,
        uint256[2] memory,
        uint256[1] memory
    ) public pure returns (bool) {
        return true; // Mock - always returns true
    }
}

contract DeployZKYield is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy mock verifiers
        MockVerifier kycVerifier = new MockVerifier();
        MockVerifier balanceVerifier = new MockVerifier();

        // Deploy ComplianceManager
        // jurisdiction = 1 (US), minTimestamp = 0
        ComplianceManager complianceManager = new ComplianceManager(
            address(kycVerifier),
            1,
            0
        );

        // Deploy StrategyVault
        // UPDATED: minBalanceThreshold = 0.001 ETH (instead of 100K)
        StrategyVault vault = new StrategyVault(
            address(complianceManager),
            address(balanceVerifier),
            0.001 ether  // 0.001 ETH minimum for testnet!
        );

        vm.stopBroadcast();

        console.log("KYC Verifier:", address(kycVerifier));
        console.log("Balance Verifier:", address(balanceVerifier));
        console.log("ComplianceManager:", address(complianceManager));
        console.log("StrategyVault:", address(vault));
    }
}
