import React from 'react'
import { Popup } from 'antd-mobile'
import { Text, Box, Avatar, VStack, HStack } from '@chakra-ui/react'

const EventDisplayDrawer = ({ calendarAddress, selectedEvent, isVisible, onClose }) => {
  return (
    <>
      {isVisible && (
        <Popup bodyStyle={{ backgroundColor: '#103e8e', color:'white', height: 'auto', padding: '20px', overflow: 'hidden' }} visible={isVisible} onMaskClick={onClose}>
          <>
            <VStack>
              <Avatar size="xl" border={'3px solid white'} name={selectedEvent.title} src={selectedEvent.metadataURI} />{' '}
              {selectedEvent && (
                <>
                  <Box w={'auto'} h="auto" p={4}>
                    <Text as="b" fontSize={'18px'} borderBottom="1px solid silver">
                      {selectedEvent.title}
                    </Text>
                    <Text fontSize="12px">Organizer: {selectedEvent.organizer}</Text>

                    <Text fontSize={'12px'} noOfLines={4}>
                      {selectedEvent.description}
                    </Text>

                    <HStack p={2}>
                      <Text fontSize="12px" noOfLines={2}>
                        Start: {selectedEvent.start.toString()}
                      </Text>
                      <Text fontSize="12px" noOfLines={2}>
                        Ends: {selectedEvent.end.toString()}
                      </Text>
                    </HStack>
                  </Box>
                </>
              )}
            </VStack>
          </>
        </Popup>
      )}
    </>
  )
}

export default EventDisplayDrawer
