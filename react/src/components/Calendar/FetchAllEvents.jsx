import React, { useState, useContext, useEffect } from 'react'
import { Center, Text, VStack, Wrap, WrapItem, IconButton, Image, HStack } from '@chakra-ui/react'
import { ethers } from 'ethers'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { Layout, Space } from 'antd'
import { AppContext } from '../../AppContext'
import { SkipBack, SkipForward } from '@carbon/icons-react'

const { Footer, Content } = Layout


const contentStyle = {
  textAlign: 'center',
  width: '100%',
  
  borderTop: '0.5px solid silver',
  borderBottom: '0.5px solid silver',
  //minHeight: '250px',
  //marginBottom: '15px',
  //color: 'white',
  //backgroundColor: 'white',
  color: 'black',
}

const FetchAllEvents = () => {
  const { displayCalendar, rpcUrl } = useContext(AppContext)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)


  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    return date.toLocaleString('en-US', options)
  }

  async function fetchAllEvents() {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
    setIsLoading(true)
    console.log('loading events....')
    const all = await contract.getAllEvents()
    console.log(all)
    setIsLoading(false)
    console.log('done loading events....')
    return all
  }

  useEffect(() => {
    fetchAllEvents().then((events) => setEvents(events))
  }, [displayCalendar])

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length)
  }

  const handlePreviousEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
  }

  const currentEvent = events[currentEventIndex]

  return (
    <Space direction="vertical" style={contentStyle}>
      <Center>
        <VStack spacing={2} w="100%">
          {isLoading && (
            <>
              <Text color='white'>Loading Events....</Text>
            </>
          )}
          {!isLoading && !currentEvent && (
        <Text color='white'>No events found...</Text>
      )}
          {currentEvent && !isLoading && (
            <Wrap spacing={2} justify="center" align="center" color="white" >
              <WrapItem key={currentEventIndex} w="100%" >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <VStack mb={8}>
                    <Text as="b" fontSize={'16px'}>
                      {currentEvent.title}
                    </Text>
                    <Text mt={-2} fontSize={'12px'}>
                      {formatTimestamp(currentEvent.startTime)}
                    </Text>
                   
                    <HStack>
          <IconButton size='xs' variant={'unstyled'} aria-label="Previous Event" icon={<SkipBack />} onClick={handlePreviousEvent} isDisabled={events.length <= 1} />
          <Image src={currentEvent.metadataURI} objectFit="cover" maxHeight="180px" />
<IconButton variant={'unstyled'} size={'xs'} aria-label="Next Event" icon={<SkipForward />} onClick={handleNextEvent} isDisabled={events.length <= 1} />
          </HStack>
                    

                    
                  </VStack>
                </div>
              </WrapItem>
            </Wrap>
          )}

          <Center color="white" mt={-6}>

          </Center>
        </VStack>
      </Center>
    </Space>
  )
}

export default FetchAllEvents
