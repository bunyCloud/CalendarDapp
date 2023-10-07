import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { ethers } from 'ethers'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'
import EventDisplayDrawer from '../Drawers/EventDisplayDrawer'
import CreateEventForm from '../Forms/CreateEventForm'


const localizer = momentLocalizer(moment)


const DailyTelosMain = () => {
  const [events, setEvents] = useState([]);
  const { account,displayCalendar, rpcUrl, logged } = useContext(AppContext)
  const { isOpen: isOpenSlotModal, onOpen: onOpenSlotModal, onClose: onCloseSlotModal } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [isVisible, setIsVisible] = useState(false);

 
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    return date.toLocaleString('en-US', options)
  }

  
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
  
  
    
  async function fetchAllEvents(displayCalendar) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
    const allUsersEvents = await contract.getAllEvents()
    const formattedEvents = allUsersEvents.map((event) => {
      return {
        eventId: event[0].toString(),
        title: event[1], // Event title
        description: event[2],
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
    <div style={{marginTop:'-2px'}}>
    
    <Calendar
      localizer={localizer}
      defaultDate={new Date()}
      defaultView="month"
      events={events}
      style={{ height: '100vh', width:'100%' }}
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
  
       <Modal isOpen={isOpenSlotModal} onClose={onCloseSlotModal} size={'sm'}>
        <ModalOverlay />
        <ModalContent p={2}>
          
          
          <ModalCloseButton />
          <ModalBody>
       
       <CreateEventForm />
               </ModalBody>
        </ModalContent>
      </Modal>
  
  <EventDisplayDrawer calendarAddress={displayCalendar}  selectedEvent={selectedEvent} isVisible={isVisible} onClose={handleClosePopup} />

    </div>
  );
}

export default DailyTelosMain;
