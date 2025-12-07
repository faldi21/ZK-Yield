// lib/zk-proof.ts
// Zero-Knowledge Proof generation utilities

import { utils } from 'snarkjs';

// For browser compatibility
const snarkjs = typeof window !== 'undefined' ? require('snarkjs') : null;

export interface KYCCredential {
  credentialHash: string;
  salt: string;
  jurisdictionCode: number;
}

export interface ZKProof {
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
  publicSignals: string[];
}

/**
 * Generate a random salt for commitment
 */
export function generateSalt(): string {
  // Generate 32 random bytes
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  
  // Convert to hex string
  return '0x' + Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Simple hash function for demo (in production, use proper hash)
 */
export function simpleHash(input1: string, input2: string): bigint {
  // For demo: simple combination
  // In production: use Poseidon hash or similar
  const combined = BigInt(input1) + BigInt(input2);
  return combined % BigInt(2n ** 253n); // Keep it in field
}

/**
 * Generate credential hash from user data
 */
export function generateCredentialHash(
  name: string,
  country: string,
  timestamp: number
): string {
  // For demo: simple hash of inputs
  // In production: proper cryptographic hash
  const data = `${name}-${country}-${timestamp}`;
  let hash = 0n;
  
  for (let i = 0; i < data.length; i++) {
    hash = (hash * 31n + BigInt(data.charCodeAt(i))) % BigInt(2n ** 253n);
  }
  
  return hash.toString();
}

/**
 * Calculate commitment from credential hash and salt
 */
export function calculateCommitment(
  credentialHash: string,
  salt: string
): string {
  const commitment = simpleHash(credentialHash, salt);
  return commitment.toString();
}

/**
 * Generate ZK proof for KYC verification
 */
export async function generateKYCProof(
  credential: KYCCredential,
  allowedJurisdiction: number
): Promise<{ proof: ZKProof; commitment: string }> {
  if (!snarkjs) {
    throw new Error('SnarkJS not available (server-side rendering)');
  }

  try {
    console.log('🔐 Generating ZK proof...');
    console.log('Credential:', credential);

    // Calculate commitment
    const commitment = calculateCommitment(
      credential.credentialHash,
      credential.salt
    );

    console.log('Commitment:', commitment);

    // Prepare circuit inputs
    const input = {
      credentialHash: credential.credentialHash,
      salt: credential.salt,
      jurisdictionCode: credential.jurisdictionCode.toString(),
      allowedJurisdictionCode: allowedJurisdiction.toString(),
      commitment: commitment,
    };

    console.log('Circuit inputs:', input);

    // Load WASM and zkey files
    const wasmPath = '/circuits/kyc-verification.wasm';
    const zkeyPath = '/circuits/kyc-verification_final.zkey';

    console.log('Loading circuit files...');

    // Generate witness and proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      wasmPath,
      zkeyPath
    );

    console.log('✅ Proof generated!');
    console.log('Proof:', proof);
    console.log('Public signals:', publicSignals);

    // Convert proof to format expected by smart contract
    const formattedProof: ZKProof = {
      a: [proof.pi_a[0], proof.pi_a[1]],
      b: [
        [proof.pi_b[0][1], proof.pi_b[0][0]], // Note: reversed order for pairing
        [proof.pi_b[1][1], proof.pi_b[1][0]],
      ],
      c: [proof.pi_c[0], proof.pi_c[1]],
      publicSignals: publicSignals,
    };

    return {
      proof: formattedProof,
      commitment,
    };
  } catch (error) {
    console.error('❌ Error generating proof:', error);
    throw error;
  }
}

/**
 * Verify proof locally (optional - for testing)
 */
export async function verifyProof(
  proof: ZKProof,
  publicSignals: string[]
): Promise<boolean> {
  if (!snarkjs) {
    throw new Error('SnarkJS not available');
  }

  try {
    const vkeyPath = '/circuits/kyc-verification_verification_key.json';
    
    // Fetch verification key
    const vkeyResponse = await fetch(vkeyPath);
    const vkey = await vkeyResponse.json();

    // Verify proof
    const isValid = await snarkjs.groth16.verify(
      vkey,
      publicSignals,
      proof
    );

    console.log('Proof verification result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
}

/**
 * Format proof for smart contract call
 */
export function formatProofForContract(proof: ZKProof) {
  return {
    a: proof.a,
    b: proof.b,
    c: proof.c,
  };
}

/**
 * Mock credential generator for demo
 */
export function generateMockCredential(
  name: string,
  jurisdiction: number
): KYCCredential {
  const timestamp = Date.now();
  const credentialHash = generateCredentialHash(name, 'US', timestamp);
  const salt = generateSalt();

  return {
    credentialHash,
    salt,
    jurisdictionCode: jurisdiction,
  };
}

/**
 * Generate mock balance proof for demo
 * In production: would verify actual balance > threshold
 */
export async function generateBalanceProof(
  balance: bigint,
  threshold: bigint
): Promise<{ proof: ZKProof; commitment: string }> {
  // For MVP: reuse KYC circuit structure
  // In production: separate balance circuit
  
  console.log('💰 Generating balance proof...');
  console.log('Balance:', balance.toString());
  console.log('Threshold:', threshold.toString());

  // Generate mock credential
  const salt = generateSalt();
  const balanceHash = balance.toString();
  const commitment = calculateCommitment(balanceHash, salt);

  // For demo: reuse KYC circuit with balance as "jurisdiction"
  // This is simplified - production would have dedicated circuit
  const mockCredential: KYCCredential = {
    credentialHash: balanceHash,
    salt: salt,
    jurisdictionCode: 1, // Mock - always pass
  };

  try {
    const result = await generateKYCProof(mockCredential, 1);
    console.log('✅ Balance proof generated!');
    return result;
  } catch (error) {
    console.error('❌ Error generating balance proof:', error);
    throw error;
  }
}
