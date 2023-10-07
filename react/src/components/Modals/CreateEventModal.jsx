/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useContext, useState, useEffect, useRef } from 'react'
import { Form, FileUploader, FormLabel } from '@carbon/react'
import { TextInput, TextArea as TextArea } from '@carbon/react'
import { ModalWrapper } from '@carbon/react'
import { AppContext } from '../../AppContext'
import { useClipboard, useToast, Box, HStack, VStack, FormControl, Text } from '@chakra-ui/react'
import { Avatar, List } from 'antd-mobile'
import { create } from 'ipfs-http-client'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { ethers } from 'ethers'
import { Buffer } from 'buffer'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const projectId = '2RMVb2CNm5bmXOtwFsrIyAXnNqx'
const projectSecret = 'b516ce6e2e07f1828d70cf50df87f859'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const CreateEventModal = ({ selectedDay, selectedMonth, selectedYear }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { calendarName } = useContext(AppContext)
  const [file, setFile] = useState()
  const { onCopy } = useClipboard(file)
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [invitees, setInvitees] = useState('0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964')
  const [imageUrl, setImageUrl] = useState(null)
  const { displayCalendar } = useContext(AppContext)
  const [transactionHash, setTransactionHash] = useState(null)
  const [startTime, setStartTime] = useState('') // Default to an empty string
  const [endTime, setEndTime] = useState('')
  const [currentToastId, setCurrentToastId] = useState(null)

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
    toast({
      title: 'Image Upload',
      description: `Uploading image to IPFS..`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const toastShownRef = useRef(false)

  useEffect(() => {
    const uploadFile = async () => {
      if (!file || toastShownRef.current) return

      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`Upload progress: ${prog}`),
        })
        const imageUrl = `https://ipfs.io/ipfs/${added.path}`
        setImageUrl(imageUrl)
        console.log('Uploaded image to IPFS:', imageUrl)

        if (!toastShownRef.current) {
          toast({
            title: 'Upload Confirmed!',
            description: `${imageUrl}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          toastShownRef.current = true
        }
      } catch (error) {
        console.error('Error uploading image to IPFS:', error)
      }
    }

    uploadFile()

    // Reset the ref when the file changes, allowing a new toast for a new file.
    return () => {
      toastShownRef.current = false
    }
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

  const [eventData, setEventData] = useState({
    eventID: null,
    title: '',
    organizer: '',
    startTime: '',
    endTime: '',
    metadataURI: '',
    timestamp: '',
    role: '',
  })

  // Function to update the state with event data
  function updateEventData(eventData) {
    setEventData({
      eventID: eventData.eventID,
      title: eventData.title,
      description: eventData.description,
      organizer: eventData.organizer,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      metadataURI: eventData.metadataURI,
      timestamp: eventData.timestamp,
      role: eventData.role,
    })
    console.log(title)
  }

  const handleValidate = async () => {
    let errors = []

    // Check title
    if (!title.trim()) {
      errors.push('Event title is required.')
    }

    // Check description
    if (!description.trim()) {
      errors.push('Event description is required.')
    }

    // Check start and end time
    if (!startTime || !endTime) {
      errors.push('Start and end times are required.')
    } else if (endTime <= startTime) {
      errors.push('End time should be after start time.')
    }

    // Check invitees
    const inviteesArray = invitees.split(',').map((item) => item.trim())
    if (inviteesArray.length === 0) {
      errors.push('At least one invitee is required.')
    } else {
      inviteesArray.forEach((invitee) => {
        if (!/^0x[a-fA-F0-9]{40}$/.test(invitee)) {
          errors.push(`${invitee} is not a valid Ethereum address.`)
        }
      })
    }

    // Check image upload
    if (!imageUrl) {
      errors.push('Image is required.')
    }

    // If there are any errors, show a toast and exit
    if (errors.length > 0) {
      /*
          toast({
              id: 'validation-errors',
              title: 'Validation Errors',
              description: errors.join('\n'),
              status: 'error',
              duration: 5000,
              isClosable: true,
          });
          */
      console.log('form inputs missing')
      return
    }

    // If no errors, proceed with creating the event
    await handleCreateEvent()
  }

  const handleCreateEvent = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer)
    const inviteesArray = invitees.split(',').map((item) => item.trim())
    const startTimestamp = Math.floor(startTime.getTime() / 1000)
    const endTimestamp = Math.floor(endTime.getTime() / 1000)

    // Reference to hold the current toast id
    let currentToastId

    const showToast = (options) => {
      if (currentToastId) {
        toast.close(currentToastId) // Close the previous toast if it exists
      }
      const newToastId = toast(options) // Show the new toast
      setCurrentToastId(newToastId) // Store its id
    }

    try {
      const transaction = await contract.createEvent(title, description, startTimestamp, endTimestamp, imageUrl, inviteesArray)

      const filter = contract.filters.NewEventCreated(null, null, null, null, null, null, null, null)
      const eventLogs = await contract.queryFilter(filter, transaction.blockNumber)

      if (eventLogs.length > 0) {
        const event = eventLogs[0]
        const eventData = {
          eventID: ethers.BigNumber.from(event.args[0]).toNumber(),
          title: event.args[1],
          description: event.args[2],
          organizer: event.args[3],
          startTime: formatTimestamp(event.args[4]),
          endTime: formatTimestamp(event.args[5]),
          metadataURI: event.args[7],
          timestamp: formatTimestamp(event.args[6]),
          role: getRoleName(event.args[8]),
        }
        console.log('Event data:', eventData)
        updateEventData(eventData)
        setEventData(eventData)
      }

      console.log('Transaction sent: ', transaction.hash)
      showToast({
        id: 'transaction-sent',
        title: 'Transaction',
        description: `${transaction.hash}`,
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
      showToast({
        id: 'transaction-success',
        title: 'Transaction Successful',
        description: `Calendar Event Created. Transaction hash: ${transaction.hash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <>
      <ModalWrapper
        style={{
          //position: 'relative',
          //left: '10%',
          paddingBottom: '10px',
          height: '600px',
          //padding: '20px',
          width: '100%',
        }}
        isOpen={isOpen}
        size="sm"
        primaryButtonText="Add Event"
        onClick={handleValidate}
        hasScrollingContent
        buttonTriggerText="Create Event"
        modalHeading="Schedule Event"
        handleSubmit={() => setIsOpen(false)}
        //modalLabel={calendarName}

        onClose={() => setIsOpen(false)}>
        <Form aria-label="create event form" style={{ padding: '8px', marginTop:'-12px' }}>
          <div style={{ display: 'flex', marginBottom:'8px' }}>
            <div style={{ display: 'flex', padding:'2px' }}>
              <FormControl id="startTime">
                <FormLabel>Start</FormLabel>
                <DatePicker selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect dateFormat="Pp" />
              </FormControl>
            </div>
            <div
              style={{
                display: 'flex',
                padding:'2px',
              }}>
              <FormControl id="endTime">
                <FormLabel>End</FormLabel>

                <DatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect dateFormat="Pp" />
              </FormControl>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
            }}>
            <TextInput id="title" onChange={(e) => setTitle(e.target.value)} labelText="Event Title" value={title} placeholder="Title of event" />
          </div>

          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            rows={3}
            labelText="Event Description"
            placeholder="Details describing your event."
          />

          <TextArea
            id="invitees"
            value={invitees}
            onChange={(e) => setInvitees(e.target.value)}
            rows={2}
            labelText="Invitees"
            placeholder="Wallet Addresses separated by comma."
          />

          <div className="cds--file__container">
            <FileUploader
              labelTitle="Upload Image"
              labelDescription="Max file size is 5mb. *jpg and *png only. "
              buttonLabel="Add Image"
              buttonKind="primary"
              size="sm"
              filenameStatus="edit"
              accept={['.jpg', '.png']}
              multiple={false}
              disabled={false}
              iconDescription="Delete"
              name="IPFS Image Upload"
              onChange={handleFileChange}
            />
          </div>

          <List>
            <List.Item prefix={<Avatar src={imageUrl} />} description={description}>
              <VStack textAlign={'left'}>
                <Box>
                  <Text fontSize={'14px'}>{title}</Text>
                </Box>

                <HStack>
                  <Box>
                    <Text fontSize={'12px'}>{startTime.toString()}</Text>
                  </Box>
                  <Box>
                    <Text fontSize={'12px'}>{endTime.toString()}</Text>
                  </Box>
                </HStack>
              </VStack>
            </List.Item>
          </List>
        </Form>
      </ModalWrapper>
    </>
  )
}

export default CreateEventModal
