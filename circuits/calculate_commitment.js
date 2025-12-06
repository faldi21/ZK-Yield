const credentialHash = BigInt(process.argv[2] || "12345");
const salt = BigInt(process.argv[3] || "67890");

const sum = credentialHash + salt;
const prod = credentialHash * salt;
const commitment = sum * sum + prod;

console.log(commitment.toString());
