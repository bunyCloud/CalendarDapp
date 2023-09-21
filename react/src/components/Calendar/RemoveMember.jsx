import React, { useEffect, useState, useContext } from 'react'
import { ethers } from 'ethers'
import { Button, Input, Box, Text, HStack, VStack, Stack, Flex, Select } from '@chakra-ui/react'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from '../../AppContext'
import { formatAddress } from '../../utils/formatMetamask'
import RevokeUser from './RevokeUser'

export default function RemoveMember() {
  const [memberAddressToRemove, setMemberAddressToRemove] = useState('')

  const { displayCalendar } = useContext(AppContext)
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer)

  const removeMember = async (memberAddress) => {
    await contract.removeMember(memberAddress)
  }

  return (
    <>
      <VStack mt={2}>
        <Text w="100%" textAlign={'left'} mb={-2}>
          Remove Member
        </Text>

        <HStack>
          <Input size={'xs'} placeholder="Member Address" onChange={(e) => setMemberAddressToRemove(e.target.value)} />
          <Button w={150} colorScheme="messenger" size={'xs'} onClick={() => removeMember(memberAddressToRemove)}>
            Remove Member
          </Button>
        </HStack>
      </VStack>
    </>
  )
}
