import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { Button, Input, Box, Text, HStack, VStack, Stack, Flex, Select } from "@chakra-ui/react";
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from "../../AppContext";
import { formatAddress } from "../../utils/formatMetamask";

const AdminDashboard = () => {
  
   const [calendarName, setCalendarName] = useState("");
  const [calendarOwner, setCalendarOwner] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [guestRole, setGuestRole] = useState("");
  const [adminAddress, setAdminAddress] = useState('');
  const [multipleAdminAddresses, setMultipleAdminAddresses] = useState('');
  const [memberAddressToRemove, setMemberAddressToRemove] = useState('');
    // Additional state variables
    const [singleAdminAddress, setSingleAdminAddress] = useState('');
    const [multipleMemberAddresses, setMultipleMemberAddresses] = useState('');
    const [eventID, setEventID] = useState('');
    const [roleToRevoke, setRoleToRevoke] = useState('');
    const [addressForRoleRevoke, setAddressForRoleRevoke] = useState('');
    const [selectedRole, setSelectedRole] = useState("");  // You'll need to import useState from 'react'

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };


    const { displayCalendar } = useContext(AppContext)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer);
  
    // Functions
    const addAdmin = async (adminAddress) => {
      await contract.addAdmins([adminAddress]);
    };
  
    const addMembers = async (addresses) => {
      const members = addresses.split(',').map(addr => addr.trim());
      await contract.addMembers(members);
    };
  
    const deleteEvent = async (id) => {
      await contract.deleteEvent(id);
    };
  

  const grantRole = async (role, account) => {
    await contract.grantRole(role, account);
  };

  const addAdmins = async (addresses) => {
    const admins = addresses.split(',').map(addr => addr.trim()); // Convert comma-separated string to array
    await contract.addAdmins(admins);
  };

  const removeMember = async (memberAddress) => {
    await contract.removeMember(memberAddress);
  };

  
  useEffect(() => {
    if (!contract) return;

    // Event listener for NewEventCreated
    const onNewEventCreated = (eventID, title, organizer, startTime, endTime, metadataURI, timestamp, role) => {
      console.log(`New Event Created with ID ${eventID}`);
      // Implement your logic here
    };

    contract.on("NewEventCreated", onNewEventCreated);

    // Cleanup event listener
    return () => {
      contract.off("NewEventCreated", onNewEventCreated);
    };
  }, [contract]);

  useEffect(() => {
    const fetchData = async () => {
      if (!contract) return;

      const name = await contract.calendarName();
      const owner = await contract.calendarOwner();
      const member = await contract.MEMBER_ROLE();
      const admin = await contract.ADMIN_ROLE();
      const guest = await contract.GUEST_ROLE();

      setCalendarName(name);
      setCalendarOwner(owner);
      setMemberRole(member);
      setAdminRole(admin);
      setGuestRole(guest);
    };
    fetchData();
  }, [contract]);

  const revokeRole = async (role, account) => {
    await contract.revokeRole(role, account);
  };

  // Similar implementations for other methods

  return (
    <Box overflow={'auto'}>
    <Box w={300} overflow={'auto'}>
      <Text noOfLines={2}>Calendar Name: {calendarName}</Text>
      <Text noOfLines={2}>Calendar Owner: {formatAddress(calendarOwner)}</Text>
    
</Box>
      
      <VStack spacing={5}>
      
      <VStack direction={["column", "row"]} spacing={2}>
      <Text>Grant Role:</Text>
            <Select value={selectedRole} onChange={handleRoleChange}>
                <option value={memberRole}>Member Role</option>
                <option value={adminRole}>Admin Role</option>
                <option value={guestRole}>Guest Role</option>
            </Select>
            <Flex flex={1}><Input placeholder="Account Address" onChange={e => setAdminAddress(e.target.value)} /></Flex>
            <Button onClick={() => grantRole(selectedRole, adminAddress)}>Grant Role</Button>

                </VStack>
        
        <HStack>
          <Text>Add Admins:</Text>
          <Input placeholder="Comma-separated admin addresses" onChange={e => setMultipleAdminAddresses(e.target.value)} />
          <Button size='sm' onClick={() => addAdmins(multipleAdminAddresses)}>Apply</Button>
        </HStack>
        
        
        <HStack>
          <Text>Remove Member:</Text>
          <Input placeholder="Member Address" onChange={e => setMemberAddressToRemove(e.target.value)} />
          <Button size='sm' onClick={() => removeMember(memberAddressToRemove)}>Remove Member</Button>
        </HStack>
        <HStack>
          <Text>Add Single Admin:</Text>
          <Input placeholder="Admin Address" onChange={e => setSingleAdminAddress(e.target.value)} />
          <Button size='sm' onClick={() => addAdmin(singleAdminAddress)}>Add Admin</Button>
        </HStack>

        <HStack>
          <Text>Add Multiple Members:</Text>
          <Input placeholder="Comma-separated Member Addresses" onChange={e => setMultipleMemberAddresses(e.target.value)} />
          <Button size='sm' onClick={() => addMembers(multipleMemberAddresses)}>Add Members</Button>
        </HStack>

        <HStack>
          <Text>Delete Event:</Text>
          <Input placeholder="Event ID" onChange={e => setEventID(e.target.value)} />
          <Button size='sm' onClick={() => deleteEvent(eventID)}>Delete Event</Button>
        </HStack>

        <HStack>
          <Text>Revoke Role:</Text>
          <Input placeholder="Role" onChange={e => setRoleToRevoke(e.target.value)} />
          <Input placeholder="Account Address" onChange={e => setAddressForRoleRevoke(e.target.value)} />
          <Button size='sm' onClick={() => revokeRole(roleToRevoke, addressForRoleRevoke)}>Revoke Role</Button>
        </HStack>
      
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
