// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Atlas Multi-Sig Wallet (for Mantle DAO Hub)
/// @notice Gasless-ready, threshold multi-sig, supports arbitrary calls, optional auto-execute
contract Atlas {
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public threshold;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint approvals;
        bool autoExecute; // optional auto execution
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approved;

    event Deposit(address indexed sender, uint amount);
    event SubmitTransaction(uint indexed txId, address indexed to, uint value, bytes data, bool autoExecute);
    event ApproveTransaction(uint indexed txId, address indexed owner);
    event ExecuteTransaction(uint indexed txId);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }

    /// @notice Initialize wallet with owners and threshold
    constructor(address[] memory _owners, uint _threshold) {
        require(_owners.length >= _threshold, "Owners < threshold");
        owners = _owners;
        threshold = _threshold;
        for (uint i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
        }
    }

    /// @notice Accept ETH deposits
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Submit a transaction
    /// @param _to Recipient address
    /// @param _value Amount of ETH to send
    /// @param _data Optional call data (for arbitrary calls)
    /// @param _autoExecute If true, execute automatically after threshold approvals
    function submitTransaction(address _to, uint _value, bytes memory _data, bool _autoExecute) public onlyOwner {
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            approvals: 0,
            autoExecute: _autoExecute
        }));
        emit SubmitTransaction(transactions.length - 1, _to, _value, _data, _autoExecute);
    }

    /// @notice Approve a transaction
    /// @param _txId ID of the transaction to approve
    function approveTransaction(uint _txId) public onlyOwner {
        Transaction storage txn = transactions[_txId];
        require(!txn.executed, "Already executed");
        require(!approved[_txId][msg.sender], "Already approved");

        approved[_txId][msg.sender] = true;
        txn.approvals += 1;

        emit ApproveTransaction(_txId, msg.sender);

        if(txn.approvals >= threshold && txn.autoExecute) {
            executeTransaction(_txId);
        }
    }

    /// @notice Execute a transaction (manual or auto)
    /// @param _txId ID of the transaction to execute
    function executeTransaction(uint _txId) public onlyOwner {
        Transaction storage txn = transactions[_txId];
        require(!txn.executed, "Already executed");
        require(txn.approvals >= threshold, "Not enough approvals");

        txn.executed = true;
        (bool success, ) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Tx failed");

        emit ExecuteTransaction(_txId);
    }

    /// @notice Get total number of submitted transactions
    function getTransactionCount() public view returns(uint) {
        return transactions.length;
    }
}