import React, { useState, useContext, useEffect } from 'react'
import { Center, HStack, Text, VStack, Wrap, WrapItem, IconButton, Image, Grid, GridItem } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons' // Import Chakra UI arrow icons
import { format } from 'date-fns'
import { ethers } from 'ethers'
import { formatAddress } from '../../utils/formatMetamask'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { Layout, Space } from 'antd'
import { AppContext } from '../../AppContext'

const { Footer, Content } = Layout

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 50,
  width: 'auto',
  marginBottom: 5,
  border: '1px solid silver',
  backgroundColor: '#7dbcea',
}

const contentStyle = {
  textAlign: 'center',
  //minHeight: 120,
  //lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
}

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 'auto',
  backgroundColor: '#7dbcea',
  border: '1px solid silver',
}

const FetchAllEvents = () => {
  const { displayCalendar } = useContext(AppContext)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
  const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date
  }


  async function fetchAllEvents() {
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
    <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
      <Layout>
        <Center style={headerStyle}>
          <Text>{currentEvent && <>{currentEvent.title}</>}</Text>
        </Center>
        <Content>
          <Center h={250}>
            <VStack spacing={4}>
              {isLoading && (
                <>
                  <Text>Loading....</Text>
                </>
              )}
              {currentEvent && !isLoading && (
                <Wrap spacing={4} justify="center" align="center">
                  <WrapItem key={currentEventIndex} w="100%">
                    <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                      <VStack>
                        <Image src={currentEvent.metadataURI} objectFit="cover" maxHeight="180px" />
                        <div style={{ padding: '4px', marginLeft: '4px' }}>
                          {/*  <Text as='b'>{currentEvent.title}</Text> */}
                          <HStack>
                            <Text as="b">Description:</Text> <p> {currentEvent.description}</p>
                          </HStack>
                          <HStack>
                            <Text as="b">Start:</Text> <p>{currentEvent.startTime.toString()}</p>
                          </HStack>
                          <HStack>
                            <Text as="b">End:</Text> <p>{currentEvent.endTime.toString()}</p>
                          </HStack>
                          {/* Invitees */}
                        </div>
                      </VStack>
                    </div>
                  </WrapItem>
                </Wrap>
              )}
            </VStack>
          </Center>
        </Content>
        <Footer style={footerStyle}>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            <GridItem colSpan={2} h="auto">
              <IconButton aria-label="Previous Event" icon={<ArrowBackIcon />} onClick={handlePreviousEvent} isDisabled={events.length <= 1} />
            </GridItem>
            <GridItem colStart={4} colEnd={6} h="auto">
              <IconButton aria-label="Next Event" icon={<ArrowForwardIcon />} onClick={handleNextEvent} isDisabled={events.length <= 1} />
            </GridItem>
          </Grid>
        </Footer>
      </Layout>
    </Space>
  )
}

export default FetchAllEvents
