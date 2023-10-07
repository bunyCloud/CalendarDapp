import React, { useEffect, useState, useContext } from 'react'
import { ethers } from 'ethers'
import { Box, Text, Center, HStack, useToast } from '@chakra-ui/react'
import { Button, TextInput, Select, SelectItem, Form, FormGroup } from '@carbon/react'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from '../../AppContext'
import { formatAddress } from '../../utils/formatMetamask'
import CreateEventModal from '../Modals/CreateEventModal'

const legendStyle = {
  marginTop: '20px', // Increase space above legendText
}

const AdminDashboard = () => {
  const { displayCalendar, account } = useContext(AppContext)
  const toast = useToast()
  const [memberArray, setMemberArray] = useState([]);
  const [calendarName, setCalendarName] = useState('')
  const [calendarOwner, setCalendarOwner] = useState('')
  const [memberAddressToRemove, setMemberAddressToRemove] = useState('')
  const [multipleMemberAddresses, setMultipleMemberAddresses] = useState('')
  const [eventID, setEventID] = useState('')
  const [roleToRevoke, setRoleToRevoke] = useState('')
  const [addressForRoleRevoke, setAddressForRoleRevoke] = useState('')
  const [addressToGrantRole, setAddressToGrantRole] = useState('')
  const [transactionHash, setTransactionHash] = useState(null);
  const [selectedRole, setSelectedRole] = useState('')
  const MEMBER_ROLE_HASH = "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636";
  const ADMIN_ROLE_HASH = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
  const GUEST_ROLE_HASH = "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f";


  const getRoleName = (selectedRole) => {
    switch (selectedRole) {
      case '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775':
        return 'Admin Role';
      case '0x0000000000000000000000000000000000000000000000000000000000000000':
        return 'Default Admin Role';
        case '0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f':
        return 'Guest Role';
        case '0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636':
        return 'Member Role';
              default:
        return 'Unknown Role';
    }
  }
 
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value)
  }

  
  const hasEthereumProvider = typeof window !== 'undefined' && !!window.ethereum;
  const provider = hasEthereumProvider ? new ethers.providers.Web3Provider(window.ethereum) : null;
  const signer = provider ? provider.getSigner() : null;
  const contract = (hasEthereumProvider && displayCalendar) ? new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer) : null;

  
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const addresses = await contract.getAddressesByRole(MEMBER_ROLE_HASH); // Updated to call the correct function
        if (addresses.length === 0) {
          console.log("No addresses found.");
        }
        setAddressArray(addresses);
        
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }

    fetchAddresses();
  }, []);



  const addMembers = async (addresses) => {
    try {
        const members = addresses.split(',').map((addr) => addr.trim());
        await contract.addMembers(members);
        toast({
            title: "Members Added",
            description: "Successfully added members.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to add members.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    }
};

const deleteEvent = async (id) => {
    try {
        await contract.deleteEvent(id);
        toast({
            title: "Event Deleted",
            description: `Successfully deleted event with ID ${id}.`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to delete the event.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    }
};

const grantRole = async (selectedRole) => {
  try {
      const transactionResponse = await contract.grantRole(selectedRole, addressToGrantRole);
      
      // Wait for 1 confirmation
      toast({
        title: "Pending",
        description: 'Waiting for confirmations..',  // Use roleName instead of selectedRole
        status: "info",
        duration: 3000,
        isClosable: true,
    });
      await provider.waitForTransaction(transactionResponse.hash, 1);
      setTransactionHash(transactionResponse.hash);
      
      const roleName = getRoleName(selectedRole);  // Fetch selectedRole name
      toast({
          title: "Role Granted",
          description: `Successfully granted ${roleName} to ${formatAddress(addressToGrantRole)}.`,  // Use roleName instead of selectedRole
          status: "success",
          duration: 3000,
          isClosable: true,
      });
  } catch (error) {
      toast({
          title: "Error",
          description: "Failed to grant the selectedRole.",
          status: "error",
          duration: 3000,
          isClosable: true,
      });
  }
};

const revokeRole = async (selectedRole, account) => {
  try {
      await contract.revokeRole(selectedRole, account);
      const roleName = getRoleName(selectedRole);  // Fetch selectedRole name
      toast({
          title: "Role Revoked",
          description: `Successfully revoked ${roleName} from ${account}.`,  // Use roleName instead of selectedRole
          status: "success",
          duration: 3000,
          isClosable: true,
      });
  } catch (error) {
      toast({
          title: "Error",
          description: "Failed to revoke the selectedRole.",
          status: "error",
          duration: 3000,
          isClosable: true,
      });
  }
};


const removeMember = async (memberAddress) => {
    try {
        await contract.removeMember(memberAddress);
        toast({
            title: "Member Removed",
            description: `Successfully removed member with address ${memberAddress}.`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to remove the member.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    }
};



  useEffect(() => {
    if (!contract) return

    // Event listener for NewEventCreated
    const onNewEventCreated = (eventID, title, organizer, startTime, endTime, metadataURI, timestamp, selectedRole) => {
      console.log(`New Event Created with ID ${eventID.toString()}, ${title}, ${organizer}, ${startTime}`)
      // Implement your logic here
    }

    contract.on('NewEventCreated', onNewEventCreated)

    // Cleanup event listener
    return () => {
      contract.off('NewEventCreated', onNewEventCreated)
    }
  }, [contract])

  useEffect(() => {
    const fetchData = async () => {

      const name = await contract.calendarName()
      const owner = await contract.calendarOwner()
      

      setCalendarName(name)
      setCalendarOwner(owner)
    

    }
    fetchData()
  }, [contract])

 

  return (
    <>
    <Form >
    <Center>
      <Box width={350} p={4} p={2} mb={2}>
        <Text noOfLines={2}> Name: {calendarName}</Text>
        <HStack overflow="auto">
          <Text> Owner:</Text>
          <Text>{calendarOwner}</Text>
        </HStack>

      <CreateEventModal />

        <FormGroup style={legendStyle} legendText="Grant Role">
        <Select id="selectedRole-select" value={selectedRole} onChange={handleRoleChange} labelText="">
    <SelectItem value={""} text="Select Role" />
    <SelectItem value={MEMBER_ROLE_HASH} text="Member Role" />
    <SelectItem value={ADMIN_ROLE_HASH} text="Admin Role" />
    <SelectItem value={GUEST_ROLE_HASH} text="Guest Role" />
</Select>

    <TextInput id="account-address" placeholder="Account Address" onChange={(e) => setAddressToGrantRole(e.target.value)} />
    <Button onClick={() => grantRole(selectedRole)}>Grant Role</Button>
    {transactionHash && (
        <a
            href={`https://testnet.teloscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: '10px' }}  // Adjust as needed
        >
            View Transaction
        </a>
    )}
</FormGroup>


<FormGroup style={legendStyle} legendText="Revoke Role">
    <Select 
        id="roleToRevoke-select" 
        value={roleToRevoke} 
        onChange={(e) => setRoleToRevoke(e.target.value)}
        labelText=""
    >
        <SelectItem value="" text="Select Role" />
        <SelectItem value={MEMBER_ROLE_HASH} text="Member Role" />
    <SelectItem value={ADMIN_ROLE_HASH} text="Admin Role" />
    <SelectItem value={GUEST_ROLE_HASH} text="Guest Role" />
    </Select>
    <TextInput 
        id="address-for-roleToRevoke" 
        placeholder="Account Address" 
        onChange={(e) => setAddressForRoleRevoke(e.target.value)}
    />
    <Button onClick={() => revokeRole(roleToRevoke, addressForRoleRevoke)}>
        Revoke Role
    </Button>
</FormGroup>


      <FormGroup style={legendStyle} legendText="Remove Member">
  <Select 
    id="member-address-to-remove" 
    value={memberAddressToRemove} 
    onChange={(e) => setMemberAddressToRemove(e.target.value)}
    labelText=""
  >
    {memberArray.map(address => (
      <SelectItem key={address} value={address} text={formatAddress(address)} />
    ))}
  </Select>
  <Button onClick={() => removeMember(memberAddressToRemove)}>Remove Member</Button>
</FormGroup>


      <FormGroup style={legendStyle} legendText="Add Multiple Members">
        <TextInput id="multiple-member-addresses" placeholder="Comma-separated Member Addresses" onChange={(e) => setMultipleMemberAddresses(e.target.value)} />
        <Button onClick={() => addMembers(multipleMemberAddresses)}>Add Members</Button>
      </FormGroup>

      <FormGroup style={legendStyle} legendText="Delete Event">
        <TextInput id="event-id" placeholder="Event ID" onChange={(e) => setEventID(e.target.value)} />
        <Button onClick={() => deleteEvent(eventID)}>Delete Event</Button>
      </FormGroup>
    </Box>
    </Center>
    </Form>
    
    
    </>
    
  )
}

export default AdminDashboard
