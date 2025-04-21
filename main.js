let provider;
let signer;
let userAddress;

// Replace these with your actual deployed addresses
const LIBERATIO_DEI_ADDRESS = "0xD8eee347322a8fFfAE63Be1c21328B51C159e470";
const TRUTH_NFT_ADDRESS = "0xf1E38BB8e031e480F39F588077c594a63aBaD848";
const DAO_ADDRESS = "0x82A222c46D535a69635848e9217ed7bf96268797";

async function loadABI(name) {
  const res = await fetch(`${name}.json`);
  return await res.json();
}

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("walletAddress").innerText = "Connected: " + userAddress;
  } else {
    alert("Please install MetaMask.");
  }
}

async function submitInvocation() {
  const abi = await loadABI("LiberatioDei");
  const contract = new ethers.Contract(LIBERATIO_DEI_ADDRESS, abi, signer);

  const tx = await contract.submitInvocation(
    document.getElementById("message").value,
    document.getElementById("intent").value,
    "0x", // inputData as empty bytes
    document.getElementById("finalHash").value,
    document.getElementById("ipfsCID").value,
    document.getElementById("symbolicName").value,
    { value: ethers.parseEther("0.001") }
  );

  await tx.wait();
  alert("Invocation submitted");
}

async function mintNFT() {
  const abi = await loadABI("TruthNFT");
  const contract = new ethers.Contract(TRUTH_NFT_ADDRESS, abi, signer);

  const tx = await contract.mintTruthNFT(userAddress);
  await tx.wait();
  alert("Truth NFT minted");
}

async function loadDAOInfo() {
  const abi = await loadABI("LiberationDAO");
  const contract = new ethers.Contract(DAO_ADDRESS, abi, provider);

  const quorum = await contract.quorum();
  document.getElementById("quorumDisplay").innerText = "Quorum: " + quorum.toString();
}

document.getElementById("connectButton").onclick = connect;
document.getElementById("submitInvocation").onclick = submitInvocation;
document.getElementById("mintNFT").onclick = mintNFT;
document.getElementById("loadDAO").onclick = loadDAOInfo;
