// we need to pass endTime, startTime, title, imageUrl, invitees back to parent component

import React, { useState, useContext, useEffect } from 'react'
import {
  Box,
  Input,
  Tooltip,
  VStack,
  FormControl,
  useClipboard,
  IconButton,
  useToast,
  FormLabel,
  Textarea,
  Text,
  Button,
  HStack,
  Center,
  InputGroup,
  InputRightElement,
  Image,
} from '@chakra-ui/react'
import { Buffer } from 'buffer'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { create } from 'ipfs-http-client'
import { ethers } from 'ethers'
import { CopyIcon } from '@chakra-ui/icons'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from '../../AppContext'
//import IconEncrypt from '../Crypt/IconEncrypt'
import { LockOutlined } from '@ant-design/icons'

const projectId = '2RMVb2CNm5bmXOtwFsrIyAXnNqx'
const projectSecret = 'b516ce6e2e07f1828d70cf50df87f859'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const memberRole = '0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636'
const guestRole = '0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f'
const adminRole = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'

const PublicEventForm = ({ selectedDay, selectedMonth, selectedYear }) => {
  const [file, setFile] = useState()
  const { onCopy } = useClipboard(file)
  const [currentStep, setCurrentStep] = useState(1);
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [invitees, setInvitees] = useState('0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964')
  const [imageUrl, setImageUrl] = useState(null)
  const [password, setPassword] = useState(null)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date()) // Initialize the endTime state with the current date/time
  const { displayCalendar } = useContext(AppContext)


  // Function to bundle all data and pass it to the parent component


  const handleCopy = () => {
    onCopy()
    setIsCopied(true)

    // Show Toast notification on successful copy
    toast({
      title: 'File data copied!',
      description: `The file data has been copied to the clipboard.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })

    // Reset the "copied" state after a short delay (optional)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth,
    },
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFile(file)
  }

  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return

      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`Upload progress: ${prog}`),
        })

        const imageUrl = `https://ipfs.io/ipfs/${added.path}`
        setImageUrl(imageUrl)
        console.log('Uploaded image to IPFS:', imageUrl)
      } catch (error) {
        console.error('Error uploading image to IPFS:', error)
      }
    }

    uploadFile()
  }, [file, client])

  const getRoleName = (roleAddress) => {
    switch (roleAddress) {
      case memberRole:
        return 'Member'
      case guestRole:
        return 'Guest'
      case adminRole:
        return 'Admin'
      default:
        return 'Unknown Role'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date
  }


  const handleCreateEvent = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask or a compatible Web3 provider not found');
      // Request to connect MetaMask or compatible provider
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error('User denied account access:', error);
        return;
      }
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer);
    const inviteesArray = invitees.split(',').map((item) => item.trim());
    const startTimestamp = Math.floor(startTime.getTime() / 1000);
    const endTimestamp = Math.floor(endTime.getTime() / 1000);
      try {
      const transaction = await contract.createEvent(title, description, startTimestamp, endTimestamp, imageUrl, inviteesArray);
      const filter = contract.filters.NewEventCreated(null, null, null, null, null, null, null, null)
      const eventLogs = await contract.queryFilter(filter, transaction.blockNumber)
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
      }
        
      console.log('Transaction sent: ', transaction.hash);
      toast({
        id: 'transaction-sent',
        title: 'Transaction Sent',
        description: `Transaction hash: ${transaction.hash}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      const receipt = await transaction.wait(1); 
      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }
        console.log('Transaction confirmed: ', transaction.hash);
      setTransactionHash(transaction.hash);
      setCurrentStep(6);
        toast({
        id: 'transaction-success', 
        title: 'Transaction Successful',
        description: `Calendar Event Created. Transaction hash: ${transaction.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      } catch (error) {
            toast({
        id: 'transaction-failure', 
        title: 'Transaction Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('An error occurred:', error);
    }
  };
  

  
  const [transactionHash, setTransactionHash] = useState(null)
  const formattedTransactionHash = transactionHash ? `${transactionHash.slice(0, 12)}...${transactionHash.slice(-6)}` : null

  const handleEncrypt = (encryptedData) => {
    setTitle(encryptedData)
  }

  const handlePassword = (password) => {
    setPassword(password)
  }

  return (
    <VStack spacing={4}>
      {currentStep === 1 && (
      <>
        <Box border="1px solid silver" mt={1} p={2} w="100%" bg="ghostwhite" mb={-2}>
        <FormControl id="title">
          <FormLabel>Event Title</FormLabel>
          <InputGroup>
            <Input
              bg="white"
              border="1px solid silver"
              size="xs"
              placeholder="Enter a title for your event"
              variant="filled"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/*
      <InputRightElement width='2.5rem' mt={-1}>
        <Tooltip label='encrypt text'>
        <IconEncrypt textToEncrypt={title} onPassword={handlePassword} onEncrypt={handleEncrypt} />
</Tooltip>
      </InputRightElement>
 */}
          </InputGroup>
          {password && (
            <>
              <Text>Password:</Text>
              <Text noOfLines={2} overflow={'auto'}>
                {password}
              </Text>
            </>
          )}
          <Text fontSize="11px">* Calendar event title & Description</Text>
        </FormControl>
        <FormControl id="description">
          <FormLabel>Event Description</FormLabel>
          <InputGroup>
          <Textarea
            size="xs"
            noOfLines={3}
            bg="white"
            border="1px solid silver"
            variant="filled"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />


          </InputGroup>
         
        </FormControl>
      </Box>
        </>
      )}

      {/* Step 2: Start Time and End Time */}
      {currentStep === 2 && (
        <>
        <Center>
        <VStack>
          <FormControl id="startTime">
            <HStack>
              <FormLabel>Start Time</FormLabel>
              <DatePicker
                selected={
                  new Date(
                    selectedYear || new Date().getFullYear(),
                    selectedMonth || new Date().getMonth(),
                    selectedDay || new Date().getDate(),
                    startTime ? startTime.getHours() : new Date().getHours(),
                    startTime ? startTime.getMinutes() : new Date().getMinutes(),
                  )
                }
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </HStack>
          </FormControl>

          <FormControl id="endTime">
            <HStack>
              <FormLabel>End Time</FormLabel>
              <Box ml={1.5}>
                <DatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect dateFormat="Pp" />
              </Box>
            </HStack>
          </FormControl>
        </VStack>
      </Center>
        </>
      )}

      {/* Step 3: Image Upload */}
      {currentStep === 3 && (
        <>
        <Box border="1px solid silver"  p={2} w="100%" bg="ghostwhite">
        <FormControl id="metadataURI">
          <FormLabel>Image (IPFS)</FormLabel>
          <Input size='xs'  p={2} mb={6} pb={6}   variant='flushed' type="file" onChange={handleFileChange} />
          {imageUrl && (
            <>
              <HStack >
                <Text bg="#00f2ff" p={1} fontSize="11px" overflow={'hidden'} noOfLines={1}>
                  {imageUrl}
                </Text>
                <Tooltip label={isCopied ? 'Copied!' : 'Copy to clipboard'}>
                  <IconButton icon={<CopyIcon />} size="xs" aria-label="Copy to clipboard" onClick={handleCopy} colorScheme={isCopied ? 'green' : 'gray'} />
                </Tooltip>
              </HStack>
              <Image src={imageUrl} w='auto' />
            </>
          )}
        </FormControl>
      </Box>
        </>
      )}

      {/* Step 4: Invitees */}
      {currentStep === 4 && (
        <>
        <Box border="1px solid silver" mt={-2} p={2} w="100%" bg="ghostwhite">
        <FormControl id="invitees">
          <FormLabel>Invitees</FormLabel>
          <Text fontSize={'sm'}>*Separate addresses with comma.</Text>
          <Textarea
            size="sm"
            bg="white"
            border="1px solid silver"
            variant="filled"
            placeholder="Enter addresses, separated by commas"
            value={invitees}
            onChange={(e) => setInvitees(e.target.value)}
          />
        </FormControl>
      </Box>
        </>
      )}

      {/* Step 5: Review & Submit */}
      {currentStep === 5 && (
        <Box w={300} overflow={'auto'}>
          {/* Display all selected data for review */}
          <Text>Title: {title}</Text>
          <Text>Description: {description}</Text>
          <Text>Start Time: {startTime.toString()}</Text>
          <Text>End Time: {endTime.toString()}</Text>
          <Text>Invitees: {invitees}</Text>
          <Center mt={2} p={2}>
          <Text> <Image src={imageUrl} w={200} /></Text>
          </Center>

          <Button w="100%" size={'sm'} colorScheme="messenger" onClick={handleCreateEvent}>
        Create Public Event
      </Button>
        </Box>
      )}

      {currentStep === 6 && (
        <>
        {transactionHash && (
        <Box p={2} w={300}>
          Transaction hash:{' '}
          <Text as="a" color="blue.500" href={`https://testnet.teloscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {formattedTransactionHash}
          </Text>
        </Box>
      )}
        </>
      )}

      {/* Navigation Buttons */}
      {currentStep > 1 && (
        <Button size={'sm'} onClick={() => setCurrentStep(currentStep - 1)}>
          Previous
        </Button>
      )}
    <HStack>
    {currentStep < 5 ? (
        <Button size={'sm'} onClick={() => setCurrentStep(currentStep + 1)}>
          Next
        </Button>
      ) : (
        <Button size={'sm'} onClick={handleCreateEvent}>
          Submit
        </Button>
      )}
    </HStack>
    </VStack>


  )
}

export default PublicEventForm
