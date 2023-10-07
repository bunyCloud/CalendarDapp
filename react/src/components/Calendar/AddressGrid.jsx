import React from 'react';
import { Button } from '@carbon/react';
import { Grid, Container, Center, GridItem, Box, Text, Icon, HStack } from '@chakra-ui/react';
import FetchAddresses from '../../components/Calendar/FetchAddresses';
import { Globe, Application, PersonFavorite } from '@carbon/react/icons';
import FetchCalendarInfoVertical from './FetchCalendarInfoVertical';
import AddGuest from './AddGuest';

const AddressGrid = () => {
  const ADMIN_ROLE = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775';
  const MEMBER_ROLE = '0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636';
  const GUEST_ROLE = '0xb6a185f76b0ff8a0f9708ffce8e6b63ce2df58f28ad66179fb4e230e98d0a52f';

  return (
    <Center>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} width="100%" height="100%">
        <GridItem>
          <Box height="100%" width="150px" minWidth={'auto'} padding={4} borderWidth="1px" borderRadius="lg">
          
            <FetchCalendarInfoVertical />
            
          </Box>
        </GridItem>
        <GridItem>
          <Box height="100%" width="100%" padding={4} borderWidth="1px" borderRadius="lg">
            <HStack><Text fontSize="lg">Administrators</Text><Icon as={PersonFavorite} size="32px" /></HStack>
            <FetchAddresses role={ADMIN_ROLE} roleName={'Admin'} />
            
          </Box>
        </GridItem>
        <GridItem>
          <Box height="100%" width="100%" padding={4} borderWidth="1px" borderRadius="lg">
            <HStack><Text fontSize="lg">Members</Text><Icon as={Application} size="32px" /></HStack>
            <FetchAddresses role={MEMBER_ROLE} roleName={'Members'} />
            
          </Box>
        </GridItem>
        <GridItem>
          <Box height="100%" width="100%" padding={4} borderWidth="1px" borderRadius="lg">
            <HStack><Text fontSize="lg">Guests</Text><Icon as={Globe} size="32px" /></HStack>
<AddGuest />
            <FetchAddresses role={GUEST_ROLE} roleName={'Guest'} />
            
          </Box>
        </GridItem>
      </Grid>
    </Center>
  );
}

export default AddressGrid;
