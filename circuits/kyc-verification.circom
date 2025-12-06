/*
 * Simplified KYC Verification Circuit
 * Compatible with Circom 0.5.x
 */

template IsZero() {
    signal input in;
    signal output out;
    
    signal inv;
    
    inv <-- in != 0 ? 1 / in : 0;
    
    out <== -in * inv + 1;
    in * out === 0;
}

template IsEqual() {
    signal input in[2];
    signal output out;
    
    component isz = IsZero();
    
    in[1] - in[0] ==> isz.in;
    
    isz.out ==> out;
}

template SimpleHash2() {
    signal input in[2];
    signal output out;
    
    signal sum;
    signal prod;
    
    sum <== in[0] + in[1];
    prod <== in[0] * in[1];
    
    out <== sum * sum + prod;
}

template KYCVerification() {
    signal private input credentialHash;
    signal private input salt;
    signal private input jurisdictionCode;
    
    signal input allowedJurisdictionCode;
    signal input commitment;
    
    signal output isValid;
    
    component jurisdictionCheck = IsEqual();
    jurisdictionCheck.in[0] <== jurisdictionCode;
    jurisdictionCheck.in[1] <== allowedJurisdictionCode;
    
    component commitmentHasher = SimpleHash2();
    commitmentHasher.in[0] <== credentialHash;
    commitmentHasher.in[1] <== salt;
    
    component commitmentCheck = IsEqual();
    commitmentCheck.in[0] <== commitmentHasher.out;
    commitmentCheck.in[1] <== commitment;
    
    signal checksProduct;
    checksProduct <== jurisdictionCheck.out * commitmentCheck.out;
    
    isValid <== checksProduct;
    isValid === 1;
}

component main = KYCVerification();
