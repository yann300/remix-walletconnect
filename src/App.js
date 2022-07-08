import React, { useState } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css'
import { RemixClient, INFURA_ID_KEY } from './RemixClient'
const p = new RemixClient()
function App() {

  const [infuraId, setinfuraId] = useLocalStorage(
      INFURA_ID_KEY,
      ''
  );

  const openModal = () => {
    p.onConnect(infuraId)
  }

  const disconnect = () => {
    p.onDisconnect()
  }

  const showButtons = (connected = true) =>{
    document.getElementById("disconnectbtn").style.display = document.getElementById("accounts-container").style.display = connected? 'block':'none';
    document.getElementById("connectbtn").style.display =  connected? 'none':'block';
  }

  p.internalEvents.on('accountsChanged', (accounts) => {
    document.getElementById('accounts').innerHTML = ""
    for(const account of accounts){
      document.getElementById('accounts').innerHTML += `<li className="list-group-item">${account}</li>`
    }
  })

  p.internalEvents.on('chainChanged', (chain) => {
    document.getElementById('chain').innerHTML = chain
    showButtons(true)
  })

  p.internalEvents.on('disconnect', (chain) => {
    document.getElementById('accounts').innerHTML = ''
    document.getElementById('chain').innerHTML = ''
    showButtons(false)
  })
  return (
    <div className="App">
      <div className="btn-group-vertical mt-5 w-25" role="group">
        <div className="text-center w-100">
          <i className="fas fa-info-circle mr-2 bg-light" title="Wallet connect requires an Infura ID in order to make a request to the network."/><a target="_blank" href="https://infura.io/dashboard/ethereum">INFURA settings</a>
          <input value={infuraId} onChange={(e) => { setinfuraId(e.target.value)}} id="input-infura-id" placeholder="Please provide an Infura ID" className="form-control mt-2 mb-2"></input>          
        
        <button disabled={!infuraId} id="connectbtn" type="button" onClick={openModal} className="btn btn-primary w-100">Connect to a wallet</button>
        <button id="disconnectbtn" type="button" onClick={disconnect} className="btn btn-primary mt-2 w-100">Disconnect</button>
        </div>
      </div>
      <div id='accounts-container'>
        <div><label><b>Accounts: </b></label><br></br><ul className="list-group list-group-flush" id="accounts"></ul></div>
        <div><label><b>Network: </b></label><label className="ml-1" id="chain"> - </label></div>
      </div>
    </div>
  );
}

export default App;

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue

      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case

    }
  };
  return [storedValue, setValue];
}