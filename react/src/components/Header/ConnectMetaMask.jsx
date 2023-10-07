import React, { useState, useEffect, useContext } from 'react'
import { Button } from '@carbon/react'
import { useSDK } from '@metamask/sdk-react'
import { ethers } from 'ethers'
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, Center, HStack, useToast, Text, Button as CButton, VStack } from '@chakra-ui/react'
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { formatAddress } from '../../utils/formatMetamask'
import { AppContext } from '../../AppContext'
import detectEthereumProvider from '@metamask/detect-provider'


const ConnectMetaMask = () => {
  //const [account, setAccount] = useState(null)
  const {account, setAccount} = useContext(AppContext)
  const [balance, setBalance] = useState('0')
  const { sdk, connected, provider } = useSDK()
  const toast = useToast()

  const handleDisconnect = () => {
    setAccount(null)
  }

  const copyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(account)
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  }

 

  const connect = async () => {
    try {
      const accounts = await sdk?.connect()
      setAccount(accounts?.[0])
    } catch (err) {
      console.warn('Failed to connect..', err)
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      const provider = await detectEthereumProvider();
      
      if (provider && provider.selectedAddress) {
        setAccount(provider.selectedAddress);
      }
    };
    
    checkConnection();
  }, []);
  
  
  return (
    <>
      {account ? (
        <VStack spacing={4}>
          <Menu>
            <MenuButton
              px={4}
              py={'11.5px'}
              transition="all 0.2s"
              borderRadius="0" // Carbon buttons have squared edges
              borderWidth="1px"
              borderColor="rgba(0, 0, 0, 0.15)" // Mildly visible border
              bg="white"
              color="blue"
              fontSize="14px" // Typical Carbon button font-size
              fontWeight="400" // Carbon buttons usually have normal font-weight
              _hover={{ bg: '#e5e5e5' }} // Mild hover effect like Carbon buttons
              //_active={{ bg: '#d0d0d0' }} // Active state has a more pronounced shade
              //_focus={{ boxShadow: '0 0 0 2px #0f62fe' }} // Blue outline on focus, typical of Carbon
              marginRight="0" // Snug fit to the right
              marginTop="0" // Snug fit to the top
              marginBottom="0" // Snug fit to the bottom
            >
              <HStack spacing={2}>
                <Text color="blue">{formatAddress(account)}</Text>
                <ChevronDownIcon color="blue" />
              </HStack>
            </MenuButton>

            <MenuList minWidth="150px" bg="ghostwhite" p={4} color="blue">
              <MenuItem icon={<CopyIcon />} onClick={copyAddress}>
                Copy Address
              </MenuItem>
              <MenuItem mt={4} icon={<ExternalLinkIcon />} href={`https://testnet.teloscan.io/address/${account}`} target="_blank" rel="noopener noreferrer">
                View in Explorer
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<ExternalLinkIcon />} onClick={handleDisconnect}>
                Disconnect
              </MenuItem>
            </MenuList>
          </Menu>
        </VStack>
      ) : (
        <Button style={{ margin: '0rem' }} onClick={connect}>
          Connect
        </Button>
      )}
    </>
  )
}

export default ConnectMetaMask
