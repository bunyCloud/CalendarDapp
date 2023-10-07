import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import { AppContext } from '../../AppContext';
import { Button, VStack, Text, Alert, AlertIcon, Highlight, HStack } from '@chakra-ui/react';
import { formatAddress } from '../../utils/formatMetamask';
import FetchEventId from './FetchEventId';

const FetchInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const { logged, account, invitationCount, displayCalendar, setInvitationCount, rpcUrl } = useContext(AppContext);


  
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider);

        const invitationNumbers = await contract.getInvitations(account);
        const invitationStrings = invitationNumbers.map((number) => number.toString());
        setInvitations(invitationStrings);
        setInvitationCount(invitationStrings.length);
      } catch (error) {
        console.error('Failed to fetch invitations:', error);
      }
    };

    if (logged && account) {
      fetchInvitations();
    }
    console.log(invitations)
  }, [logged, account, displayCalendar]);

  const acceptInvite = async (invitation) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer);
      const transaction = await contract.acceptInvitation(invitation);
      await provider.waitForTransaction(transaction.hash);
      // Perform your desired action after accepting the invitation
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };


  return (
    <>
      <Alert status='info'>
    <AlertIcon />
    <HStack>
    <Text>{`Fetching invitations for account:`}</Text><Text bg="white" p={2}> {formatAddress(account)}</Text> <Text>{`Invitation Count:`}</Text><Text bg="white" p={2}>{`${invitationCount}`}</Text>
    </HStack>
  </Alert>
      
      {invitations.map((invitation, index) => (
        <div key={index}>
        <VStack h='auto'>
          <FetchEventId eventId={invitation}/>
          <Button mt={2} colorScheme="twitter" size="sm" onClick={() => acceptInvite(invitation)}>
            Accept Invitation
          </Button>
          </VStack>
        </div>
      ))}
    </>
  );
};

export default FetchInvitations;
