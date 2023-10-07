import React, {  } from 'react'
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Tooltip } from '@chakra-ui/react'
import PublicEventForm from '../Forms/PublicEventForm'
import { Button } from '@carbon/react';
import {Add16} from '@carbon/icons'
import { Buffer } from 'buffer'
import 'react-datepicker/dist/react-datepicker.css'

const projectId = '2RMVb2CNm5bmXOtwFsrIyAXnNqx'
const projectSecret = 'b516ce6e2e07f1828d70cf50df87f859'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const CreateEventDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
     <Button
  kind="secondary" 
  renderIcon={Add16} 
  style={{ width: '100%', borderColor: 'blue' }} 
  onClick={onOpen}
    title="Create Calendar Event"
>
  Create Event
</Button>


      <Drawer isOpen={isOpen} onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="ghostwhite" mb={2} p={2} h={10} borderBottom="1px solid silver">
            Schedule Event
          </DrawerHeader>
          <DrawerBody overflowY={'hidden'}>
            <PublicEventForm onCloseDrawer={onClose} />
          </DrawerBody>

          <DrawerFooter bg="ghostwhite" borderTop="1px solid silver"></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default CreateEventDrawer
