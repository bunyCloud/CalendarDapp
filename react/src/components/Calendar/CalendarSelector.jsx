import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import CalendarFactory from '../../contracts/CalendarFactory.json'
import { formatAddress } from '../../utils/formatMetamask'
import { Select, SelectItem, Button } from '@carbon/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { AppContext } from '../../AppContext'
import { HStack, IconButton, useToast } from '@chakra-ui/react' // Added useToast

export default function CalendarSelector() {
  const { displayCalendar, rpcUrl, setDisplayCalendar } = useContext(AppContext)
  const [selectedCalendar, setSelectedCalendar] = useState(displayCalendar)
  const [calendars, setCalendars] = useState([])
  const toast = useToast() // Initialized the toast hook

  const containerStyle = {
    height: 'auto',
    marginTop: '0px',
    zIndex: 99999,
  }

  const handleCalendarChange = (event) => {
    const selectedAddress = event.target.value
    setSelectedCalendar(selectedAddress)
    setDisplayCalendar(selectedAddress)
    const selectedName = calendars.find((calendar) => calendar[1] === selectedAddress)?.[2] || ''
  }

  // make sure display Calendar is selected Calendar
  useEffect(() => {
    setSelectedCalendar(displayCalendar);
  }, [displayCalendar]);
  

  const getCalendars = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(CalendarFactory.address, CalendarFactory.abi, provider)
      const calendarAddresses = await contract.getCalendarAddresses()
      console.log(calendarAddresses)
      const calendarsData = await Promise.all(
        calendarAddresses.map(async (address) => {
          return contract.getCalendar(address)
        }),
      )
      setCalendars(calendarsData)
      toast.closeAll() // Close all existing toasts before showing a new one
      toast({
        id: 'calendar-success-toast', // Unique id for the success toast
        title: 'Updating',
        description: 'Refreshing communities list',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error getting account:', error)
      toast.closeAll() // Close all existing toasts before showing a new one
      toast({
        id: 'calendar-error-toast', // Unique id for the error toast
        title: 'Fetching failed',
        description: 'Failed to fetch calendar addresses. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    getCalendars()
  }, [])

  const refreshCalendars = () => {
    getCalendars()
  }

  return (
    <>
      <div style={containerStyle}>
        <HStack gap="auto">
          <Select
            style={{ border: '0.5px solid silver' }}
            id="change-calendar-select"
            labelText=""
            value={selectedCalendar}
            onChange={handleCalendarChange}>
            {calendars.map((calendar) => (
              <SelectItem hideLabel={true} key={calendar[1]} value={calendar[1]} text={`${calendar[2]} - ${formatAddress(calendar[1])}`} />
            ))}
          </Select>
          <IconButton
            variant="outline"
            borderRadius={'none'}
            colorScheme="whiteAlpha"
            aria-label="Refresh Calendars"
            fontSize="16px"
            height={'40px'}
            width={'auto'}
            m={1}
            mt={3}
            size={'sm'}
            onClick={refreshCalendars}
            icon={<RepeatIcon />}
          />
        </HStack>
      </div>
    </>
  )
}
