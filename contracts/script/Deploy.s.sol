// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ComplianceManager.sol";
import "../src/StrategyVault.sol";

/**
 * @title DeployZKYield
 * @notice Deployment script for ZK-Yield contracts
 */
contract DeployZKYield is Script {
    // Deployment parameters
    uint256 constant ALLOWED_JURISDICTION = 1; // US jurisdiction
    uint256 constant MIN_TIMESTAMP = 1700000000; // Nov 2023
    uint256 constant MIN_BALANCE_THRESHOLD = 100000 ether; // $100K equivalent

    function run() external {
        // Load deployment key from environment
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy mock verifiers (for testnet)
        // In production, these would be the actual ZK verifiers from circuits
        console.log("Deploying Mock KYC Verifier...");
        MockVerifier kycVerifier = new MockVerifier();
        console.log("KYC Verifier deployed at:", address(kycVerifier));

        console.log("Deploying Mock Balance Verifier...");
        MockVerifier balanceVerifier = new MockVerifier();
        console.log("Balance Verifier deployed at:", address(balanceVerifier));

        // Step 2: Deploy ComplianceManager
        console.log("\nDeploying ComplianceManager...");
        ComplianceManager complianceManager = new ComplianceManager(
            address(kycVerifier),
            ALLOWED_JURISDICTION,
            MIN_TIMESTAMP
        );
        console.log("ComplianceManager deployed at:", address(complianceManager));

        // Step 3: Deploy StrategyVault
        console.log("\nDeploying StrategyVault...");
        StrategyVault vault = new StrategyVault(
            address(complianceManager),
            address(balanceVerifier),
            MIN_BALANCE_THRESHOLD
        );
        console.log("StrategyVault deployed at:", address(vault));

        vm.stopBroadcast();

        // Print deployment summary
        console.log("\n========================================");
        console.log("DEPLOYMENT SUMMARY");
        console.log("========================================");
        console.log("Network:", block.chainid);
        console.log("KYC Verifier:", address(kycVerifier));
        console.log("Balance Verifier:", address(balanceVerifier));
        console.log("ComplianceManager:", address(complianceManager));
        console.log("StrategyVault:", address(vault));
        console.log("========================================");
        console.log("\nSave these addresses for frontend integration!");
    }
}

/**
 * @title MockVerifier
 * @notice Mock verifier for testing
 */
contract MockVerifier {
    function verifyProof(
        uint[2] memory,
        uint[2][2] memory,
        uint[2] memory,
        uint[3] memory
    ) external pure returns (bool) {
        return true; // Always return true for testing
    }
}
