import Web3 from 'web3';
const web3 = new Web3('http://127.0.0.1:8545'); // Your blockchain provider

const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'; // Replace with your contract address
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
];

const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to add a new candidate
async function addCandidate() {
    const name = document.getElementById('candidateName').value.trim(); // Get candidate name from input
    if (!name) {
        alert('Please enter a candidate name.');
        return;
    }
    
    const accounts = await web3.eth.getAccounts();
    try {
        await votingContract.methods.addCandidate(name).send({ from: accounts[0] });
        alert(`Candidate "${name}" added successfully!`);
        fetchCandidates(); // Refresh candidates after adding a new one
    } catch (error) {
        console.error('Error adding candidate:', error);
        alert('Error adding candidate. Please check the console for details.');
    }
}

// Function to vote for a candidate
async function vote() {
    const candidateId = document.getElementById('candidateId').value.trim(); // Get candidate ID from input
    if (!candidateId || isNaN(candidateId)) {
        alert('Please enter a valid candidate ID.');
        return;
    }
    
    const accounts = await web3.eth.getAccounts();
    try {
        await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
        alert(`Vote cast for candidate ID ${candidateId}`);
        getVoteCount(); // Update the vote count display after voting
    } catch (error) {
        console.error('Error voting:', error);
        alert('Error casting vote. Please check the console for details.');
    }
}

// Function to get vote count for a candidate
async function getVoteCount() {
    const candidateId = document.getElementById('voteCandidateId').value.trim(); // Get candidate ID from input
    if (!candidateId || isNaN(candidateId)) {
        alert('Please enter a valid candidate ID.');
        return;
    }
    
    try {
        const count = await votingContract.methods.getVoteCount(candidateId).call();
        document.getElementById('voteCount').innerText = `Vote Count: ${count}`;
    } catch (error) {
        console.error('Error getting vote count:', error);
        alert('Error retrieving vote count. Please check the console for details.');
    }
}

// Function to fetch candidates and update the UI
async function fetchCandidates() {
    const count = await votingContract.methods.candidateCount().call();
    const candidatesList = document.getElementById('candidatesList'); // Assume you have an element to display candidates

    // Clear previous candidates
    candidatesList.innerHTML = '';

    for (let i = 0; i < count; i++) { // Start from 0
        const candidate = await votingContract.methods.candidates(i).call();
        candidatesList.innerHTML += `<p>${candidate.name} - Votes: ${candidate.voteCount}</p>`;
    }
}

// Call fetchCandidates on page load to show existing candidates
window.onload = fetchCandidates;
