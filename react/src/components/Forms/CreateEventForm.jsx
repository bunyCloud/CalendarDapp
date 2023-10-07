/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useContext, useState, useEffect } from 'react'
import { Form, FileUploader, Button, FormLabel } from '@carbon/react'
import { TextInput, TextArea } from '@carbon/react'
import { AppContext } from '../../AppContext'
import { useClipboard, useToast, Box, HStack, VStack, FormControl, Text, Center } from '@chakra-ui/react'
import { Avatar, List } from 'antd-mobile'
import { create } from 'ipfs-http-client'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { ethers } from 'ethers'
import { Buffer } from 'buffer'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled from "styled-components";

const StyledDatePicker = styled(DatePicker)`
    .react-datepicker__input-container input {
        background-color: #f4f4f4;
    }
`;

const projectId = '2RMVb2CNm5bmXOtwFsrIyAXnNqx'
const projectSecret = 'b516ce6e2e07f1828d70cf50df87f859'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const CreateEventForm = () => {
  const { calendarName } = useContext(AppContext)
  const [file, setFile] = useState()
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [invitees, setInvitees] = useState('0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964')
  const [imageUrl, setImageUrl] = useState(null)
  const { displayCalendar } = useContext(AppContext)
  const [transactionHash, setTransactionHash] = useState(null)
  const formattedTransactionHash = transactionHash ? `${transactionHash.slice(0, 12)}...${transactionHash.slice(-6)}` : null
  const [startTime, setStartTime] = useState('') // Default to an empty string
  const [endTime, setEndTime] = useState('')



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

  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return;

      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`Upload progress: ${prog}`),
        });

        const imageUrl = `https://ipfs.io/ipfs/${added.path}`;
        setImageUrl(imageUrl);
        console.log('Uploaded image to IPFS:', imageUrl);

        // Check if a toast is already open, and close it before showing the new one
        if (isToastOpen) {
          toast.closeAll(); // Close all existing toasts
        }

        toast({
          title: 'Upload Confirmed!',
          description: `${imageUrl}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Set the state to indicate that a toast is open
        setIsToastOpen(true);
      } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        setIsToastOpen(false); // Set the state to indicate that no toast is open
      }
    };

    uploadFile();
  }, [file, client, toast, isToastOpen]);

  const guestRole = '0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f'
  const memberRole = '0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636'
  const adminRole = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'

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

  const handleCreateEvent = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer)
    const inviteesArray = invitees.split(',').map((item) => item.trim())
    const startTimestamp = Math.floor(startTime.getTime() / 1000)
    const endTimestamp = Math.floor(endTime.getTime() / 1000)
    // Reference to hold the current toast id
    let currentToastId
    // Helper function to display toasts
    const showToast = (options) => {
      if (currentToastId) {
        toast.close(currentToastId) // Close the previous toast if it exists
      }
      currentToastId = toast(options) // Show the new toast and store its id
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
      showToast({
        id: 'transaction-failure',
        title: 'Transaction failed call a supervisor!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.error('An error occurred:', error)
    }
  }

  return (
    <>
      <Form>
        <Center>
          <Box width={350} p={4} mb={2}>
            <div style={{ display: 'flex' }}>
              <HStack>
                <VStack>
                  <HStack w={300} p={2}>
                    <FormControl id="startTime">
                      <FormLabel>Start Time</FormLabel>
                      <HStack>
                        <StyledDatePicker selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect dateFormat="Pp" />
                      </HStack>
                    </FormControl>

                    <FormControl id="endTime">
                      <FormLabel>End Time</FormLabel>
                      <HStack>
                        <Box>
                          <StyledDatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect dateFormat="Pp" />
                        </Box>
                      </HStack>
                    </FormControl>
                  </HStack>
                </VStack>
              </HStack>
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
            {imageUrl && (
              <>
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
              </>
            )}
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </Box>
        </Center>
      </Form>
    </>
  )
}

export default CreateEventForm
