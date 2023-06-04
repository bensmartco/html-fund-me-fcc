import { ethers } from "./ethers-5.1.esm.min.js";
import { constractAddress, abi } from "./contant.js";
const connectButton = document.getElementById("connectButton");
const showContractAmount = document.getElementById("showContractAmount");
connectButton.onclick = connect;
const fundButton = document.getElementById("fundButton");
const getBalance = document.getElementById("getBalance");
const ethAmount = document.getElementById("ethAmount");
const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;
fundButton.onclick = fund;
getBalance.onclick = getBalanceF;
async function getBalanceF() {
  if (window.ethereum !== "undefine") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(constractAddress);
    console.log(`The balance is ${ethers.utils.formatEther(balance)}`);
    showContractAmount.innerHTML = ethers.utils.formatEther(balance);
  }
}
async function fund() {
  if (window.ethereum !== "undefine") {
    console.log("Start Funding..");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(constractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount.value),
      });
      await listenToContractToMin(transactionResponse, provider);
      console.log("Funding Done.....");
    } catch (error) {
      console.log(error);
    }
  }
}
async function withdraw() {
  if (window.ethereum !== "undefine") {
    console.log("Start Windrawing..");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(constractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenToContractToMin(transactionResponse, provider);
      console.log("Withdraw Done.....");
    } catch (error) {
      console.log(error);
    }
  }
}
async function listenToContractToMin(transactionResponse, provider) {
  console.log(`Minning.... ${transactionResponse.hash}`);
  return new Promise((ressolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Complete with ${transactionReceipt.confirmations} confirmations`
      );
      ressolve();
    });
  });
}
async function connect() {
  if (window.ethereum !== "undefine") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected!!";
  } else {
    connectButton.innerHTML = "Install metamusk";
  }
}
