import React, {useState, useContext } from "react";
import { ethers } from "ethers";
import { Button, Input, Text, HStack,Select, VStack } from "@chakra-ui/react";
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from "../../AppContext";


export default function RevokeUser(){
  const [roleToRevoke, setRoleToRevoke] = useState('');
    const [addressForRoleRevoke, setAddressForRoleRevoke] = useState('');
    const guestRole = "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f";
    const memberRole = "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636";
    const adminRole = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
    const [adminAddress, setAdminAddress] = useState('');
  
    
    const handleRoleChange = (event) => {
      setRoleToRevoke(event.target.value);
  };
    const { displayCalendar } = useContext(AppContext)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer);
  
    const revokeRole = async (role, account) => {
      await contract.revokeRole(role, account);
    };
  
return(
    <>
               <VStack>
               
          <Text>Revoke Role:</Text>
          <Select size={'xs'} value={addressForRoleRevoke} onChange={handleRoleChange}>
          <option value={memberRole}>Member Role</option>
          <option value={adminRole}>Admin Role</option>
          <option value={guestRole}>Guest Role</option>
        </Select>
          
          <Input size={'xs'} placeholder="Account Address" onChange={e => setAddressForRoleRevoke(e.target.value)} />
          <Button size='xs' w={150} colorScheme='messenger' onClick={() => revokeRole(roleToRevoke, addressForRoleRevoke)}>Revoke Role</Button>
        </VStack>
    </>
)
}