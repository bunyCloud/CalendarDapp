import React, { useContext } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, Center, HStack, Button, useToast } from '@chakra-ui/react';
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { formatAddress } from '../../utils/formatMetamask';
import { Text } from '@chakra-ui/react';
import { AppContext } from '../../AppContext';
import { HeaderConnect } from './HeaderConnect';

const AccountAddressMenu = ({balance, handleDisconnect}) => {
  const { accountAddress } = useContext(AppContext);
  const toast = useToast();

  const copyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(accountAddress);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };




  return (
    <Menu>
     {accountAddress && (
      <MenuButton
        px={1}
        py={1}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'red' }}
        _expanded={{ bg: 'blue' }}
        _focus={{ boxShadow: 'outline' }}
      >
      
      
        <HStack>
         
            <Text color="white" fontSize={'16px'}>
              {formatAddress(accountAddress)}
            </Text>
          
          <ChevronDownIcon color="white" />
          
        </HStack>
        
      </MenuButton>
      )}
      {!accountAddress && (
        <>
        <HeaderConnect />
        </>
      )}
      <MenuList border="1px solid #0700dd">
      <Center>
      <HStack>
      <Text textAlign="right"  fontSize={'12px'} h="100%" pr={4}>Balance: {balance} TLOS</Text>
      </HStack>
      </Center>
      <MenuDivider/>
        <MenuItem icon={<CopyIcon/>} onClick={copyAddress}>Copy Profile Address</MenuItem>
        <MenuItem icon={<ExternalLinkIcon/>}>
          <a
            className="text_link tooltip-bottom"
            href={`https://testnet.teloscan.io/address/${accountAddress}`}
            target="_blank"
            data-tooltip="Open in Block Explorer"
            rel="noreferrer"
          >
            View in Explorer
          </a>
        </MenuItem>
        <MenuDivider />
        <MenuItem>
          <Button size={'sm'} w="100%" colorScheme="twitter" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AccountAddressMenu;
