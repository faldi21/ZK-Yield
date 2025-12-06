// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IVerifier
 * @notice Interface for Groth16 ZK-SNARK verifiers
 * @dev Auto-generated verifiers from SnarkJS implement this interface
 */
interface IVerifier {
    /**
     * @notice Verifies a Groth16 proof
     * @param a Proof point a
     * @param b Proof point b  
     * @param c Proof point c
     * @param input Public inputs array
     * @return True if proof is valid, false otherwise
     */
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external view returns (bool);
}
