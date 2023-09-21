import React from 'react';
import { VStack, Avatar, Button } from '@chakra-ui/react';
import { networks } from './networks'; // Import network information

const NetworkSwitcher = ({ switchNetwork, chainId }) => {
  const handleNetworkSwitch = async (chainId) => {
    try {
      await switchNetwork(chainId);
    } catch (error) {
      console.error('Failed to switch network:', error);
      // Handle error
    }
  };

  return (
    <VStack>
      <VStack w="auto">
        {/* Ethereum */}
        <div>
          <Avatar src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png" />
          <Button
            style={{ width: '80px', fontSize: '12px' }}
            onClick={() => handleNetworkSwitch(networks[1].chainId)}
            disabled={chainId === networks[1].chainId}
          >
            Ethereum
          </Button>
        </div>

        {/* Avalanche */}
        <div>
          <Avatar src="https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png" />
          <Button
            style={{ width: '80px', fontSize: '12px' }}
            onClick={() => handleNetworkSwitch(networks[43114].chainId)}
            disabled={chainId === networks[43114].chainId}
          >
            Avalanche
          </Button>
          <Button
            style={{ width: '80px', fontSize: '12px' }}
            onClick={() => handleNetworkSwitch(networks[43114].chainId)}
            disabled={chainId === networks[43114].chainId}
          >
            Fuji
          </Button>
        </div>

        {/* Telos */}
        <div>
          <Avatar src="https://assets-global.website-files.com/60ae1fd65f7b76f18ddd0bec/61044a5f70f5bbeb24b995ea_Symbol%202%402x.png" />
          <Button
            style={{ width: '80px', fontSize: '12px' }}
            onClick={() => handleNetworkSwitch(networks[41].chainId)}
            disabled={chainId === networks[41].chainId}
          >
            Telos
          </Button>
          <Button
            style={{ width: '80px', fontSize: '12px' }}
            onClick={() => handleNetworkSwitch(networks[40].chainId)}
            disabled={chainId === networks[40].chainId}
          >
            Testnet
          </Button>
        </div>

        {/* Polygon */}
        <div>
          <Avatar src="https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png" />
          <Button
            style={{ width: '80px', fontSize: '12px' }}
            onClick={() => handleNetworkSwitch(networks[137].chainId)}
            disabled={chainId === networks[137].chainId}
          >
            Polygon
          </Button>
          <Button
            style={{ width: '80px', fontSize: '12px' }}
            onClick={() => handleNetworkSwitch(networks[137].chainId)}
            disabled={chainId === networks[137].chainId}
          >
            Mumbai
          </Button>
        </div>

        {/* Other networks */}
        {/* ... Add buttons for other networks using the same pattern ... */}
      </VStack>
    </VStack>
  );
};

export default NetworkSwitcher;
