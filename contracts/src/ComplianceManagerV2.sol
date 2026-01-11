// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ComplianceManagerV2
 * @notice Improved compliance manager with self-approval for testnet
 */
contract ComplianceManagerV2 is Ownable {
    
    mapping(address => bool) public compliantUsers;
    bool public selfApprovalEnabled = true; // Testnet mode
    
    event UserCompliant(address indexed user, bool status);
    event SelfApprovalToggled(bool enabled);
    
    constructor() {}
    
    /**
     * @notice Check if user is compliant
     */
    function isCompliant(address user) external view returns (bool) {
        return compliantUsers[user];
    }
    
    /**
     * @notice Owner adds compliant user
     */
    function addCompliantUser(address user) external onlyOwner {
        require(!compliantUsers[user], "Already compliant");
        compliantUsers[user] = true;
        emit UserCompliant(user, true);
    }
    
    /**
     * @notice Self-approval (testnet only)
     * @dev Anyone can approve themselves if enabled
     */
    function selfApprove() external {
        require(selfApprovalEnabled, "Self-approval disabled");
        require(!compliantUsers[msg.sender], "Already compliant");
        
        compliantUsers[msg.sender] = true;
        emit UserCompliant(msg.sender, true);
    }
    
    /**
     * @notice Owner removes compliant user
     */
    function removeCompliantUser(address user) external onlyOwner {
        require(compliantUsers[user], "Not compliant");
        compliantUsers[user] = false;
        emit UserCompliant(user, false);
    }
    
    /**
     * @notice Toggle self-approval (for mainnet deployment)
     */
    function toggleSelfApproval(bool enabled) external onlyOwner {
        selfApprovalEnabled = enabled;
        emit SelfApprovalToggled(enabled);
    }
    
    /**
     * @notice Batch add compliant users
     */
    function addCompliantUsers(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            if (!compliantUsers[users[i]]) {
                compliantUsers[users[i]] = true;
                emit UserCompliant(users[i], true);
            }
        }
    }
}
