import React, { useState, useEffect, useContext } from 'react'
import { Text, HStack, Center, VStack, Wrap, Icon, WrapItem, Heading } from '@chakra-ui/react'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import { ethers } from 'ethers'
import { Button } from '@carbon/react'
import { Tag, NoticeBar } from 'antd-mobile'
import { Globe, Application, PersonFavorite,CloseOutline, UserData } from '@carbon/react/icons';
import { AppContext } from '../../AppContext'

const FetchCalendardefaultVertical = () => {
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
    if (!window.ethereum) {
      console.log('Provider not found.')
      return // Exit the function early if no provider is found
    }

    async function fetchStats() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
      const te = await contract.totalEvents()
      setTotalEvents(te.toString())
    }
    fetchStats()
  }, [displayCalendar])

  return (
    <div>
      <VStack w="100%" color="black">
        
      <HStack>
      <Text fontSize="lg" ml={-4}>{calendarName}</Text>
      <Icon as={Globe} size="32px" />
      </HStack>
      
      
          
      
        <VStack justify="center"  border="0px solid silver" w="100%">
          <Wrap>
            <WrapItem>
            
              <NoticeBar
               style={{width:'150px'}}
               color='default'
                        icon={<UserData />}
            content={<>Guest: {guestCount}</>}
          />
              
            </WrapItem>
            <WrapItem>
              
              <NoticeBar
               style={{width:'150px'}}
               color='default'
                        icon={<UserData />}
            content={<>Members: {memberCount}</>}
          />
            </WrapItem>
            <WrapItem>
            
              <NoticeBar
               style={{width:'150px'}}
               color='default'
               icon={<UserData />}
            content={<>Admins: {adminCount}</>}
          />
            </WrapItem>
            <WrapItem>
            
          <NoticeBar
               style={{width:'150px'}}
               color='info'
               icon={<UserData />}
            content={<>Events: {totalEvents}</>}
          />
            </WrapItem>
            
          </Wrap>
        </VStack>

        

      </VStack>
    </div>
  )
}

export default FetchCalendardefaultVertical
