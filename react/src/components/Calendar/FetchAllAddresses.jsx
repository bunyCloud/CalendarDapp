import React, { useState, useEffect, useContext } from 'react';
import { Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import { ethers } from 'ethers';
import { formatAddress } from '../../utils/formatMetamask';
import { AppContext } from '../../AppContext';

const FetchAllAddresses = () => {
  const [memberArray, setMemberArray] = useState([]); // Initialized to empty array
  const [adminArray, setAdminArray] = useState([]); // Initialized to empty array
  const [guestArray, setGuestArray] = useState([]); // Initialized to empty array
  const { displayCalendar } = useContext(AppContext);
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm');
  const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider);

  async function fetchAllMembers() {
    try {
      const members = await contract.getAllMemberAddresses();
      if (members.length === 0) {
        console.log("No members found.");
      }
      setMemberArray(members);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }

  async function fetchAllAdmins() {
    try {
      const admins = await contract.getAllAdminAddresses();
      if (admins.length === 0) {
        console.log("No admins found.");
      }
      setAdminArray(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }

  async function fetchAllGuests() {
    try {
      const guests = await contract.getAllGuestAddresses();
      if (guests.length === 0) {
        console.log("No guests found.");
      }
      setGuestArray(guests);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  }
  
  useEffect(() => {
    fetchAllMembers();
  }, []);

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  useEffect(() => {
    fetchAllGuests();
  }, []);

  return (
    <div style={{ marginTop: '6px', borderTop: '1px solid #d4cacd' }}>
      <Text as="b">All Addresses</Text>
      <Box p={1} bg="white" h={'auto'} border="1px solid silver">
        <Text as="b">Admin</Text>
        <Wrap spacing={4} justify="center">
          {adminArray.map((address, index) => (
            <WrapItem key={index}>
              <Box p={1} bg="white" h={'auto'} border="1px solid silver">
                <Text fontSize={'12px'} noOfLines={2}>
                  {formatAddress(address)}
                </Text>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
        <Text as="b">Members</Text>
        <Wrap spacing={4} justify="center">
          {memberArray.map((address, index) => (
            <WrapItem key={index}>
              <Box p={1} bg="white" h={'auto'} border="1px solid silver">
                <Text fontSize={'12px'} noOfLines={2}>
                  {formatAddress(address)}
                </Text>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
        <Text as="b">Guest</Text>
        <Wrap spacing={4} justify="center">
          {guestArray.map((address, index) => (
            <WrapItem key={index}>
              <Box p={1} bg="white" h={'auto'} border="1px solid silver">
                <Text fontSize={'12px'} noOfLines={2}>
                  {formatAddress(address)}
                </Text>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </div>
  );
};

export default FetchAllAddresses;
