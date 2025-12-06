pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/mux1.circom";

/*
 * Merkle Tree Verifier
 * Verifies that a leaf is included in a Merkle tree with a given root
 */
template MerkleTreeVerifier(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels]; // 0 or 1 for left or right
    
    signal output isValid;
    
    component hashers[levels];
    component mux[levels];
    
    signal hashes[levels + 1];
    hashes[0] <== leaf;
    
    for (var i = 0; i < levels; i++) {
        // Select left and right based on path index
        mux[i] = MultiMux1(2);
        mux[i].c[0][0] <== hashes[i];
        mux[i].c[0][1] <== pathElements[i];
        mux[i].c[1][0] <== pathElements[i];
        mux[i].c[1][1] <== hashes[i];
        mux[i].s <== pathIndices[i];
        
        // Hash the pair
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== mux[i].out[0];
        hashers[i].inputs[1] <== mux[i].out[1];
        
        hashes[i + 1] <== hashers[i].out;
    }
    
    // Check if computed root matches provided root
    component rootCheck = ForceEqualIfEnabled();
    rootCheck.in[0] <== hashes[levels];
    rootCheck.in[1] <== root;
    rootCheck.enabled <== 1;
    
    isValid <== 1;
}

/*
 * Helper: Force equal if enabled
 */
template ForceEqualIfEnabled() {
    signal input in[2];
    signal input enabled;
    
    signal diff;
    diff <== in[0] - in[1];
    
    // If enabled, diff must be 0
    diff * enabled === 0;
}

/*
 * Multi-input multiplexer
 */
template MultiMux1(n) {
    signal input c[2][n]; // Inputs
    signal input s;       // Selector (0 or 1)
    signal output out[n];
    
    for (var i = 0; i < n; i++) {
        out[i] <== c[0][i] + s * (c[1][i] - c[0][i]);
    }
}
