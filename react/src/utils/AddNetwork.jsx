import React, { useEffect, useState } from 'react';
import { Button } from '@carbon/react';
import { providers, utils } from 'ethers';
import { VStack } from '@chakra-ui/react';

const NetworkSwitcher = () => {
  const [customNetworkAdded, setCustomNetworkAdded] = useState(false);
  const [provider, setProvider] = useState(null);

  // Define the details of the Telos testnet
  const customNetwork = {
    chainId: '0x29', // Chain ID for Telos testnet
    chainName: 'Telos Testnet',
    rpcUrls: ['https://testnet15.telos.caleos.io/evm'],
    nativeCurrency: {
      name: 'TLOS',
      symbol: 'TLOS',
      decimals: 18,
    },
    blockExplorerUrls: ['https://testnet.teloscan.io'],
  };

  useEffect(() => {
    async function checkCustomNetwork() {
      try {
        if (window.ethereum) {
          const ethProvider = new providers.Web3Provider(window.ethereum);

          const network = await ethProvider.getNetwork();

          if (network.chainId === customNetwork.chainId) {
            setCustomNetworkAdded(true);
            setProvider(ethProvider);
          } else {
            setCustomNetworkAdded(false);
          }
        }
      } catch (error) {
        console.error('Error checking custom network:', error);
      }
    }

    checkCustomNetwork();
  }, []);

  // Function to add the custom network
  async function addCustomNetwork() {
    try {
      if (window.ethereum) {
        const ethProvider = new providers.Web3Provider(window.ethereum);
        await ethProvider.send('wallet_addEthereumChain', [customNetwork]);
        console.log('Custom network added successfully');
        setCustomNetworkAdded(true);
        setProvider(ethProvider);
      }
    } catch (error) {
      console.error('Error adding custom network:', error);
    }
  }

  // Function to switch to the custom network
  async function handleNetworkSwitch() {
    try {
      if (provider && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: customNetwork.chainId }],
        });
        console.log('Switched to custom network successfully');
      }
    } catch (error) {
      console.error('Error switching to custom network:', error);
    }
  }

  return (
    <>

    
      

      
      <Button style={{width:'100%'}} size='xs' onClick={addCustomNetwork}>Add Telos Testnet</Button>

        </>
    
  );
};

export default NetworkSwitcher;
