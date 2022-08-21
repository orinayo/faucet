import React, { useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import loadContract from "./utils/loadContract";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);
      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error("Please install Metamask.");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const [firstAccount] = await web3Api.web3.eth.getAccounts();
      setAccount(firstAccount);
    };

    if (web3Api.web3) {
      getAccount();
    }
  }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const currentBalance = await web3Api.web3.eth.getBalance(
        web3Api.contract.address
      );
      setBalance(web3Api.web3.utils.fromWei(currentBalance, "ether"));
    };

    if (web3Api.web3 && web3Api.contract) {
      loadBalance();
    }
  }, [web3Api.web3, web3Api.contract]);

  const onConnectWallet = () => {
    web3Api.provider.request({ method: "eth_requestAccounts" });
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span className="mr-1">
              <strong>Account:</strong>
            </span>
            {account ? (
              <span>{account}</span>
            ) : (
              <button className="button" onClick={onConnectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
