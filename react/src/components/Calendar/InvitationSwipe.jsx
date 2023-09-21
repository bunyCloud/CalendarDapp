import React, { useState, useRef, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import { Button, Text, Card, CardBody, Stack, Box, Center, HStack, VStack, Image } from '@chakra-ui/react';
import { formatAddress } from '../../utils/formatMetamask';
import { Swiper } from 'antd-mobile';
import { useMetaMask } from '../../hooks/useMetamask';
import { AppContext } from '../../AppContext';


const FetchEventId = ({ eventId, acceptInvite }) => {
  const [event, setEvent] = useState(null);
  const {displayCalendar} = useContext(AppContext);

 


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric' };
    const formattedDate = date.toLocaleString('en-US', optionsDate);
    const formattedTime = date.toLocaleString('en-US', optionsTime);
    return { formattedDate, formattedTime }; // Return an object with both date and time
  };


  useEffect(() => {
    const fetchEventById = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm');
        const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider);
        const fetchedEvent = await contract.getEventById(eventId);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Failed to fetch event by ID:', error);
      }
    };
    fetchEventById();
  }, [displayCalendar, eventId]); 

  return (
    <Card width="100%">
    <CardBody>
      <Stack divider={<Box borderBottomWidth='1px' />} spacing='2' mb={-2} mt={-3}>
        <Box mb={6}>
          {event ? (
            <div>
              <Center p={2} border={'1px solid silver'}>
                <Text fontSize='16px' as="b" textTransform='uppercase'>
                  {event.title}
                </Text>
              </Center>
              <VStack spacing={'auto'} bg='ghostwhite' >
                {/*
                <Text textTransform='uppercase'>
                  Event ID: {eventId.toString()}
                </Text> 
                */}
                <Text>Organizer: {formatAddress(event.organizer)}</Text>
                <HStack>
                <Text>Starts: {formatTimestamp(event.startTime).formattedDate}</Text>
                <Text>{formatTimestamp(event.startTime).formattedTime}</Text>
                </HStack>
<HStack>
                <Text>Ends: {formatTimestamp(event.endTime).formattedDate}</Text>
                <Text> {formatTimestamp(event.endTime).formattedTime}</Text>
        
        </HStack>        
        
        <Image height={'200px'} src={event.metadataURI}/>
        
              </VStack>
            </div>
          ) : null}
        </Box>
        <Center>
          <Button colorScheme="twitter" size="sm" onClick={() => acceptInvite(eventId)}>
            Accept Invitation
          </Button>
        </Center>
      </Stack>
    </CardBody>
  </Card>
  );
};

const InvitationSwipe = ({account, logged}) => {
  const [invitations, setInvitations] = useState([]);
  const ref = useRef(null);
  const {displayCalendar} = useContext(AppContext);
  const { connectMetaMask } = useMetaMask()



  useEffect(() => {
    
    const fetchInvitations = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm');
        const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider);
        const invitationNumbers = await contract.getInvitations(account);
        const invitationStrings = invitationNumbers.map((number) => number.toString());
        setInvitations(invitationStrings);
      } catch (error) {
        console.error('Failed to fetch invitations:', error);
      }
    };

    if (logged && account) {
      fetchInvitations(displayCalendar);
    }

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

  const invitationCount = invitations.length;
  console.log(invitations)


  return (
    <>
{account ? (
  <>
    <div style={{
        textAlign: 'right',
        backgroundColor: 'ghostwhite',
        bottomBorder: '1px solid silver',
        width: '100%',
        
        //padding: '2px',
    }}>
    <Center>
       <HStack borderBottom="1px solid silver" pb={1} >
       <Button size={'sm'} colorScheme='linkedin'  w={'auto'}  onClick={() => {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.swipePrev();
        }}>
              Back
            </Button>
            <HStack>
       <Text>{`User:`}</Text><Text border='1px solid silver' bg="white" p={1}> {formatAddress(account)}</Text> <Text>{`Invites:`}</Text><Text bg="white" p={1} border='1px solid silver'>{`(${invitationCount})`}</Text>
       </HStack>
       <Button w={'auto'} colorScheme='linkedin' size={'sm'}  onClick={() => {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.swipeNext();
        }}>
              Next
            </Button>
       </HStack>
       </Center>
  
            
    
    </div>
    <Swiper ref={ref} loop>
      {invitations.map((invitation, index) => (
        <Swiper.Item key={index}>
          <FetchEventId eventId={invitation} acceptInvite={acceptInvite} />
        </Swiper.Item>
      ))}
    </Swiper>
  </>  
) : (
  <>
  <Box p={30}>
  <HStack>
  <Text> No connection found.... </Text>
<Button variant={'link'} onClick={connectMetaMask}>Connect Metamask</Button>
  </HStack>
  </Box>
  </>
)}
            </>
  );
};

export default InvitationSwipe;
