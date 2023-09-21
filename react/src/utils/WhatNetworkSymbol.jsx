import React, { useEffect, useState } from 'react';

function WhatNetworkSymbol({ chainId }) {
  const [networkSymbol, setNetworkSymbol] = useState('Unknown');

  useEffect(() => {
    const getNetworkSymbol = (connectedChain) => {
      switch (connectedChain) {
        case 1:
          return 'ETH';
        case 43113:
          return 'AVAX';
        case 43114:
          return 'AVAX';
        case 40:
          return 'TLOS';
        case 41:
          return 'TLOS';
        default:
          return 'Unknown';
      }
    }

    const symbol = getNetworkSymbol(chainId);
    console.log(`Connected to network symbol: ${symbol}`);
    setNetworkSymbol(symbol);
  }, [chainId]);

  return (
    <div style={{
        //fontSize:'12px',
        //padding:'2px',
    }}>
      {networkSymbol !== 'Unknown' ? <p>{networkSymbol}</p> : <p>Not connected....</p>}
    </div>
  );
}

export default WhatNetworkSymbol;
