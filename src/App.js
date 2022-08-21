import React, { useState, useEffect, useCallback } from "react";
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
  const [shouldReload, setShouldReload] = useState(false);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", () => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);
      if (provider) {
        setAccountListener(provider);
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
  }, [web3Api.web3, web3Api.contract, shouldReload]);

  const onConnectWallet = useCallback(() => {
    web3Api.provider.request({ method: "eth_requestAccounts" });
  }, [web3Api.provider]);

  const addFunds = useCallback(async () => {
    await web3Api.contract.addFunds({
      from: account,
      value: web3Api.web3.utils.toWei("1", "ether"),
    });
    setShouldReload(!shouldReload);
  }, [account, shouldReload, web3Api.contract, web3Api.web3]);

  const withdrawFunds = useCallback(async () => {
    await web3Api.contract.withdrawFunds(
      web3Api.web3.utils.toWei("0.1", "ether"),
      {
        from: account,
      }
    );
    setShouldReload(!shouldReload);
  }, [account, shouldReload, web3Api.contract, web3Api.web3]);

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
          <button
            disabled={!account}
            className="button is-link mr-2"
            onClick={addFunds}
          >
            Donate 1 ETH
          </button>
          <button
            disabled={!account}
            className="button is-primary"
            onClick={withdrawFunds}
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
