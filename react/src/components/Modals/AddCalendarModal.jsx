import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import CreateCalendarForm from '../Forms/CreateCalendarForm';
import { Button } from '@carbon/react';

function AddCalendarModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  );

  // For simplicity, I'm only using OverlayOne in this example.
  const overlay = <OverlayOne />;

  return (
    <>
      {/* Here's the Carbon button. Adjust its props/styles as needed. */}
      <Button size="sm" kind='danger--ghost' onClick={onOpen} style={{ width: '100%' }}>
  Create Calendar
</Button>


<Modal size={'sm'} onClose={onClose} isOpen={isOpen} isCentered zIndex={9999}>
    <ModalContent>
        <ModalHeader>Create Calendar</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <CreateCalendarForm />
        </ModalBody>
    </ModalContent>
</Modal>

    </>
  )
}

export default AddCalendarModal;
