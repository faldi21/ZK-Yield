'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, COMPLIANCE_MANAGER_ABI } from '@/lib/contracts';
import { 
  generateMockCredential, 
  generateKYCProof, 
  formatProofForContract,
  type KYCCredential 
} from '@/lib/zk-proof';

export function KYCVerification() {
  const { address } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [jurisdiction, setJurisdiction] = useState(1); // 1 = US
  
  // Proof state
  const [credential, setCredential] = useState<KYCCredential | null>(null);
  const [proof, setProof] = useState<any>(null);
  const [commitment, setCommitment] = useState<string | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Step 1: Generate credential and ZK proof
   */
  const handleGenerateProof = async () => {
    if (!name) {
      setError('Please enter your name');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      console.log('📝 Step 1: Generating mock credential...');
      
      // Generate mock credential (in production: fetch from KYC provider)
      const mockCredential = generateMockCredential(name, jurisdiction);
      setCredential(mockCredential);
      
      console.log('✅ Credential generated:', mockCredential);
      console.log('📝 Step 2: Generating ZK proof...');
      
      // Generate ZK proof
      const result = await generateKYCProof(mockCredential, jurisdiction);
      
      setProof(result.proof);
      setCommitment(result.commitment);
      setProofGenerated(true);
      
      console.log('✅ Proof generated successfully!');
      console.log('Commitment:', result.commitment);
      
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to generate proof');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Step 2: Submit proof to smart contract
   */
  const handleSubmitProof = async () => {
    if (!proof || !commitment) {
      setError('No proof generated');
      return;
    }

    try {
      setError(null);
      
      console.log('📝 Step 3: Submitting proof to smart contract...');
      console.log('Contract:', CONTRACTS.complianceManager);
      console.log('Proof:', proof);
      console.log('Commitment:', commitment);

      const formattedProof = formatProofForContract(proof);
      
      // Call grantCompliance function
      writeContract({
        address: CONTRACTS.complianceManager,
        abi: COMPLIANCE_MANAGER_ABI,
        functionName: 'grantCompliance',
        args: [
          formattedProof.a,
          formattedProof.b,
          formattedProof.c,
          BigInt(commitment),
        ],
      });
      
    } catch (err: any) {
      console.error('❌ Error submitting proof:', err);
      setError(err.message || 'Failed to submit proof');
    }
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setProofGenerated(false);
    setProof(null);
    setCommitment(null);
    setCredential(null);
    setError(null);
  };

  if (!address) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">🔐 KYC Verification</h2>
        <p className="text-gray-400">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4">🔐 KYC Verification</h2>
      
      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-300">
          <strong>Demo Mode:</strong> In production, credentials come from KYC providers 
          (Coinbase, Civic, etc). For demo, we generate mock credentials to show the ZK proof mechanism.
        </p>
      </div>

      {!proofGenerated ? (
        <>
          {/* Step 1: Generate Proof */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name (Demo)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Jurisdiction
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value={1}>United States (1)</option>
                <option value={2}>European Union (2)</option>
                <option value={3}>Singapore (3)</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <p className="text-sm text-red-300">❌ {error}</p>
              </div>
            )}

            <button
              onClick={handleGenerateProof}
              disabled={isGenerating || !name}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Generating Proof...
                </span>
              ) : (
                '🔐 Generate ZK Proof'
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Step 2: Submit Proof */}
          <div className="space-y-4">
            {/* Success Message */}
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-300 font-medium mb-2">
                ✅ ZK Proof Generated Successfully!
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Name: {name}</p>
                <p>Jurisdiction: {jurisdiction === 1 ? 'US' : jurisdiction === 2 ? 'EU' : 'Singapore'}</p>
                <p className="font-mono text-xs break-all">
                  Commitment: {commitment?.slice(0, 20)}...
                </p>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
              <p className="text-sm text-purple-300">
                🔒 <strong>Privacy Guaranteed:</strong> Your personal data (name, exact credential) 
                is NOT sent to the blockchain. Only the ZK proof and commitment are submitted.
              </p>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <p className="text-sm text-red-300">❌ {error}</p>
              </div>
            )}

            {isSuccess && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <p className="text-green-300 font-medium">
                  🎉 Compliance Granted! You can now use the platform.
                </p>
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block"
                >
                  View transaction →
                </a>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmitProof}
                disabled={isPending || isConfirming || isSuccess}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    {isPending ? 'Confirm in wallet...' : 'Submitting...'}
                  </span>
                ) : isSuccess ? (
                  '✅ Submitted!'
                ) : (
                  '📤 Submit to Blockchain'
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={isPending || isConfirming}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Gas Estimate */}
            <div className="text-xs text-gray-500 text-center">
              Estimated gas: ~111,000 gas (~$0.20 on Base Sepolia)
            </div>
          </div>
        </>
      )}

      {/* How it Works */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <details className="cursor-pointer">
          <summary className="text-sm font-medium text-gray-400 hover:text-gray-300">
            🤔 How does this work?
          </summary>
          <div className="mt-3 text-xs text-gray-500 space-y-2">
            <p>
              <strong>1. Generate Credential:</strong> Creates a cryptographic hash of your KYC data
            </p>
            <p>
              <strong>2. Generate Proof:</strong> Creates a zero-knowledge proof that you're from an allowed jurisdiction
            </p>
            <p>
              <strong>3. Submit:</strong> Sends only the proof + commitment to blockchain (NOT your personal data!)
            </p>
            <p>
              <strong>4. Verify:</strong> Smart contract verifies the proof mathematically
            </p>
            <p className="text-green-400">
              ✅ Result: You're verified without exposing your identity!
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
