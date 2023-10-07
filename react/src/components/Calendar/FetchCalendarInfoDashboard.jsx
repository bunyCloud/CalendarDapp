import React, { useState, useEffect, useContext } from 'react'
import { Text, HStack, Center, VStack, Wrap, WrapItem, Heading } from '@chakra-ui/react'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { ethers } from 'ethers'
import { Tag } from 'antd-mobile'
import { AppContext } from '../../AppContext'

const FetchCalendarInfoDashboard = () => {
  const { displayCalendar, rpcUrl } = useContext(AppContext)
  const [adminCount, setAdminCount] = useState(0)
  const [guestCount, setGuestCount] = useState(0)
  const [memberCount, setMemberCount] = useState(0)
  const [totalEvents, setTotalEvents] = useState(0)
  const [calendarName, setCalendarName] = useState(null)

  useEffect(() => {
    async function fetchCalendarName() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
      const name = await contract.calendarName()
      console.log(`Connecting to calendar ${name}`)
      setCalendarName(name)
    }
    fetchCalendarName()
  }, [displayCalendar])

  useEffect(() => {
    if (!window.ethereum) {
      console.log('Provider not found.')
      return // Exit the function early if no provider is found
    }
    async function fetchStats() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
      const ac = await contract.adminCount()
      const gc = await contract.guestCount()
      const mc = await contract.memberCount()
      const te = await contract.totalEvents()
      // Update state variables
      setAdminCount(ac.toString())
      setGuestCount(gc.toString())
      setMemberCount(mc.toString())
      setTotalEvents(te.toString())
    }

    fetchStats()
  }, [displayCalendar])

  useEffect(() => {

    async function fetchStats() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
      const te = await contract.totalEvents()
      setTotalEvents(te.toString())
    }
    fetchStats()
  }, [displayCalendar, rpcUrl])

  return (
    <div>
      <VStack w="100%" color="white" p={2}>
        
      <Heading as='h4' size='md'>

      {calendarName}
      </Heading>
          
      
        <HStack justify="center"  border="0px solid silver" w="100%">
          <Wrap>
            <WrapItem>
              <Tag color="#0700dd" style={{ '--text-color': 'white' }}>
                Admins: {adminCount}
              </Tag>
            </WrapItem>
            <WrapItem>
              <Tag color="#067EC5" style={{ '--text-color': 'white' }}>
                Members: {memberCount}
              </Tag>
            </WrapItem>
            <WrapItem>
              <Tag color="#00f2ff" style={{ '--text-color': 'var(--adm-color-text)' }}>
                Guest: {guestCount}
              </Tag>
            </WrapItem>
          </Wrap>
        </HStack>

       
        {/*
        <Center>
          <Tag color="black" style={{ '--text-color': 'white' }}>
            Total Events: {totalEvents}
          </Tag>
        </Center>

        */}
      </VStack>
    </div>
  )
}

export default FetchCalendarInfoDashboard
