import React, { useState, useContext, useEffect } from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, Tooltip } from '@chakra-ui/react';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import { ethers } from 'ethers';
import { IconButton } from '@chakra-ui/react';
import { TeamOutlined } from '@ant-design/icons';
import FetchAllAddresses from '../Calendar/FetchAllAddresses';
import { AppContext } from '../../AppContext';


const FetchMembersDrawer = () => {
  const [members, setMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const {displayCalendar} = useContext(AppContext);

  const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm');
  const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider);

  async function fetchAllAddresses() {
    const [, members, ] = await contract.getAllMemberAddresses();
    console.log(members);
    return members;
  }

  useEffect(() => {
    fetchAllAddresses().then((members) => setMembers(members));
  }, [displayCalendar]);

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
                                  <Tooltip label="View Members" placement="top">

        <IconButton bg="transparent" color="black" size="md" onClick={onOpen} icon={<TeamOutlined />} />
        </Tooltip>
        <Drawer isOpen={isOpen} placement="right" size={'xs'} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
    {/*
      <Text as="b">Members</Text>
              <VStack align="start" spacing={4}>
                {members.map((address, index) => (
                  <Box key={index} p={4} bg="white" h="auto">
                    <Text fontSize="12px" noOfLines={2}>
                      {formatAddress(address)}
                    </Text>
                  </Box>
                ))}
              </VStack>
              */}
              <FetchAllAddresses />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      
    </>
  );
};

export default FetchMembersDrawer;
