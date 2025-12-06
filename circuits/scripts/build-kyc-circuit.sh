#!/bin/bash

# Build script for KYC Verification Circuit
# This script compiles the circuit, generates proving/verification keys,
# and exports the Solidity verifier contract

set -e

CIRCUIT_NAME="kyc-verification"
BUILD_DIR="build"
ARTIFACTS_DIR="artifacts"
PTAU_FILE="powersoftau_final_14.ptau"

echo "🔨 Building ${CIRCUIT_NAME} circuit..."

# Create directories if they don't exist
mkdir -p $BUILD_DIR
mkdir -p $ARTIFACTS_DIR

# Step 1: Compile the circuit
echo "📦 Step 1: Compiling circuit..."
circom ${CIRCUIT_NAME}.circom \
    --r1cs \
    --wasm \
    --sym \
    -o $BUILD_DIR

# Check if compilation was successful
if [ ! -f "$BUILD_DIR/${CIRCUIT_NAME}.r1cs" ]; then
    echo "❌ Error: Circuit compilation failed!"
    exit 1
fi

echo "✅ Circuit compiled successfully"

# Step 2: Get circuit info
echo "📊 Circuit information:"
snarkjs r1cs info $BUILD_DIR/${CIRCUIT_NAME}.r1cs

# Step 3: Setup Powers of Tau (if not exists)
if [ ! -f "$PTAU_FILE" ]; then
    echo "⚠️  Powers of Tau file not found. Downloading..."
    # Download a trusted Powers of Tau ceremony file
    # For production, use a ceremony file from a trusted source
    # For development/testing, we'll create a small one
    snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
    snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau \
        --name="First contribution" -v -e="random entropy"
    snarkjs powersoftau prepare phase2 pot14_0001.ptau $PTAU_FILE -v
    rm pot14_0000.ptau pot14_0001.ptau
fi

# Step 4: Generate initial zkey (Groth16 setup)
echo "🔑 Step 4: Generating proving key..."
snarkjs groth16 setup \
    $BUILD_DIR/${CIRCUIT_NAME}.r1cs \
    $PTAU_FILE \
    $ARTIFACTS_DIR/${CIRCUIT_NAME}_0000.zkey

# Step 5: Contribute to the phase 2 ceremony
echo "🎲 Step 5: Contributing to phase 2..."
snarkjs zkey contribute \
    $ARTIFACTS_DIR/${CIRCUIT_NAME}_0000.zkey \
    $ARTIFACTS_DIR/${CIRCUIT_NAME}_final.zkey \
    --name="First contribution" \
    -v \
    -e="random entropy for phase 2"

# Step 6: Export verification key
echo "📤 Step 6: Exporting verification key..."
snarkjs zkey export verificationkey \
    $ARTIFACTS_DIR/${CIRCUIT_NAME}_final.zkey \
    $ARTIFACTS_DIR/${CIRCUIT_NAME}_verification_key.json

# Step 7: Export Solidity verifier
echo "📜 Step 7: Generating Solidity verifier..."
snarkjs zkey export solidityverifier \
    $ARTIFACTS_DIR/${CIRCUIT_NAME}_final.zkey \
    ../contracts/src/verifiers/${CIRCUIT_NAME^}Verifier.sol

# Step 8: Generate verification info
echo "🔍 Verification key info:"
cat $ARTIFACTS_DIR/${CIRCUIT_NAME}_verification_key.json | head -20

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Generated files:"
echo "  - R1CS: $BUILD_DIR/${CIRCUIT_NAME}.r1cs"
echo "  - WASM: $BUILD_DIR/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm"
echo "  - Proving key: $ARTIFACTS_DIR/${CIRCUIT_NAME}_final.zkey"
echo "  - Verification key: $ARTIFACTS_DIR/${CIRCUIT_NAME}_verification_key.json"
echo "  - Solidity verifier: ../contracts/src/verifiers/${CIRCUIT_NAME^}Verifier.sol"
echo ""
echo "🎉 Circuit is ready for use!"
