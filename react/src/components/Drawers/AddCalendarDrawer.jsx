import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
} from '@chakra-ui/react';
import CreateCalendarForm from '../Forms/CreateCalendarForm';
import { Button } from '@carbon/react';

function AddCalendarDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Here's the Carbon button. Adjust its props/styles as needed. */}
      <Button size="sm" kind='danger--ghost' onClick={onOpen} style={{ width: '100%' }}>
        Create Calendar
      </Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} >
        <DrawerOverlay>
          <DrawerContent zIndex={99999999}>
            <DrawerHeader>Create Calendar</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <CreateCalendarForm />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default AddCalendarDrawer;
