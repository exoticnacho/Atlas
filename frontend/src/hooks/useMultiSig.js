import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import useWalletStore from '../context/WalletContext';

export default function useMultiSig() {
    const { contract, isConnected, address } = useWalletStore();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [threshold, setThreshold] = useState(0);
    const [owners, setOwners] = useState([]);
    const [reputation, setReputation] = useState({});

    // Fetch DAO configuration and reputation
    useEffect(() => {
        if (!contract) return;

        const fetchConfig = async () => {
            try {
                const thresholdValue = await contract.threshold();
                setThreshold(Number(thresholdValue));

                // Fetch owners from contract by trying indices
                const ownersList = [];
                for (let i = 0; i < 20; i++) {
                    try {
                        const owner = await contract.owners(i);
                        if (owner && owner !== '0x0000000000000000000000000000000000000000') {
                            ownersList.push(owner);
                        } else {
                            break;
                        }
                    } catch {
                        break; // No more owners
                    }
                }
                setOwners(ownersList);


                // Calculate reputation based on participation
                // In a real DAO, this would fetch from a reputation contract
                // Here we calculate it based on owners and activity (mocked for now but based on real owners)
                const reputationMap = {};
                ownersList.forEach(owner => {
                    reputationMap[owner] = {
                        points: 500 + Math.floor(Math.random() * 2000), // Base points
                        rank: 0,
                        activity: 'Active'
                    };
                });

                // Sort by points to assign ranks
                const sortedOwners = [...ownersList].sort((a, b) =>
                    reputationMap[b].points - reputationMap[a].points
                );

                sortedOwners.forEach((owner, index) => {
                    reputationMap[owner].rank = index + 1;
                });

                setReputation(reputationMap); // Initial mock, to be updated with real stats later

            } catch (error) {
                console.error('useMultiSig: Failed to fetch DAO config:', error);
            }
        };

        fetchConfig();
    }, [contract]);

    // Fetch all transactions
    const fetchTransactions = async () => {
        if (!contract) return;

        setLoading(true);
        try {
            const txCount = await contract.getTransactionCount();
            const txList = [];

            for (let i = 0; i < Number(txCount); i++) {
                const tx = await contract.transactions(i);
                const isApproved = address ? await contract.approved(i, address) : false;

                // Fetch approvers for this transaction
                const approvers = await getTransactionApprovers(i);

                txList.push({
                    id: i,
                    to: tx.to,
                    value: ethers.formatEther(tx.value),
                    data: tx.data,
                    executed: tx.executed,
                    approvals: Number(tx.approvals),
                    autoExecute: tx.autoExecute,
                    isApprovedByMe: isApproved,
                    approvers: approvers, // Add approvers list
                    proposer: await getTransactionProposer(i), // Add proposer
                });
            }

            setTransactions(txList.reverse()); // Show newest first
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get list of approvers for a specific transaction
    const getTransactionApprovers = async (txId) => {
        if (!contract || owners.length === 0) return [];

        try {
            const approversList = [];
            // Check each owner if they approved this transaction
            for (const owner of owners) {
                const hasApproved = await contract.approved(txId, owner);
                if (hasApproved) {
                    approversList.push(owner);
                }
            }
            return approversList;
        } catch (error) {
            console.error('Failed to fetch approvers:', error);
            return [];
        }
    };

    // Helper to find proposer from events (since not stored in struct)
    const getTransactionProposer = async (txId) => {
        if (!contract) return 'Unknown';
        try {
            const filter = contract.filters.SubmitTransaction(txId);
            const events = await contract.queryFilter(filter);
            if (events.length > 0) {
                const tx = await events[0].getTransaction();
                return tx.from;
            }
            return 'Unknown';
        } catch (e) {
            console.warn(`Could not fetch proposer for tx ${txId}`, e);
            return 'Unknown';
        }
    };

    // Calculate real reputation stats when transactions or owners change
    useEffect(() => {
        if (owners.length === 0 || transactions.length === 0) return;

        const newReputation = { ...reputation };
        let changed = false;

        owners.forEach(owner => {
            const currentRep = newReputation[owner] || { points: 500, rank: 0, activity: 'New' };

            // Count Votes (Approvals)
            const voteCount = transactions.reduce((acc, tx) => {
                const hasVoted = tx.approvers && tx.approvers.includes(owner);
                return acc + (hasVoted ? 1 : 0);
            }, 0);

            // Count Proposals Created
            const proposalCount = transactions.reduce((acc, tx) => {
                return acc + (tx.proposer && tx.proposer.toLowerCase() === owner.toLowerCase() ? 1 : 0);
            }, 0);

            // Calculate Base Score: 10 pts per vote, 20 pts per proposal
            const score = 500 + (voteCount * 10) + (proposalCount * 20);

            if (currentRep.points !== score || currentRep.voteCount !== voteCount) {
                newReputation[owner] = {
                    ...currentRep,
                    points: score,
                    votes: voteCount,
                    proposals: proposalCount,
                    activity: voteCount > 0 ? 'Active' : 'Inactive'
                };
                changed = true;
            }
        });

        // Re-rank
        if (changed) {
            const sorted = [...owners].sort((a, b) =>
                (newReputation[b]?.points || 0) - (newReputation[a]?.points || 0)
            );
            sorted.forEach((owner, idx) => {
                if (newReputation[owner]) newReputation[owner].rank = idx + 1;
            });
            setReputation(newReputation);
        }
    }, [transactions, owners]);

    // Submit a new transaction
    const submitTransaction = async (to, value, data = '0x', autoExecute = false, isGasless = false) => {
        if (!contract) throw new Error('Contract not initialized');

        try {
            const valueInWei = ethers.parseEther(value.toString());

            if (isGasless) {
                console.log('useMultiSig: Attempting Gasless Transaction...');
                const { setupBiconomy, sendGaslessTransaction } = await import('../services/biconomy');

                // 1. Setup Biconomy
                const { meeClient } = await setupBiconomy(window.ethereum);

                // 2. Encode function data for 'submitTransaction'
                // We use the contract interface to encode the data
                const encodedData = contract.interface.encodeFunctionData('submitTransaction', [
                    to,
                    valueInWei,
                    data,
                    autoExecute
                ]);

                // 3. Send via Biconomy
                // Target is OUR contract address, value is 0 (since we are calling a function, not sending ETH to contract)
                // Note: If submitting tx requires ETH value to be sent to contract, adjust 'value' param below.
                const txHash = await sendGaslessTransaction(
                    meeClient,
                    await contract.getAddress(), // Target: Our MultiSig Contract
                    '0',                        // Value sent with call (usually 0 unless deposit)
                    encodedData                 // Encoded call to submitTransaction
                );

                console.log('useMultiSig: Gasless Tx Hash:', txHash);

                // Wait a bit for indexing before refresh
                await new Promise(r => setTimeout(r, 5000));

            } else {
                // Standard Transaction
                const tx = await contract.submitTransaction(to, valueInWei, data, autoExecute);
                await tx.wait();
            }

            // Refresh transactions
            await fetchTransactions();

            return true;
        } catch (error) {
            console.error('Failed to submit transaction:', error);
            throw error;
        }
    };

    // Approve a transaction
    const approveTransaction = async (txId) => {
        if (!contract) throw new Error('Contract not initialized');

        try {
            const tx = await contract.approveTransaction(txId);
            await tx.wait();

            // Refresh transactions
            await fetchTransactions();

            return tx;
        } catch (error) {
            console.error('Failed to approve transaction:', error);
            throw error;
        }
    };

    // Execute a transaction
    const executeTransaction = async (txId) => {
        if (!contract) throw new Error('Contract not initialized');

        try {
            const tx = await contract.executeTransaction(txId);
            await tx.wait();

            // Refresh transactions
            await fetchTransactions();

            return tx;
        } catch (error) {
            console.error('Failed to execute transaction:', error);
            throw error;
        }
    };

    // Listen for contract events
    useEffect(() => {
        if (!contract) return;

        const onSubmit = (txId) => {
            console.log('Transaction submitted:', txId);
            fetchTransactions();
        };

        const onApprove = (txId, owner) => {
            console.log('Transaction approved:', txId, 'by', owner);
            fetchTransactions();
        };

        const onExecute = (txId) => {
            console.log('Transaction executed:', txId);
            fetchTransactions();
        };

        contract.on('SubmitTransaction', onSubmit);
        contract.on('ApproveTransaction', onApprove);
        contract.on('ExecuteTransaction', onExecute);

        // Initial fetch
        fetchTransactions();

        return () => {
            contract.off('SubmitTransaction', onSubmit);
            contract.off('ApproveTransaction', onApprove);
            contract.off('ExecuteTransaction', onExecute);
        };
    }, [contract, address]);

    return {
        transactions,
        loading,
        threshold,
        owners,
        reputation,
        submitTransaction,
        approveTransaction,
        executeTransaction,
        refreshTransactions: fetchTransactions,
    };
}
