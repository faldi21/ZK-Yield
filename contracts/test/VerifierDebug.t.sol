// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/verifiers/Kyc-verificationVerifier.sol";

contract VerifierDebug is Test {
    Groth16Verifier verifier;

    function setUp() public {
        verifier = new Groth16Verifier();
    }

    function testVerifierCall() public {
        uint256[2] memory a = [uint256(1), uint256(2)];
        uint256[2][2] memory b = [
            [uint256(3), uint256(4)],
            [uint256(5), uint256(6)]
        ];
        uint256[2] memory c = [uint256(7), uint256(8)];
        uint256[3] memory input = [uint256(1), uint256(100), uint256(200)];

        // This call should return false, NOT revert
        try verifier.verifyProof(a, b, c, input) returns (bool result) {
            console.log("Result:", result);
        } catch Error(string memory reason) {
            console.log("Reverted with reason:", reason);
        } catch (bytes memory lowLevelData) {
            console.log("Reverted with low level data");
        }
    }
}
