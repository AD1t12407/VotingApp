// testVoting.js
import Web3 from 'web3';

const web3 = new Web3('http://127.0.0.1:8545'); // Your blockchain provider

const contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to add a candidate
async function addCandidate(name) {
    const accounts = await web3.eth.getAccounts();
    try {
        await votingContract.methods.addCandidate(name).send({ from: accounts[0] });
        console.log(`Candidate "${name}" added successfully!`);
    } catch (error) {
        console.error('Error adding candidate:', error);
    }
}

// Function to vote for a candidate
async function vote(candidateId) {
    const accounts = await web3.eth.getAccounts();
    try {
        await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
        console.log(`Vote cast for candidate ID ${candidateId}`);
    } catch (error) {
        console.error('Error voting:', error);
    }
}

// Function to get vote count for a candidate
async function getVoteCount(candidateId) {
    try {
        const count = await votingContract.methods.getVoteCount(candidateId).call();
        console.log(`Vote Count for Candidate ID ${candidateId}: ${count}`);
    } catch (error) {
        console.error('Error retrieving vote count:', error);
    }
}

// Function to fetch and display candidates
async function fetchCandidates() {
    const count = await votingContract.methods.candidateCount().call();
    console.log(`Total Candidates: ${count}`);
    
    for (let i = 1; i <= count; i++) {
        const candidate = await votingContract.methods.candidates(i).call();
        console.log(`Candidate ID ${i}: Name - ${candidate.name}, Votes - ${candidate.voteCount}`);
    }
}

// Usage examples
async function runTests() {
    await addCandidate('Alice');
    await addCandidate('Bob');
    await fetchCandidates();
    await vote(1); // Vote for Candidate ID 1 (Alice)
    await getVoteCount(1); // Get vote count for Candidate ID 1
}

runTests();
