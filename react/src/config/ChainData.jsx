import React from 'react';
import {
  networks,
 } from './networks';
import { Grid, GridItem, Text,Box, HStack } from '@chakra-ui/react';
import { Button } from 'antd';

const ChainData = ({ chainId, selectedNetwork }) => {
  // Accessing network configuration for the specified chainId
  const networkConfig = networks[chainId];
  const provider = networkConfig?.rpcUrl;
  console.log(`RPC provider found for ${selectedNetwork}. Connecting to ${provider}....`);

  return (
    <div>
    <Box p={2} bg="#c1cfd8" w="100%">
    <Text as="b">
      {selectedNetwork} Blockchain Details</Text>
    
    
      {networkConfig ? (
        
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>

        
        <HStack>
          <Text fontWeight="bold">Name:</Text>
          <Text>{networkConfig?.chainName}</Text>
        </HStack>

        
        <HStack>
          <Text fontWeight="bold">Chain ID:</Text>
          <Text>{networkConfig?.chainId}</Text>
        </HStack>


 
        <HStack>
          <Text fontWeight="bold">Symbol:</Text>
          <Text>{networkConfig?.currencySymbol}</Text>
        </HStack>
      

     
        <HStack>
          <Text fontWeight="bold">Explorer:</Text>
        
          <Button type="link" size="small" href={networkConfig?.blockExplorerUrl} target='_blank' >
<Text fontSize={"small"}>{networkConfig?.blockExplorerUrl}</Text>
          </Button>
        </HStack>
      </GridItem>
      </Grid>
        
      ) : (
        <p>Network configuration not found for Chain ID {chainId}.</p>
      )}

    </Box>
    </div>
  );
};

export default ChainData;
