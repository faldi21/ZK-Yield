// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../../src/MockAaveStrategy.sol";
import "../../src/MockUniswapStrategy.sol";
import "../../src/MockLidoStrategy.sol";

/**
 * @title DeployMockStrategies
 * @notice Deploy all mock strategies for testing/demo
 */
contract DeployMockStrategies is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address vaultAddress = vm.envAddress("VAULT_V2");

        console.log("Deploying Mock Strategies...");
        console.log("Vault:", vaultAddress);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Mock Aave Strategy
        MockAaveStrategy aaveStrategy = new MockAaveStrategy(vaultAddress);
        console.log("MockAaveStrategy deployed:", address(aaveStrategy));
        console.log("  - Name:", aaveStrategy.name());
        console.log("  - APY: 4.5%");
        console.log("");

        // Deploy Mock Uniswap Strategy
        MockUniswapStrategy uniswapStrategy = new MockUniswapStrategy(
            vaultAddress
        );
        console.log("MockUniswapStrategy deployed:", address(uniswapStrategy));
        console.log("  - Name:", uniswapStrategy.name());
        console.log("  - APY: 12.3%");
        console.log("");

        // Deploy Mock Lido Strategy
        MockLidoStrategy lidoStrategy = new MockLidoStrategy(vaultAddress);
        console.log("MockLidoStrategy deployed:", address(lidoStrategy));
        console.log("  - Name:", lidoStrategy.name());
        console.log("  - APY: 3.8%");
        console.log("");

        vm.stopBroadcast();

        // Save addresses
        console.log("=================================");
        console.log("DEPLOYMENT COMPLETE!");
        console.log("=================================");
        console.log("");
        console.log("Add to .env:");
        console.log("MOCK_AAVE_STRATEGY=%s", address(aaveStrategy));
        console.log("MOCK_UNISWAP_STRATEGY=%s", address(uniswapStrategy));
        console.log("MOCK_LIDO_STRATEGY=%s", address(lidoStrategy));
        console.log("");
        console.log("Next steps:");
        console.log("1. Add strategies to vault using updateStrategy()");
        console.log("2. Set allocation percentages");
        console.log("3. Enable auto-allocation");
    }
}
