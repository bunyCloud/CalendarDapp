import React, { useState, useContext } from 'react'
import { ethers } from 'ethers'
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Tooltip, Button } from '@chakra-ui/react'
import PublicEventForm from '../Forms/PublicEventForm'
import { AddIcon, CalendarIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { Buffer } from 'buffer'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from '../../AppContext';

const projectId = '2RMVb2CNm5bmXOtwFsrIyAXnNqx'
const projectSecret = 'b516ce6e2e07f1828d70cf50df87f859'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')


const CreateEventDrawer = () => {
  const {displayCalendar, account, accountAddress} = useContext(AppContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState()
  const [file, setFile] = useState()
  const [invitees, setInvitees] = useState('0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964')

  
 

  const uploadToIpfs = async () => {
    if (!file) return
    const data = new FormData()
    data.append('file', file)
    const response = await axios.post('https://ipfs.infura.io:5001/api/v0/add', data, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        authorization: auth,
      },
    })
    return response.data.Hash
  }
  const toast = useToast()

  const [transactionHash, setTransactionHash] = useState(null)

  const handleCreateEventForm = (formData) => {
    setEndTime(formData.endTime)
    setStartTime(formData.startTime)
    setTitle(formData.title)
    setFile(formData.file)
    setInvitees(formData.invitees)
  }
/*
  const handleCreateEvent = async () => {
    const metadataURI = await uploadToIpfs()
    if (typeof window.ethereum !== 'undefined' && metadataURI) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      let organizer // Declare the organizer variable outside the if-else block

      if (accountAddress) {
        organizer = accountAddress
      } else {
        organizer = account
      }

      const organizer = account;

      const calContract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer)
      const inviteesArray = invitees.split(',').map((item) => item.trim())
      const startTimestamp = Math.floor(startTime.getTime() / 1000)
      const endTimestamp = Math.floor(endTime.getTime() / 1000)
      try {
        const check = await contract.calendarAddress()
        console.log(`Calendar address:${check}`)
        if (check.slice(2) === '0'.repeat(40)) {
          const calendarAddress = displayCalendar
          const set = await contract.setCalendarAddress(calendarAddress)
          console.log('Default calendar address set successfully', set)
        }
        const transaction = await contract.createEvent(title, startTimestamp, endTimestamp, metadataURI, inviteesArray)
        console.log('Transaction: ', transaction)
        await provider.waitForTransaction(transaction.hash)
        const filter = calContract.filters.NewEventCreated(null, null, null, null, null, null, null, null)
        const eventLogs = await calContract.queryFilter(filter, transaction.blockNumber)
        if (eventLogs.length > 0) {
          const event = eventLogs[0]
          const eventData = {
            eventID: ethers.BigNumber.from(event.args[0]).toNumber(),
            title: event.args[1],
            organizer: event.args[2],
            startTime: formatTimestamp(event.args[3]),
            endTime: formatTimestamp(event.args[4]),
            metadataURI: event.args[5],
            timestamp: formatTimestamp(event.args[6]),
            role: getRoleName(event.args[7]),
          }
          console.log('Event data:', eventData)
          setTransactionHash(transaction.hash)
          toast({
            title: 'Transaction successful',
            description: `Calendar Event Created. Transaction hash: ${transaction.hash} - Event data: ${JSON.stringify(eventData)}`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
        }
      } catch (error) {
        toast({
          title: 'Transaction failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        console.error('An error occurred', error)
      }
    }
  }
*/
  return (
    <>

      <Button
        variant={'outline'}
        colorScheme='messenger'
        //size={'md'}
        w='100%'
        border='1px solid blue'
        
        onClick={onOpen}
        >
      <Tooltip label="Create Calendar Event" placement="top">
        <IconButton bg="transparent" color="blue" size="md"  icon={<AddIcon />} />
      </Tooltip>
      Create Event
        </Button>

      <Drawer isOpen={isOpen} onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="ghostwhite" mb={2} p={2} h={10} borderBottom="1px solid silver">
            Schedule Event
          </DrawerHeader>
          <DrawerBody overflowY={'hidden'}>
            <PublicEventForm  />
           
          </DrawerBody>

          <DrawerFooter bg="ghostwhite" borderTop="1px solid silver"></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default CreateEventDrawer
