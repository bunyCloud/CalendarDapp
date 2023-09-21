import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Text,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
} from '@chakra-ui/react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { ethers } from 'ethers'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format } from 'date-fns'
import PublicEventForm from '../Forms/PublicEventForm'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { formatAddress } from '../../utils/formatMetamask'
import EventDisplayDrawer from '../Drawers/EventDisplayDrawer'

const localizer = momentLocalizer(moment)

const CalendarOneAddress = CalendarDailyTelos.address

const DailyTelosMain = ({ reloadPage }) => {
  const [events, setEvents] = useState([]);
  const { account,displayCalendar, logged } = useContext(AppContext)
  const { isOpen: isOpenEventModal, onOpen: onOpenEventModal, onClose: onCloseEventModal } = useDisclosure();
  const { isOpen: isOpenSlotModal, onOpen: onOpenSlotModal, onClose: onCloseSlotModal } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatTimestamp = (timestamp) => {
    return moment(timestamp * 1000).toDate();
  };
  
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsVisible(true);
  };


  const handleClosePopup = () => {
    setIsVisible(false);
  };

  const handleSelectSlot = ({ start, end }) => {

    setSelectedSlot({ start, end });
    onOpenSlotModal();
  };
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
  
    
  async function fetchAllEvents(displayCalendar) {
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
    const allUsersEvents = await contract.getAllEvents()
    const formattedEvents = allUsersEvents.map((event) => {
      return {
        eventId: event[0].toString(),
        title: event[1], // Event title
        organizer: event[3],
        metadataURI: event[7],
        start: formatTimestamp(event[4].toNumber()),
        end: formatTimestamp(event[5].toNumber()),

      }
    })

    return formattedEvents
  }


  useEffect(() => {
    const fetchEvents = async () => {
      const events = await fetchAllEvents(displayCalendar);
      setEvents(events);
    };
    fetchEvents();
  }, [ displayCalendar]);
  

  const EventWrapper = ({ event, children }) => {
    const imageSrc = event.metadataURI || '/telos.png'; // Provide a default image source if metadataURI is not available
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imageSrc} alt="Event" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
        {children}
      </div>
    );
  };
  

  return (
    <div style={{marginTop:'0px'}}>
    
    <Calendar
      localizer={localizer}
      defaultDate={new Date()}
      defaultView="month"
      events={events}
      style={{ height: '100vh' }}
      onSelectSlot={handleSelectSlot}
      onSelectEvent={handleSelectEvent}
      selectable
      eventPropGetter={(event) => {
        const backgroundColor = '#00f2ff';
        const color = 'black';
        const border = '1px solid #0700dd';
        return { style: { backgroundColor, color, border } };
      }}
      components={{
        eventWrapper: EventWrapper,
      }}
    />
    
       <Modal isOpen={isOpenSlotModal} onClose={onCloseSlotModal} size={'xs'}>
        <ModalOverlay />
        <ModalContent>
          
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <PublicEventForm
              selectedSlot={selectedSlot}
              reloadPage={reloadPage}

            />          </ModalBody>
        </ModalContent>
      </Modal>
      {/*
      <Modal isOpen={isOpenEventModal} onClose={onCloseEventModal} size={'xs'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
  {selectedEvent && (
    <>
    <Avatar size='xs' name={selectedEvent.title} src={selectedEvent.metadataURI} />{' '}

        <Text as='b' fontSize={'16px'} borderBottom='1px solid silver' >
          {selectedEvent.title}
        </Text>
        <Box>
        <p>Start Time: {selectedEvent.start.toString()}</p>
        <p>End Time: {selectedEvent.end.toString()}</p>
        <p><Image src={selectedEvent.metadataURI} />
        </p>
        </Box>
      
    </>
  )}
</ModalBody>

        </ModalContent>
      </Modal>
  */}
  <EventDisplayDrawer calendarAddress={displayCalendar}  selectedEvent={selectedEvent} isVisible={isVisible} onClose={handleClosePopup} />

    </div>
  );
}

export default DailyTelosMain;
