import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const EventTable = ({ eventData }) => {
  return (
    <Table variant="striped" colorScheme="teal">
      <Thead>
        <Tr>
          <Th>Event ID</Th>
          <Th>Title</Th>
          <Th>Organizer</Th>
          <Th>Start Time</Th>
          <Th>End Time</Th>
          <Th>Metadata URI</Th>
          <Th>Timestamp</Th>
          <Th>Role</Th>
        </Tr>
      </Thead>
      <Tbody>
  {Array.isArray(eventData) && eventData.map((event, index) => (
    <Tr key={index}>
      <Td>{event.eventID.toString()}</Td>
      <Td>{event.title}</Td>
      <Td>{event.organizer}</Td>
      {/*
      <Td>{event.startTime}</Td>
      <Td>{event.endTime}</Td>
      <Td>{event.metadataURI}</Td>
      <Td>{event.timestamp}</Td>
      <Td>{event.role}</Td>
      */}
    </Tr>
  ))}
</Tbody>

    </Table>
  );
};

export default EventTable;
