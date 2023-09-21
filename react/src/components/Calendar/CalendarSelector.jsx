import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { HStack, Select, Text, Tooltip, Input, Button, IconButton, VStack, Box } from '@chakra-ui/react';
import FetchCalendarInfo from './FetchCalendarInfoDashboard';
import CalendarFactory from '../../contracts/CalendarFactory.json';
import { formatAddress } from '../../utils/formatMetamask';
import { AppContext } from '../../AppContext';
import { Drawer } from 'antd';


export default function CalendarSelector() {
  
  const {displayCalendar, setDisplayCalendar} = useContext(AppContext);
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm');
  const contract = new ethers.Contract(CalendarFactory.address, CalendarFactory.abi, provider);
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [calendars, setCalendars] = useState([]);
  const [open, setOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState(''); // State to hold the manually entered address

  const handleManualAddressChange = (e) => {
    setManualAddress(e.target.value);
    setDisplayCalendar(e.target.value);
    // You can set your selected calendar or perform other actions here
    // ...
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const containerStyle = {
    position: 'relative',
    height: 130,
    
   
  };
  

  const handleCalendarChange = (event) => {
    const selectedAddress = event.target.value;
    setSelectedCalendar(selectedAddress);
    setDisplayCalendar(selectedAddress);
    const selectedName = calendars.find((calendar) => calendar[1] === selectedAddress)?.[2] || '';
 //   onSelectCalendar(selectedAddress, selectedName); // Call the onSelectCalendar prop with the selected address and name
  };

  const handleAddressChange = (event) => {
    const selectedAddress = event.target.value;
    setDisplayCalendar(selectedAddress);
    console.log('calendar address changed')
    onClose()
    console.log('address drawer closed....')
  };



  const getCalendars = async () => {
    try {
      const calendarAddresses = await contract.getCalendarAddresses();
      console.log(calendarAddresses);
      const calendarsData = await Promise.all(
        calendarAddresses.map(async (address) => {
          return contract.getCalendar(address);
        })
      );

      setCalendars(calendarsData);
    } catch (error) {
      console.error('Error getting calendars:', error);
    }
  };

  useEffect(() => {
    getCalendars();
  }, []);

  return (
    <>
      <>
      <FetchCalendarInfo />
</>
     
     <div style={containerStyle}>
      
      <div
        style={{
          marginTop: 5,
          
        }}
      >
   
      </div>

     

      <Drawer
        //title="Load Calendar"
        placement="right"
                size='xs'
        closable={false}
        onClose={onClose}
        visible={open}  // Updated from "open" to "visible"
        getContainer={false}
      >
        <VStack>
        
      
        <Input
        size={'sm'}
        w={'auto'}
          placeholder="Manually enter address"
          value={manualAddress}
          onChange={(e) => setDisplayCalendar(e.target.value)}
        />
<HStack w='auto' gap='16px' mt={2} >
        <Button size={'sm'} variant={'outline'} onClick={onClose}>Close</Button>
      
        <Button size={'sm'} onClick={handleAddressChange}>Load</Button>
        </HStack>
     </VStack>
      </Drawer>
     <VStack   mt={2} p={1}>


    

        <Select
          placeholder="Change Calendar"
          variant="flushed"
          size={'sm'}
          p={2}
          border='1px solid silver'
          bg='white'
          value={selectedCalendar}
          onChange={handleCalendarChange}
        >
          {calendars.map((calendar) => (
            <option key={calendar[1]} value={calendar[1]}>
              <HStack  overflow={'hidden'}>
              <>
              <Text >
              {calendar[2]}
              </Text>
              </>

              <>
              {formatAddress(calendar[1])}
              </>
              </HStack>
            </option>
          ))}
        </Select>
        <Tooltip label="Load Calendar" aria-label='A tooltip'>
        <Button size={'xs'} type="primary" onClick={showDrawer} >
          Load Calendar
        </Button>
        </Tooltip>
        </VStack>
     
     
     </div>

    </>
  );
}