// WhatNetworkName.js
import React, { useEffect, useState } from 'react';

function WhatNetworkName({ chainId }) {
  const [networkName, setNetworkName] = useState('Unknown Network');

  useEffect(() => {
    const getNetworkName = (connectedChain) => {
      switch (connectedChain) {
        case 1:
          return 'Ethereum Mainnet';
        case 43113:
          return 'Fuji Testnet';
          case 43114:
          return 'Avalanche';
          case 40:
          return 'Telos Mainnet';
        case 41:
          return 'Telos Testnet';
        default:
          return 'Unknown Network';
      }
    }

    const networkName = getNetworkName(chainId);
    console.log(`Connected to network: ${networkName}`);
    setNetworkName(networkName);
  }, [chainId]);

  return (
    <div style={{
        //fontSize:'12px',
        //padding:'2px',
    }}>
      {networkName ? <p>{networkName}</p> : <p>Not connected....</p>}
    </div>
  );
}

export default WhatNetworkName;
