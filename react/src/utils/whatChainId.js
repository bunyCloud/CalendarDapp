// MetaMaskChainId.js
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export default function WhatChainId({onChainId}) {
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    async function getChainId() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        onChainId(network.chainId.toString());
      } else {
        console.log('Please install MetaMask!');
      }
    }

    getChainId();
  }, [onChainId]);

  return (
    <div style={{
        
        padding:'1px',
        marginLeft:'1px',
    }}>
      {chainId && ( <> <p>({chainId})</p> </> )}
    </div>
  );
}
