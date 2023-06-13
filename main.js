AOS.init();

import ContractABI from "./contractABI.js";

function useState(defaultValue) {
  let value = defaultValue;

  function getValue() {
    return value;
  }

  function setValue(newValue) {
    value = newValue;
  }

  return [getValue, setValue];
}

// Store the states here
const [getConnected, setConnected] = useState(false);
const [getAddress, setAddress] = useState("");

// A function to connect the wallet
const handleConnectMetamask = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const chainId = await signer.getChainId();

    if (chainId !== 0x13881) { 
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: 0x13881 } // Replace 1 with the desired chain ID
        ]);
      } catch (error) {
        console.error("Error requesting account switch:", error);
        return;
      }
    }
  
  } catch (error) {
    console.error("Error connecting to Metamask:", error);
  }
};
// Add an event listener to the button
document.getElementById("Connect").addEventListener("click", handleConnectMetamask);

const contractAddress = '0x7742A518d5dB7de7b37eb0590645ceBf575A6ffe'; //  contract addresss
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, ContractABI, signer);

const voteButton = document.getElementById('vote');

voteButton.addEventListener('click', async () => {
  const selectedProposal = document.getElementById('proposal').value;
  try {
    // Call the giveRightToVote function on the smart contract
    await contract.giveRightToVote(signer.getAddress());

    // Call the vote function on the smart contract
    const tx = await contract.vote(selectedProposal);
    await tx.wait();
    alert('Vote successful!');
  } catch (error) {
    console.error('Voting failed:', error);
  }
});

const resultButton = document.getElementById('Result');

resultButton.addEventListener('click', async () => {
  try {
    // Call the winningName function on the smart contract
    const result = await contract.winningName();

    // Display the result to the user
    showResult(result);
  } catch (error) {
    console.error('Fetching result failed:', error);
  }
});

async function showResult(result) {
  // Display the result to the user in a modal dialog
  // or notification
}