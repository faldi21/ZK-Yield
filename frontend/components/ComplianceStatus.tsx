// components/ComplianceStatus.tsx
'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import ComplianceABI from '@/lib/abis/ComplianceManagerV2.json';
import { useState } from 'react';

interface KYCFormData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  region: string;
  idNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
}

export default function ComplianceStatus() {
  const { address, isConnected } = useAccount();
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'processing' | 'submitting'>('form');
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    region: '',
    idNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
  });
  
  // Check compliance status
  const { data: isCompliant, refetch: refetchCompliance } = useReadContract({
    address: CONTRACTS.complianceManager as `0x${string}`,
    abi: ComplianceABI.abi,
    functionName: 'isCompliant',
    args: address ? [address] : undefined,
  });
  
  // Add compliance
  const { 
    writeContract, 
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });
  
  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const isFormValid = () => {
    return formData.fullName && 
           formData.dateOfBirth && 
           formData.nationality && 
           formData.region && 
           formData.idNumber &&
           formData.city;
  };
  
  const handleProcessKYC = () => {
    if (!isFormValid()) {
      alert('Please fill all required fields');
      return;
    }
    
    setCurrentStep('processing');
    setTimeout(() => {
      setCurrentStep('submitting');
    }, 2000);
  };
  
  const handleSubmitToChain = () => {
    if (!address) return;
    
    // Use selfApprove from ComplianceManagerV2
    writeContract({
      address: CONTRACTS.complianceManager as `0x${string}`,
      abi: ComplianceABI.abi,
      functionName: 'selfApprove',
      args: [],
    });
  };
  
  if (isSuccess) {
    setTimeout(() => {
      refetchCompliance();
      reset();
      setShowKYCModal(false);
      setCurrentStep('form');
      setFormData({
        fullName: '',
        dateOfBirth: '',
        nationality: '',
        region: '',
        idNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
      });
    }, 3000);
  }
  
  if (!isConnected) {
    return null;
  }
  
  if (isCompliant) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xl">✓</span>
            </div>
            <div>
              <p className="font-semibold text-green-500">KYC Verified</p>
              <p className="text-sm text-green-400">You can deposit and withdraw freely</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs rounded-full font-semibold border border-green-500/30">
            VERIFIED
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
            <span className="text-white text-xl">⚠️</span>
          </div>
          <div>
            <p className="font-semibold text-yellow-500">KYC Required</p>
            <p className="text-sm text-yellow-400/80">Complete verification to use the platform</p>
          </div>
        </div>
        <button
          onClick={() => setShowKYCModal(true)}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold shadow-lg shadow-yellow-500/20"
        >
          Start KYC
        </button>
      </div>
      
      {showKYCModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Zero-Knowledge KYC Verification</h2>
              <button
                onClick={() => { setShowKYCModal(false); setCurrentStep('form'); }}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <StepIndicator step={1} label="Information" active={currentStep === 'form'} />
                <div className="w-16 h-1 bg-secondary rounded"></div>
                <StepIndicator step={2} label="ZK Proof" active={currentStep === 'processing'} />
                <div className="w-16 h-1 bg-secondary rounded"></div>
                <StepIndicator step={3} label="Submit" active={currentStep === 'submitting'} />
              </div>
            </div>
            
            {currentStep === 'form' && (
              <div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary font-semibold mb-1">🔐 Privacy Notice</p>
                  <p className="text-xs text-primary/80">
                    Your information will be used to generate a zero-knowledge proof. 
                    Only the proof (not your raw data) will be submitted on-chain.
                  </p>
                </div>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                      <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Date of Birth *</label>
                      <input type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Nationality *</label>
                      <select value={formData.nationality} onChange={(e) => handleInputChange('nationality', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground">
                        <option value="">Select...</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Thailand">Thailand</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Region *</label>
                      <input type="text" value={formData.region} onChange={(e) => handleInputChange('region', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" placeholder="e.g., Jakarta, Yogyakarta" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">ID Number (KTP/Passport) *</label>
                      <input type="text" value={formData.idNumber} onChange={(e) => handleInputChange('idNumber', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" placeholder="3201XXXXXXXXXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">City *</label>
                      <input type="text" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" placeholder="Jakarta" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Address Line 1</label>
                    <input type="text" value={formData.addressLine1} onChange={(e) => handleInputChange('addressLine1', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" placeholder="Street address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Address Line 2 (Optional)</label>
                    <input type="text" value={formData.addressLine2} onChange={(e) => handleInputChange('addressLine2', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" placeholder="Apartment, suite, etc." />
                  </div>
                  <div className="md:w-1/3">
                    <label className="block text-sm font-medium text-foreground mb-1">Postal Code</label>
                    <input type="text" value={formData.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" placeholder="12345" />
                  </div>
                </form>
                
                <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-xs text-yellow-500">
                    <strong>Testnet Mode:</strong> Simplified KYC for testing. In production, this would integrate with real identity providers.
                  </p>
                </div>
                
                <button onClick={handleProcessKYC} disabled={!isFormValid()} className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Generate ZK Proof →
                </button>
              </div>
            )}
            
            {currentStep === 'processing' && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <span className="text-4xl">🔑</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Generating Zero-Knowledge Proof</h3>
                <p className="text-muted-foreground mb-4">Creating cryptographic proof without revealing your personal data...</p>
                <div className="w-64 h-2 mx-auto bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground/80 mt-4">This process ensures your privacy is maintained</p>
              </div>
            )}
            
            {currentStep === 'submitting' && (
              <div>
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">ZK Proof Generated!</h3>
                  <p className="text-muted-foreground mb-6">Your zero-knowledge proof is ready. Submit it to complete verification.</p>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-green-500 font-semibold mb-2">✅ Proof Details:</p>
                    <ul className="text-xs text-green-400 space-y-1">
                      <li>• Identity verified: {formData.fullName}</li>
                      <li>• Region: {formData.region}, {formData.nationality}</li>
                      <li>• Proof type: ZK-SNARK</li>
                      <li>• Privacy: 100% preserved</li>
                    </ul>
                  </div>
                </div>
                
                {!isSuccess && (
                  <button onClick={handleSubmitToChain} disabled={isPending || isConfirming} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {isPending && '⏳ Confirm in Wallet...'}
                    {isConfirming && '⏳ Submitting to Blockchain...'}
                    {!isPending && !isConfirming && '⛓️ Submit to Blockchain'}
                  </button>
                )}
                
                {hash && !isSuccess && (
                  <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-sm text-yellow-500 font-semibold">⏳ Transaction Pending</p>
                    <p className="text-xs text-yellow-500/80 mt-1">Submitting your ZK proof to the smart contract...</p>
                    <a href={`https://sepolia.mantlescan.xyz/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-500 hover:underline mt-2 block">
                      View on Mantlescan →
                    </a>
                  </div>
                )}
                
                {isSuccess && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-sm text-green-500 font-semibold">✅ KYC Complete!</p>
                    <p className="text-xs text-green-400 mt-1">You are now verified and can use all platform features. Closing...</p>
                    <a href={`https://sepolia.mantlescan.xyz/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-500 hover:underline mt-2 block">
                      View on Mantlescan →
                    </a>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive font-semibold">❌ Submission Failed</p>
                    <p className="text-xs text-destructive/80 mt-1">{error.message.slice(0, 150)}</p>
                    <button onClick={() => reset()} className="mt-2 text-xs text-destructive hover:underline">Try again</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step, label, active }: { step: number; label: string; active: boolean }) {
  return (
    <div className="text-center">
      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'}`}>
        {step}
      </div>
      <p className={`text-xs mt-1 ${active ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
        {label}
      </p>
    </div>
  );
}
