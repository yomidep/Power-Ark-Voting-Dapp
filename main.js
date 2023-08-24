AOS.init();

function useState(defaultValue) {
    let value = defaultValue
  
    function getValue() {
      return value
    }
  
    function setValue(newValue) {
      value = newValue
    }
  
    return [getValue, setValue];
  }

   // stored the states here
   const [connected, setConnected] = useState(false);
   const [address, setAddress] = useState("");
 
   const connectButton = document.getElementById('connectButton');

   // a function to connect wallet
   const handleConnectMetamask = async () => {
     // used the try block just so i can catch errors easily
     try {
       // declared the provider here to search for window.ethereum
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       // make a request to connect network
       await provider.send("eth_requestAccounts", []);
       // declared signer
       const signer = await provider.getSigner();
       // chainId of the connected network
       const chainId = await signer.getChainId();
 
       // we have a conditional block here that says if the user chainID isn't equal to that of the the Mumbai Network
       if (chainId !== "0x13881") {
         try {
           // make a request to change the connected chain
           await provider.send("wallet_switchEthereumChain", [
             { chainId: `0x13881` },
           ]);
         } catch (error) {
           // catcch error block
           console.error("Error requesting account switch:", error);
           return;
         }
       }
 
       // a constant to get address
       const address = await signer.getAddress();
       // use the slice method to truncate address
       const truncatedAddress = address.slice(0, 4) + ".." + address.slice(-2);

       connectButton.textContent = `Connected: ${truncatedAddress}`;
       
       // set signer
       setConnected(signer);
       // set connected address
       setAddress(truncatedAddress);
     } catch (error) {
       // catch error
       console.log("Error Connecting: ", error);
     }
   };

   const voteCandidate = async (event) => {
    event.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      let receipt;
      const votingContract = new ethers.Contract(
        contractAddress,
        ContractABI,
        signer
      );
      const voterInfo = await votingContract.voters(address);
      const hasVoted = voterInfo.anyvotes;
      console.log(hasVoted);

      if (hasVoted) {
        console.log("Already voted");
      } else {
        // Process the vote
        console.log("Voting...");
      }

      // Proceed with voting
      const transaction = await votingContract.vote(value);

      receipt = await wait(transaction);

      console.log("Vote submitted successfully!");
      enqueueSnackbar("Vote Successful", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.data.message, { variant: "error" });
      console.log("Failed, reason: ", error.data.message);
    }
  };

  const VoteForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const contractAddress = "0x5CDf21c8072cDe0677e98BAD170d297C63a40cB1";
  
    const [value, setValue] = useState("");
  
    const handleInput = (event) => {
      const inputValue = event.target.checked ? event.target.value : "";
      setValue(inputValue);
      console.log(inputValue);
    };
  
    const winningCandidate = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const votingContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );
        const winningName = await votingContract.winningName_();
        const convertByte = ethers.utils.parseBytes32String(winningName);
  
        console.log(convertByte);
        enqueueSnackbar(convertByte + " Project Is Leading", {
          variant: "success",
        });
      } catch (error) {
        console.log("Error Message: ", error.data);
      }
      
    };
    document.getElementById("winningButton").addEventListener("click", winningCandidate);

}

