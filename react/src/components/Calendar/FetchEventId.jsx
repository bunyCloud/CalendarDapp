import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { AppContext } from '../../AppContext'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { Text, Card, CardHeader, CardBody, Stack, Box, Image, Center, Wrap, WrapItem, HStack } from '@chakra-ui/react'
import { formatAddress } from '../../utils/formatMetamask'

const FetchEventId = ({ eventId }) => {
  const [event, setEvent] = useState(null)
  const { displayCalendar, rpcUrl, account, accountAddress } = useContext(AppContext)

  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    return date.toLocaleString('en-US', options)
  }

  useEffect(() => {
    const fetchEventById = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
        const fetchedEvent = await contract.getEventById(eventId)
        console.log(fetchedEvent)
        setEvent(fetchedEvent)
      } catch (error) {
        console.error('Failed to fetch event by ID:', error)
      }
    }
  
    fetchEventById()
  }, [displayCalendar])

  return (
    <Card width="100%">
      <CardHeader>
        <Text fontSize="16px" as="b" textTransform="uppercase">
          Event ID: {eventId.toString()}
        </Text>
      </CardHeader>

      <CardBody>
        <Stack divider={<Box borderBottomWidth="1px" />} spacing="4">
          <Box>
            {event ? (
              <div>
                <Center bg="ghostwhite" p={2} border="1px solid silver" mb={1}>
                  <Image w="auto" src={event.metadataURI} />
                </Center>
                <HStack>
                <Text as="b" fontSize={'16px'}>
                  Title:</Text>
                  <Text> {event.title}
                </Text>
                </HStack>
               
                <HStack>
                <Text as='b'>Organizer:</Text>
                <Text> {formatAddress(event.organizer)}</Text>
                </HStack>
                <Wrap>
                  <HStack gap='6px'>
                    <WrapItem>
                      <Text mr={1} as='b'>Starts:</Text> <Text>{formatTimestamp(event.startTime)}</Text>
                    </WrapItem>

                    <WrapItem>
                      <Text mr={1} as='b'>Ends:</Text> <Text>{formatTimestamp(event.endTime)}</Text>
                    </WrapItem>
                  </HStack>
                </Wrap>
                <HStack>
                <Text as='b'>Invitees:</Text><Text> {event.invitedAttendees}</Text>
                </HStack>

           </div>
            ) : null}
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default FetchEventId
