// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FraudRegistry
 * @dev Smart contract for immutable logging of fraud reports and SEBI verification data
 */
contract FraudRegistry is Ownable, ReentrancyGuard {
    
    // Struct to store fraud report data
    struct FraudReport {
        bytes32 contentHash;        // Hash of the analyzed content
        uint256 riskScore;          // Risk score (0-100)
        string inputType;           // Type of input (text, image, url, etc.)
        string indicators;          // JSON string of risk indicators
        uint256 timestamp;          // Block timestamp
        address reporter;           // Address that logged the report
        bool verified;              // Verification status
    }
    
    // Struct to store SEBI advisor verification data
    struct SEBIVerification {
        string advisorId;           // SEBI advisor ID
        string advisorName;         // Advisor name
        bool isRegistered;          // Registration status
        uint256 verificationDate;   // Date of verification
        string status;              // ACTIVE, SUSPENDED, CANCELLED
    }
    
    // Mapping from report ID to fraud report
    mapping(bytes32 => FraudReport) public fraudReports;
    
    // Mapping from advisor ID to SEBI verification
    mapping(string => SEBIVerification) public sebiVerifications;
    
    // Mapping to check if content hash has been flagged
    mapping(bytes32 => bool) public flaggedContent;
    
    // Array to store all report IDs for iteration
    bytes32[] public reportIds;
    
    // Array to store all verified advisor IDs
    string[] public verifiedAdvisors;
    
    // Events
    event FraudReportLogged(
        bytes32 indexed reportId,
        bytes32 indexed contentHash,
        uint256 riskScore,
        string inputType,
        uint256 timestamp
    );
    
    event SEBIAdvisorVerified(
        string indexed advisorId,
        string advisorName,
        bool isRegistered,
        uint256 timestamp
    );
    
    event ContentFlagged(
        bytes32 indexed contentHash,
        bytes32 indexed reportId
    );
    
    // Modifiers
    modifier validRiskScore(uint256 _riskScore) {
        require(_riskScore <= 100, "Risk score must be between 0 and 100");
        _;
    }
    
    modifier reportExists(bytes32 _reportId) {
        require(fraudReports[_reportId].timestamp != 0, "Report does not exist");
        _;
    }
    
    /**
     * @dev Log a fraud report to the blockchain
     * @param _contentHash Hash of the analyzed content
     * @param _riskScore Risk score (0-100)
     * @param _inputType Type of input analyzed
     * @param _indicators JSON string of risk indicators
     * @return reportId Unique identifier for the report
     */
    function logFraudReport(
        bytes32 _contentHash,
        uint256 _riskScore,
        string memory _inputType,
        string memory _indicators
    ) external validRiskScore(_riskScore) nonReentrant returns (bytes32) {
        
        // Generate unique report ID
        bytes32 reportId = keccak256(
            abi.encodePacked(
                _contentHash,
                _riskScore,
                _inputType,
                block.timestamp,
                msg.sender
            )
        );
        
        // Ensure report doesn't already exist
        require(fraudReports[reportId].timestamp == 0, "Report already exists");
        
        // Create fraud report
        fraudReports[reportId] = FraudReport({
            contentHash: _contentHash,
            riskScore: _riskScore,
            inputType: _inputType,
            indicators: _indicators,
            timestamp: block.timestamp,
            reporter: msg.sender,
            verified: false
        });
        
        // Add to report IDs array
        reportIds.push(reportId);
        
        // Flag content if high risk
        if (_riskScore >= 70) {
            flaggedContent[_contentHash] = true;
            emit ContentFlagged(_contentHash, reportId);
        }
        
        emit FraudReportLogged(reportId, _contentHash, _riskScore, _inputType, block.timestamp);
        
        return reportId;
    }
    
    /**
     * @dev Verify and log SEBI advisor information
     * @param _advisorId SEBI advisor ID
     * @param _advisorName Advisor name
     * @param _isRegistered Registration status
     * @param _status Current status (ACTIVE, SUSPENDED, etc.)
     */
    function verifySEBIAdvisor(
        string memory _advisorId,
        string memory _advisorName,
        bool _isRegistered,
        string memory _status
    ) external onlyOwner {
        
        // Check if advisor is already verified
        if (sebiVerifications[_advisorId].verificationDate == 0) {
            verifiedAdvisors.push(_advisorId);
        }
        
        // Update or create SEBI verification record
        sebiVerifications[_advisorId] = SEBIVerification({
            advisorId: _advisorId,
            advisorName: _advisorName,
            isRegistered: _isRegistered,
            verificationDate: block.timestamp,
            status: _status
        });
        
        emit SEBIAdvisorVerified(_advisorId, _advisorName, _isRegistered, block.timestamp);
    }
    
    /**
     * @dev Get fraud report details
     * @param _reportId Report identifier
     * @return FraudReport struct with all report details
     */
    function getFraudReport(bytes32 _reportId) external view reportExists(_reportId) returns (FraudReport memory) {
        return fraudReports[_reportId];
    }
    
    /**
     * @dev Check if content has been flagged as fraudulent
     * @param _contentHash Hash of the content to check
     * @return bool True if content is flagged
     */
    function isContentFlagged(bytes32 _contentHash) external view returns (bool) {
        return flaggedContent[_contentHash];
    }
    
    /**
     * @dev Get SEBI advisor verification details
     * @param _advisorId SEBI advisor ID
     * @return SEBIVerification struct with advisor details
     */
    function getSEBIVerification(string memory _advisorId) external view returns (SEBIVerification memory) {
        return sebiVerifications[_advisorId];
    }
    
    /**
     * @dev Verify a fraud report (only owner)
     * @param _reportId Report identifier
     */
    function verifyReport(bytes32 _reportId) external onlyOwner reportExists(_reportId) {
        fraudReports[_reportId].verified = true;
    }
    
    /**
     * @dev Get total number of reports
     * @return uint256 Total report count
     */
    function getTotalReports() external view returns (uint256) {
        return reportIds.length;
    }
    
    /**
     * @dev Get total number of verified advisors
     * @return uint256 Total verified advisor count
     */
    function getTotalVerifiedAdvisors() external view returns (uint256) {
        return verifiedAdvisors.length;
    }
    
    /**
     * @dev Get report ID by index
     * @param _index Index in the reportIds array
     * @return bytes32 Report ID
     */
    function getReportIdByIndex(uint256 _index) external view returns (bytes32) {
        require(_index < reportIds.length, "Index out of bounds");
        return reportIds[_index];
    }
    
    /**
     * @dev Get advisor ID by index
     * @param _index Index in the verifiedAdvisors array
     * @return string Advisor ID
     */
    function getAdvisorIdByIndex(uint256 _index) external view returns (string memory) {
        require(_index < verifiedAdvisors.length, "Index out of bounds");
        return verifiedAdvisors[_index];
    }
    
    /**
     * @dev Get fraud statistics
     * @return totalReports Total number of reports
     * @return highRiskReports Number of high-risk reports (score >= 70)
     * @return flaggedContentCount Number of flagged content items
     * @return verifiedReports Number of verified reports
     */
    function getFraudStatistics() external view returns (
        uint256 totalReports,
        uint256 highRiskReports,
        uint256 flaggedContentCount,
        uint256 verifiedReports
    ) {
        totalReports = reportIds.length;
        
        for (uint256 i = 0; i < reportIds.length; i++) {
            FraudReport storage report = fraudReports[reportIds[i]];
            
            if (report.riskScore >= 70) {
                highRiskReports++;
            }
            
            if (report.verified) {
                verifiedReports++;
            }
        }
        
        // Count flagged content (approximation for gas efficiency)
        flaggedContentCount = highRiskReports;
    }
    
    /**
     * @dev Emergency function to pause contract (if needed in future versions)
     */
    function emergencyStop() external onlyOwner {
        // Implementation for emergency stop if needed
        // This could be implemented with OpenZeppelin's Pausable contract
    }
    
    /**
     * @dev Get contract version
     * @return string Contract version
     */
    function getVersion() external pure returns (string memory) {
        return "1.0.0";
    }
}