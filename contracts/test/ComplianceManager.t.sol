// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ComplianceManager.sol";
import "../src/interfaces/IVerifier.sol";

/**
 * @title MockVerifier
 * @notice Mock verifier for testing
 */
contract MockVerifier is IVerifier {
    bool public shouldReturnValid = true;

    function verifyProof(
        uint[2] memory,
        uint[2][2] memory,
        uint[2] memory,
        uint[3] memory
    ) external view override returns (bool) {
        return shouldReturnValid;
    }

    function setShouldReturnValid(bool _valid) external {
        shouldReturnValid = _valid;
    }
}

/**
 * @title ComplianceManagerTest
 * @notice Test suite for ComplianceManager contract
 */
contract ComplianceManagerTest is Test {
    ComplianceManager public complianceManager;
    MockVerifier public mockVerifier;

    address public owner;
    address public user1;
    address public user2;

    uint256 constant ALLOWED_JURISDICTION = 1;
    uint256 constant MIN_TIMESTAMP = 1700000000;
    uint256 constant COMMITMENT_1 = 12345;
    uint256 constant COMMITMENT_2 = 67890;

    // Mock proof data
    uint[2] mockA = [uint(1), uint(2)];
    uint[2][2] mockB = [[uint(3), uint(4)], [uint(5), uint(6)]];
    uint[2] mockC = [uint(7), uint(8)];

    event ComplianceGranted(address indexed user, uint256 indexed commitment, uint256 tokenId);
    event ComplianceRevoked(address indexed user, uint256 indexed commitment);

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy mock verifier
        mockVerifier = new MockVerifier();

        // Deploy ComplianceManager
        complianceManager = new ComplianceManager(
            address(mockVerifier),
            ALLOWED_JURISDICTION,
            MIN_TIMESTAMP
        );
    }

    /**
     * Test: Initial state
     */
    function test_InitialState() public view {
        assertEq(address(complianceManager.kycVerifier()), address(mockVerifier));
        assertEq(complianceManager.allowedJurisdiction(), ALLOWED_JURISDICTION);
        assertEq(complianceManager.minTimestamp(), MIN_TIMESTAMP);
        assertEq(complianceManager.owner(), owner);
        assertEq(complianceManager.nextTokenId(), 1);
    }

    /**
     * Test: Grant compliance with valid proof
     */
    function test_GrantCompliance_Success() public {
        vm.startPrank(user1);

        vm.expectEmit(true, true, false, true);
        emit ComplianceGranted(user1, COMMITMENT_1, 1);

        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);

        assertTrue(complianceManager.isCompliant(user1));
        assertEq(complianceManager.commitmentToAddress(COMMITMENT_1), user1);
        assertEq(complianceManager.addressToCommitment(user1), COMMITMENT_1);
        assertEq(complianceManager.nextTokenId(), 2);

        vm.stopPrank();
    }

    /**
     * Test: Grant compliance fails with invalid proof
     */
    function test_GrantCompliance_InvalidProof() public {
        // Set verifier to return false
        mockVerifier.setShouldReturnValid(false);

        vm.startPrank(user1);
        vm.expectRevert(ComplianceManager.InvalidProof.selector);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);
        vm.stopPrank();
    }

    /**
     * Test: Cannot grant compliance twice
     */
    function test_GrantCompliance_AlreadyCompliant() public {
        vm.startPrank(user1);
        
        // First grant succeeds
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);
        
        // Second grant fails
        vm.expectRevert(ComplianceManager.AlreadyCompliant.selector);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_2);
        
        vm.stopPrank();
    }

    /**
     * Test: Cannot reuse commitment
     */
    function test_GrantCompliance_CommitmentAlreadyUsed() public {
        // User1 gets compliant
        vm.prank(user1);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);

        // User2 tries to use same commitment
        vm.prank(user2);
        vm.expectRevert(ComplianceManager.CommitmentAlreadyUsed.selector);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);
    }

    /**
     * Test: Revoke compliance
     */
    function test_RevokeCompliance_Success() public {
        // Grant compliance first
        vm.prank(user1);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);

        // Owner revokes
        vm.expectEmit(true, true, false, true);
        emit ComplianceRevoked(user1, COMMITMENT_1);
        
        complianceManager.revokeCompliance(user1);

        assertFalse(complianceManager.isCompliant(user1));
        assertEq(complianceManager.commitmentToAddress(COMMITMENT_1), address(0));
        assertEq(complianceManager.addressToCommitment(user1), 0);
    }

    /**
     * Test: Only owner can revoke
     */
    function test_RevokeCompliance_OnlyOwner() public {
        vm.prank(user1);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);

        vm.prank(user2);
        vm.expectRevert(ComplianceManager.Unauthorized.selector);
        complianceManager.revokeCompliance(user1);
    }

    /**
     * Test: Update jurisdiction
     */
    function test_UpdateJurisdiction() public {
        uint256 newJurisdiction = 2;
        complianceManager.updateJurisdiction(newJurisdiction);
        assertEq(complianceManager.allowedJurisdiction(), newJurisdiction);
    }

    /**
     * Test: Only owner can update jurisdiction
     */
    function test_UpdateJurisdiction_OnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert(ComplianceManager.Unauthorized.selector);
        complianceManager.updateJurisdiction(2);
    }

    /**
     * Test: Check compliance
     */
    function test_CheckCompliance() public {
        assertFalse(complianceManager.checkCompliance(user1));

        vm.prank(user1);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);

        assertTrue(complianceManager.checkCompliance(user1));
    }

    /**
     * Test: Transfer ownership
     */
    function test_TransferOwnership() public {
        complianceManager.transferOwnership(user1);
        assertEq(complianceManager.owner(), user1);
    }

    /**
     * Test: Multiple users can get compliant
     */
    function test_MultipleUsers() public {
        vm.prank(user1);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_1);

        vm.prank(user2);
        complianceManager.grantCompliance(mockA, mockB, mockC, COMMITMENT_2);

        assertTrue(complianceManager.isCompliant(user1));
        assertTrue(complianceManager.isCompliant(user2));
        assertEq(complianceManager.nextTokenId(), 3);
    }
}
