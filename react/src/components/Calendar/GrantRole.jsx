import React, { useEffect, useState, useContext } from 'react'
import { ethers } from 'ethers'
import { Button, Input, Box, Text, HStack, VStack, Stack, Flex, Select } from '@chakra-ui/react'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from '../../AppContext'
import { formatAddress } from '../../utils/formatMetamask'
import RevokeUser from './RevokeUser'



export default function GrantRole() {
  const { displayCalendar } = useContext(AppContext)
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer)
  const guestRole = "0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f";
  const memberRole = "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636";
  const adminRole = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
  const [adminAddress, setAdminAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState("");  // You'll need to import useState from 'react'

  
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
};
  
  const grantRole = async (role, account) => {
    await contract.grantRole(role, account);
  };


  return (
    <>
      <VStack direction={['column', 'row']} spacing={2}>
        <Text>Grant Role:</Text>
        <Select size={'xs'} value={selectedRole} onChange={handleRoleChange}>
          <option value={memberRole}>Member Role</option>
          <option value={adminRole}>Admin Role</option>
          <option value={guestRole}>Guest Role</option>
        </Select>
        <Flex flex={1}>
          <Input size={'xs'} placeholder="Account Address" onChange={(e) => setAdminAddress(e.target.value)} />
        </Flex>
        <Button w={150} colorScheme='messenger' size={'xs'} onClick={() => grantRole(selectedRole, adminAddress)}>Grant Role</Button>
      <RevokeUser />
      </VStack>
    </>
  )
}
