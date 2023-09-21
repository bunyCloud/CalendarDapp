import React from 'react'
import { AutoCenter, Popup } from 'antd-mobile'
import { Text, Box, Avatar, HStack, Wrap, WrapItem, Link } from '@chakra-ui/react'
import { Layout, Space } from 'antd';
import { formatAddress } from '../../utils/formatMetamask';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const { Header, Footer, Content } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 33,
  paddingInline: 50,
  lineHeight: '33px',
  backgroundColor: '#7dbcea',
};

const contentStyle = {
  textAlign: 'left',
  minHeight: 60,
  height: '100%',
  padding:'6px',
  //lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: '33px',
  backgroundColor: '#7dbcea',
};


const EventDisplayDrawer = ({calendarAddress,  selectedEvent, isVisible, onClose }) => {
  return (
    <>
      {isVisible && (
        <Popup  bodyStyle={{backgroundColor: '#7dbcea', height: 'auto', padding: '2px', overflow: 'hidden' }} visible={isVisible} onMaskClick={onClose}>
          <>
            <AutoCenter>
              <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
                <Layout>
                  <Header style={headerStyle}>
                    <AutoCenter>
                    <Wrap>
                    <WrapItem>
                    <HStack>
                      <Avatar size="xs" name={selectedEvent.title} src={selectedEvent.metadataURI} />{' '}
                      <Text as="b" fontSize={'16px'} borderBottom="1px solid silver">
                        {selectedEvent.title}
                      </Text>
                    </HStack>
                    </WrapItem>
                    
                    </Wrap>
                    </AutoCenter>
                  </Header>
                  <Content style={contentStyle}>
                    <>
                      {selectedEvent && (
                        <>
                          <Box w={'auto'} h='auto'>
                          <Text>Organizer: {selectedEvent.organizer}</Text>
                            <Text noOfLines={2}>Start: {selectedEvent.start.toString()}</Text>
                            <Text noOfLines={2}>Ends: {selectedEvent.end.toString()}</Text>
                            {/*
                  <Image w={'auto'} src={selectedEvent.metadataURI} />
    */}
                          </Box>
                        </>
                      )}
                    </>
                  </Content>
                  <Footer style={footerStyle}>
                  <Link href={`/event/${calendarAddress}/${selectedEvent.eventId}`} isExternal>
  View Event Page <ExternalLinkIcon mx='2px' />
</Link>

                  </Footer>
                </Layout>
              </Space>
            </AutoCenter>
          </>
        </Popup>
      )}
    </>
  )
}

export default EventDisplayDrawer
