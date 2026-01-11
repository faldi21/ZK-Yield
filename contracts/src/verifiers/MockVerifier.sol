// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external view returns (bool) {
        return true;
    }
}
