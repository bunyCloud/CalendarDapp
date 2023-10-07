import React, { useState } from 'react';

import {  Box, Input, Button, Text, HStack } from '@chakra-ui/react';


const CreateTelosCalendar = ({onCalendarNameChange, next, createCalendar}) => {
    const [calendarName, setCalendarName] = useState('');
  

    const updateName = (calendarName) => {
        setCalendarName(calendarName);
        onCalendarNameChange(calendarName);
      }

      const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
          // Trigger the same logic as the button's click event when 'Enter' is pressed
          next();
          createCalendar()
        }
      };
    
   
  
  

    return (
        <Box p={2} bg='ghostwhite' >
        
          <HStack bg='ghostwhite' p={4}>
          <Input
          size={'sm'}
          bg='white'
          onKeyDown={handleInputKeyPress}
          border='1px solid silver'
            placeholder="Enter Calendar Name"
            value={calendarName}
            onChange={(e) => updateName(e.target.value)}
          />
          <Button colorScheme='twitter' size={'sm'} onClick={next}>
            Next
          </Button>
          </HStack>
      
        </Box>
      );
    };
     export default CreateTelosCalendar;