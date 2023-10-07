import { useState, useEffect } from 'react';
import { Button, HStack, Image, Text, Tooltip } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

const NetworkSwitcherIconOnly = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('Telos Testnet');
  const [provider, setProvider] = useState('https://testnet.telos.net/evm');
  
  const switchNetwork = async (network) => {
    const networkData = {
        'Telos Mainnet': {
            chainId: 40,
            rpcUrl: 'https://mainnet.telos.net/evm/',
            nativeCurrency: {
                name: 'Telos',
                symbol: 'TLOS',
                decimals: 18,
            },
            blockExplorerUrls: ['https://teloscan.io'],
        },
        'Telos Testnet': {
            chainId: 41,
            rpcUrl: 'https://testnet.telos.net/evm/',
            nativeCurrency: {
                name: 'Telos',
                symbol: 'TLOS',
                decimals: 18,
            },
            blockExplorerUrls: ['https://testnet.teloscan.io/'],
        },
      
    };

    const { chainId, rpcUrl, nativeCurrency, blockExplorerUrls } = networkData[network];
    setProvider(rpcUrl);

    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (parseInt(currentChainId, 16) === chainId) {
        console.log('Already on the desired network.');
        return;
    }

    await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x' + chainId.toString(16),
                chainName: network,
                nativeCurrency,
                rpcUrls: [rpcUrl],
                blockExplorerUrls,
            },
        ],
    });

    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainId.toString(16) }],
    });
};

  useEffect(() => {
    if (!window.ethereum) {
      console.log('Provider not found.');
      return; // Exit the function early if no provider is found
    }
    switchNetwork(selectedNetwork);
  }, [selectedNetwork]);

  const getModelSrc = () => {
    switch (selectedNetwork) {
      case 'Telos Testnet':
      case 'Telos Mainnet':
        return '/telos.glb';
      default:
        return '/telos.glb';
    }
  };


  return (
    <Menu>
      <Tooltip hasArrow label="Switch Network" bg="#c1cfd8" color="black">
        <MenuButton variant={'unstyled'} size={'auto'} bg={'transparent'} as={Button}>
          <HStack bg='transparent'>
            <model-viewer
              style={{
                width: '40px',
                height: '40px',
                marginTop: '-1px',
                backgroundColor: 'transparent',
              }}
              src={getModelSrc()}
              poster={selectedNetwork.includes('Testnet') ? "/telos.png" : "/telos.png"}
              shadow-intensity="1.99"
              auto-rotate={selectedNetwork === 'Telos Mainnet' ? true : false}
              shadow-softness="0.07"
            ></model-viewer>
            
          </HStack>
        </MenuButton>
      </Tooltip>
      <MenuList zIndex={99999}>
        <MenuItem minH='48px' onClick={() => setSelectedNetwork('Telos Testnet')} zIndex={99999}>
          <Image boxSize='2rem' borderRadius='full' src='/telos.png' mr='6px' />
          <Text>Telos Testnet</Text>
        </MenuItem>
   
        <MenuItem minH='40px' onClick={() => setSelectedNetwork('Telos Mainnet')} zIndex={99999}>
          <Image boxSize='2rem' borderRadius='full' src='/telos.png' mr='6px' />
          <Text>Telos Mainnet</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NetworkSwitcherIconOnly;
