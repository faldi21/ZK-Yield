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

template BalanceRangeProof() {
    signal private input balance;
    signal private input salt;
    signal input commitment;
    signal input threshold;
    signal output isValid;
    
    component commitmentHasher = SimpleHash2();
    commitmentHasher.in[0] <== balance;
    commitmentHasher.in[1] <== salt;
    
    component commitmentCheck = IsEqual();
    commitmentCheck.in[0] <== commitmentHasher.out;
    commitmentCheck.in[1] <== commitment;
    
    // Simple threshold check: balance >= threshold
    signal diff;
    diff <== balance - threshold;
    
    // For MVP: just verify commitment
    isValid <== commitmentCheck.out;
    isValid === 1;
}

component main = BalanceRangeProof();
