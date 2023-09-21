import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { Button, Input, Box, Text, HStack, VStack, Stack, Flex, Select } from "@chakra-ui/react";
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from "../../AppContext";
import { formatAddress } from "../../utils/formatMetamask";


export default function AddUsers(){
  const [multipleMemberAddresses, setMultipleMemberAddresses] = useState('');
  const [singleAdminAddress, setSingleAdminAddress] = useState('');

    const { displayCalendar } = useContext(AppContext)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer);
  
const addMembers = async (addresses) => {
    const members = addresses.split(',').map(addr => addr.trim());
    await contract.addMembers(members);
  };

    // Functions
    const addAdmin = async (adminAddress) => {
      await contract.addAdmins([adminAddress]);
    };

return(
    <>
                <VStack>
          <Text w='100%' textAlign={'left'} mb={-2}>Add Members</Text>
          <HStack>
          <Input size={'xs'} placeholder="Comma-separated Member Addresses" onChange={e => setMultipleMemberAddresses(e.target.value)} />
          <Button w={150} colorScheme='messenger' size={'xs'}   onClick={() => addMembers(multipleMemberAddresses)}>Add</Button>
          </HStack>
        </VStack>

        <VStack mt={2} justify={'left'}>
        <Text w='100%' textAlign={'left'}>Add Administrator</Text>
          <HStack mt={-2}>
          <Input size={'xs'} placeholder="Admin Address" onChange={e => setSingleAdminAddress(e.target.value)} />
          <Button w={150} colorScheme='messenger' size={'xs'}  onClick={() => addAdmin(singleAdminAddress)}>Add</Button>
          </HStack>
        </VStack>
    </>
)
}