// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) external {
        address newCampaign = address(new Campaign(msg.sender, minimum));

        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() external view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool paymentIssued;
        uint256 approversCount;
        mapping(address => bool) approvers;
    }

    address public manager;
    uint256 public minimumContribution;
    uint256 public numContributors;
    mapping(address => bool) public contributors;
    uint256 public numRequests;
    mapping(uint256 => Request) public requests;

    constructor(address creator, uint256 minimum) {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    function contribute() external payable {
        require(msg.value > minimumContribution);

        contributors[msg.sender] = true;

        numContributors++;
    }

    function createRequest(
        string calldata description,
        uint256 value,
        address payable recipient
    ) external managerOnly {
        Request storage newRequest = requests[numRequests++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.paymentIssued = false;
        newRequest.approversCount = 0;
    }

    function approveRequest(uint256 requestId) external {
        // check if sender is a contributor
        require(contributors[msg.sender]);

        Request storage request = requests[requestId];

        // check if sender has NOT already approved the request
        require(!request.approvers[msg.sender]);

        // add approver
        request.approvers[msg.sender] = true;

        // increment approver count
        request.approversCount++;
    }

    function issuePayment(uint256 requestId) external payable managerOnly {
        Request storage request = requests[requestId];

        // check if request had already issued payment
        require(!request.paymentIssued);

        // > 50% approved
        require(request.approversCount > (numContributors / 2));

        // transfer requested amount to stated recipient
        request.recipient.transfer(request.value);

        // set request to have issued payment
        request.paymentIssued = true;
    }
}
