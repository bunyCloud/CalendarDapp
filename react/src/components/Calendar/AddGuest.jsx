import React, { useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@carbon/react';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import { AppContext } from '../../AppContext';
import NetworkSwitcher from '../../utils/AddNetwork';
import { Tooltip } from 'antd';

// Import the NetworkSwitcher component here

export default function AddGuest() {
  const { displayCalendar, account, chainId } = useContext(AppContext);
  const [networkSwitchRequired, setNetworkSwitchRequired] = useState(false);

  useEffect(() => {
    // Check if the user is not connected to chain ID 41 (Telos testnet)
    if (chainId !== '0x29') {
      setNetworkSwitchRequired(true);
    } else {
      setNetworkSwitchRequired(false);
    }
  }, [chainId]);

  async function addAccountGuest() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer);

      const tx = await contract.addGuest();
      console.log(tx.hash);
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  }

  return (
    <>
      
        <NetworkSwitcher />
   
        <Tooltip title="Guest registration" color={'blue'}>
          <Button style={{width:'100%', marginTop:'2px'}} onClick={addAccountGuest}>Join as Guest</Button>
        </Tooltip>
      
    </>
  );
}
