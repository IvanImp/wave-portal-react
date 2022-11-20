import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import List from "./List";
import './App.css';

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async() => {
  try {
    const ethereum = getEthereumObject();
  
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return null;
    } 

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({method: "eth_accounts"});

    if (accounts.length) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
    
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [data, setData] = useState([]);
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");
  const contractAddress = "0xf3996547c0f862edAa8d8dE06DA5db1d38061e4a";
  const contractABI = abi.abi;
  
  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  const connectWallet = async () => {
    try{
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        provider.on('NewWave', () => {
          console.log("DETECTED NEW WAVE")
        });
        
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        console.log("Message: ", message);
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining... ", waveTxn.hash);

        let waveReceipt = await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        console.log("Wave Receipt -- ", waveReceipt);
        
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        
        let contractData = await wavePortalContract.getAllWavesData();
        console.log(JSON.parse(contractData));
        setData(JSON.parse(contractData));     

        let allWaves = await wavePortalContract.getAllWaves();
        let wavesCleaned = [];
        allWaves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            message: wave.message,
            timestamp: new Date(wave.timestamp * 1000)
          });
        });
        setAllWaves(wavesCleaned);

      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error)
    }
  }
/*
  const data = [
  {
    "address": "4f4d5462-4a9f-483e-b620-9df9c13ec840",
    "noOfWaves": 157000
  }]
  */
  function updateMessage(event) {
    setMessage(event.target.value);
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Ivan. This is my first ever web3 webpage. Connect your Ethereum wallet and wave at me!
        </div>

        <label style={{marginTop: 2 + 'em'}}>
          Please enter a message:
          <input
            type="text"
            name="message"
            style={{marginLeft: 2 + 'em'}}
            size="55"
            value={message}
            onChange={event => updateMessage(event)}
           />
        </label>
        
        <button className="waveButton" onClick={wave}>
          Wave at Me 👋
        </button>

        <List data={data}/>
        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
