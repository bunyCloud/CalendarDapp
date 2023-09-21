import React, { useContext, useState } from 'react'
import { AppContext } from '../../AppContext'
import { Box, Center, Flex, HStack, Text, Tooltip } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { IconButton, AlertTitle, Alert, AlertIcon } from '@chakra-ui/react'
import DailyTelosMain from '../Calendar/DailyTelosMain'
import ShareIcons from '../../utils/ShareIcons'
import FetchAllEvents from '../Calendar/FetchAllEvents'
import AddCalendarDrawer from './../Drawers/AddCalendarDrawer'
import IconDashboard from '../Drawers/IconDashboard'
import CalendarSelector from '../Calendar/CalendarSelector'
import CreateEventDrawer from '../Drawers/CreateEventDrawer'
import AdminDrawer from '../Drawers/AdminDrawer'

const MainLayout = ({ fetchInvitations, onDisplayCalendar }) => {
  const { account, calendarBg, displayCalendar, accountAddress, setDisplayCalendar, calendarFontColor } = useContext(AppContext)
  const [selectedCalendarName, setSelectedCalendarName] = useState('')
  const [showLeftColumn, setShowLeftColumn] = useState(true)
  const [showRightColumn, setShowRightColumn] = useState(true)

  const handleToggleLeftColumn = () => {
    setShowLeftColumn((prev) => !prev)
  }

  const handleToggleRightColumn = () => {
    setShowRightColumn((prev) => !prev)
  }

  const handleSelectCalendar = (address, name) => {
    setDisplayCalendar(address)
    onDisplayCalendar(address)
    setSelectedCalendarName(name)
  }

  return (
    <Flex direction={{ base: 'column', md: 'row' }} >
      {showLeftColumn && (
        <Box w={{ base: '100%', md: '20%' }} bg="ghostwhite" border="1px solid silver">
          <>
            <Box bg="ghostwhite" h={'auto'} border="1px solid silver" w="100%">
              {' '}
              {!account && (
                <>
                  <Text as="b">Welcome to Daily Telos!</Text>
                  <Text p={2} bg="white">
                    Create and access immutable reports, text entries, public notices and events on the Telos blockchain.
                  </Text>

                  <Text p={2} bg="white">
                    Cross chain NFT wallet and account creation. NFT permission based events.
                  </Text>
                  <Text p={2} bg="white">
                    Create, schedule and sell NFT tickets for online and real life events.
                  </Text>
                </>
              )}
            </Box>
  
          </>
          <Box p={0} w="100%" mt={10}>
            <FetchAllEvents />
          </Box>
        </Box>
      )}
      <Box
        w={{
          base: showLeftColumn && showRightColumn ? '100%' : showLeftColumn ? '80%' : showRightColumn ? '80%' : '100%',
          md: showLeftColumn && showRightColumn ? '60%' : showLeftColumn ? '80%' : showRightColumn ? '80%' : '100%',
        }}
        bg={calendarBg}
        p={1}
        color={calendarFontColor}
        borderTop="1px solid silver">
        <DailyTelosMain />
        <HStack justify="center">
          <HStack p={2}>
            {showLeftColumn && (
              <>
                <Tooltip label="Hide left column" placement="top">
                  <IconButton aria-label="Hide left column" icon={<ArrowLeftIcon />} onClick={handleToggleLeftColumn} size={'sm'} />
                </Tooltip>
              </>
            )}
            {!showLeftColumn && (
              <>
                <Tooltip label="Show left column" placement="top">
                  <IconButton size={'sm'} aria-label="Show left column" icon={<ArrowRightIcon />} onClick={handleToggleLeftColumn} />
                </Tooltip>
              </>
            )}
          </HStack>

          <HStack p={2}>
            {showRightColumn && (
              <>
                <Tooltip label="Hide right column" placement="top">
                  <IconButton size={'sm'} aria-label="Hide right column" icon={<ArrowRightIcon />} onClick={handleToggleRightColumn} />
                </Tooltip>
              </>
            )}

            {!showRightColumn && (
              <>
                <Tooltip label="Show right column" placement="top">
                  <IconButton size={'sm'} aria-label="Show right column" icon={<ArrowLeftIcon />} onClick={handleToggleRightColumn} />
                </Tooltip>
              </>
            )}
          </HStack>
        </HStack>
      </Box>
      {showRightColumn && (
        <Box w={{ base: '100%', md: '20%' }} bg="ghostwhite" color="black" border="1px solid silver">
          <>
          <Center>
          <Box bg="ghostwhite" borderBottom="2px solid silver" w="auto">
          <AdminDrawer />
          </Box>
          <Box bg="ghostwhite" borderBottom="0px solid silver" w="100%">
              <IconDashboard fetchInvitations={fetchInvitations} />
            </Box>
          </Center>
            <Box bg="ghostwhite" borderBottom="0px solid silver" w="100%">
              <CalendarSelector onSelectCalendar={handleSelectCalendar} />
            </Box>
            

            <Box bg="white" borderBottom="0px solid silver" w="100%" p={4} border='0.5px solid silver'>
              <Center>
                <CreateEventDrawer />
              </Center>
            </Box>
            <ShareIcons />
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              marginTop={2}
              borderTop="1px solid silver"
              borderBottom="1px solid silver"
              marginBottom={-1}
              color="black"
              width="auto"
              justifyContent="center"
              textAlign="center"
              height="45px">
              <HStack>
                <AlertIcon boxSize="10px" mr={0} />
                <AlertTitle mt={1} mb={1} fontSize="12px">
                  <Text noOfLines={2} fontSize="10px">
                    This dApp is under active development...
                  </Text>
                </AlertTitle>
              </HStack>
            </Alert>
          </>
        </Box>
      )}
    </Flex>
  )
}

export default MainLayout
