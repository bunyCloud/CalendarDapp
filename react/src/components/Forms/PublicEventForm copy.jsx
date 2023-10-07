// we need to pass endTime, startTime, title, imageUrl, invitees back to parent component

import React, { useState, useContext, useEffect } from 'react'
import { Button, TextInput, TextArea, DatePicker, DatePickerInput, FileUploader, FormGroup, Stack } from '@carbon/react'
import { TimePicker, TimePickerSelect, SelectItem } from '@carbon/react'
import { Buffer } from 'buffer'
import { create } from 'ipfs-http-client'
import { ethers } from 'ethers'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { AppContext } from '../../AppContext'
//import IconEncrypt from '../Crypt/IconEncrypt'
import { Text, useToast, Image, useClipboard, Center, HStack } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'

const projectId = '2RMVb2CNm5bmXOtwFsrIyAXnNqx'
const projectSecret = 'b516ce6e2e07f1828d70cf50df87f859'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const memberRole = '0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636'
const guestRole = '0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f'
const adminRole = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'

const PublicEventForm = ({ selectedDay, selectedMonth, selectedYear }) => {
  const [file, setFile] = useState()
  const { onCopy } = useClipboard(file)
  const [currentStep, setCurrentStep] = useState(1)
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [invitees, setInvitees] = useState('0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964')
  const [imageUrl, setImageUrl] = useState(null)
  const [password, setPassword] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [startDay, setStartDay] = useState(null)
  const [endDay, setEndDay] = useState(null)
  const { displayCalendar } = useContext(AppContext)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [starttimeMeridiem, setStarttimeMeridiem] = useState('AM')
  const [transactionHash, setTransactionHash] = useState(null)
  const [endtimeMeridiem, setEndtimeMeridiem] = useState('PM')

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
      alert('MetaMask or a compatible Web3 provider not found')
      // Request to connect MetaMask or compatible provider
      try {
        await window.ethereum.enable()
      } catch (error) {
        console.error('User denied account access:', error)
        return
      }
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer)
    const inviteesArray = invitees.split(',').map((item) => item.trim())
    const startTimestamp = Math.floor(startTime.getTime() / 1000)
    const endTimestamp = Math.floor(endTime.getTime() / 1000)
    try {
      const transaction = await contract.createEvent(title, description, startTimestamp, endTimestamp, imageUrl, inviteesArray)
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

      console.log('Transaction sent: ', transaction.hash)
      toast({
        id: 'transaction-sent',
        title: 'Transaction Sent',
        description: `Transaction hash: ${transaction.hash}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
      const receipt = await transaction.wait(1)
      if (receipt.status === 0) {
        throw new Error('Transaction failed')
      }
      console.log('Transaction confirmed: ', transaction.hash)
      setTransactionHash(transaction.hash)
      setCurrentStep(6)
      toast({
        id: 'transaction-success',
        title: 'Transaction Successful',
        description: `Calendar Event Created. Transaction hash: ${transaction.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        id: 'transaction-failure',
        title: 'Transaction Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.error('An error occurred:', error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ border: '1px solid silver', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Center>
          <VStack>
            {/* Step 1: Event Details */}
            {currentStep === 1 && (
              <div>
                <FormGroup
                  style={{
                    maxWidth: '400px',
                  }}
                  legendText="Create Event Form">
                  <Stack gap={7}>
                    <TextInput
                      id="title"
                      labelText="Event Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for your event"
                    />
                    {/* ... */}
                    <TextArea labelText="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    {/* ... */}
                  </Stack>
                  <FormGroup
                    style={{
                      maxWidth: '400px',
                    }}
                    legendText="Schedule Event">
                    <Stack gap={7}>
                      {/* Date Selector */}
                      <HStack>
                      <DatePicker
                        datePickerType="single"
                        dateFormat="m/d/Y"
                        maxDate="11/16/2029"
                        onChange={(eventOrDates) => {
                          const value = eventOrDates.target?.value || ''
                          setStartDay(value)
                        }}>
                        <DatePickerInput style={{width:100}} id="date-picker" labelText="Start Day" placeholder="mm/dd/yyyy" value={startDay} />
                      </DatePicker>

                      <DatePicker
                        datePickerType="single"
                        dateFormat="m/d/Y"
                        maxDate="11/16/2029"
                        onChange={(eventOrDates) => {
                          const value = eventOrDates.target?.value || ''
                          setEndDay(value)
                        }}>
                        <DatePickerInput style={{width:100}} id="date-picker" labelText="Select End day" placeholder="mm/dd/yyyy" value={endDay} />
                      </DatePicker>
                      </HStack>
                      <VStack gap="auto" mt={-6}>
                        <TimePicker labelText="Start Time" value={startTime} onChange={(event) => setStartTime(event.target.value)}>
                          <TimePickerSelect
                            labelText="Meridiem"
                            id="meridiem"
                            value={starttimeMeridiem}
                            onChange={(event) => setStarttimeMeridiem(event.target.value)}>
                            <SelectItem value="AM" text="AM" />
                            <SelectItem value="PM" text="PM" />
                          </TimePickerSelect>
                        </TimePicker>

                        <TimePicker labelText="End Time" value={endTime} onChange={(event) => setEndTime(event.target.value)}>
                          <TimePickerSelect
                            labelText="Meridiem"
                            id="meridiem"
                            value={endtimeMeridiem}
                            onChange={(event) => setEndtimeMeridiem(event.target.value)}>
                            <SelectItem value="AM" text="AM" />
                            <SelectItem value="PM" text="PM" />
                          </TimePickerSelect>
                        </TimePicker>
                        <FileUploader
                  labelTitle="Upload files"
                  labelDescription="Max file size is 500mb. Only .jpg files are supported."
                  buttonLabel="Add file"
                  buttonKind="primary"
                  size="md"
                  filenameStatus="edit"
                  accept={['.jpg', '.png']}
                  multiple={true}
                  disabled={false}
                  onChange={handleFileChange}
                  iconDescription="Delete file"
                  name=""
                />
                      </VStack>
                    </Stack>
                  </FormGroup>
                </FormGroup>
              </div>
            )}

            

            {/* Step 3: Review & Submit */}
            {currentStep === 2 && (
              <div>
                <Text>Title: {title}</Text>
                <Text>Description: {description}</Text>
                <Text>Start Time: {startTime.toString()}</Text>
                <Text>End Time: {endTime.toString()}</Text>
                <Text>Invitees: {invitees}</Text>
                <Text>
                  {' '}
                  <Image src={imageUrl} w={200} />
                </Text>

                <Button onClick={handleCreateEvent}>Create Public Event</Button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              {currentStep > 1 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>}
              {currentStep < 3 && <Button onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>}
            </div>
          </VStack>
        </Center>
      </div>
    </div>
  )
}

export default PublicEventForm
