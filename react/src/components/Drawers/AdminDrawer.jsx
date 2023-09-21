import React, { useState } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, Button, IconButton, Text, Center, VStack } from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import AddUsers from '../Calendar/AddUsers'
import RevokeUser from '../Calendar/RevokeUser'
import GrantRole from '../Calendar/GrantRole'
import RemoveMember from '../Calendar/RemoveMember'


const AdminDrawer = () => {
  //main
  const [visible1, setVisible1] = useState(false)
  //users
  const [visible2, setVisible2] = useState(false)
  //grant role
  const [visible3, setVisible3] = useState(false)
  //Remove Member
  const [visible4, setVisible4] = useState(false)

  const handleVisible2 = (value) => {
    setVisible2(value)
  }

  const handleVisible3 = (value) => {
    setVisible3(value)
  }

  return (
    <Box mt={2}>
      <HStack p={1}  mt={0} color="purple" gap="auto">

        <Button
          variant={'link'}
          color="purple"
          size={'xs'}
          onClick={() => {
            setVisible1(true)
          }}>
          <Text>Admin</Text>
        </Button>
      </HStack>

      <Popup
        position="right"
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false)
        }}
        bodyStyle={{ height: '100%', width: '300px' }}>
        <div style={{ padding: '14px', marginTop: '40px' }}>
          <Space direction="vertical">
            <div>
            Administrator control panel for managing users, roles and events. 
            </div>
 <Center>
  <VStack>
  <Button
              size="small"
              p={2} w={150}
              mt={2}
              variant={'outline'}
              colorScheme='purple'
              onClick={() => {
                setVisible2(true)
              }}>
              Add/Remove Users
            </Button>
            <Button
              size="small"
              p={2}
              mt={2}
              w={150}
              variant={'outline'}
              colorScheme='purple'
              onClick={() => {
                setVisible3(true)
              }}>
              Modify Roles
            </Button>
            <Button
              size="small"
              p={2}
              mt={2}
              w={150}
              variant={'outline'}
              colorScheme='purple'
              onClick={() => {
                setVisible3(true)
              }}>
              Manage Event
            </Button>
  </VStack>
 </Center>
                    </Space>
          
        </div>
        
      </Popup>

      <Popup
        position="right"
        visible={visible2}
        onMaskClick={() => {
          setVisible2(false)
        }}
        bodyStyle={{ height: '100%' }}>
        <div style={{ padding: '24px', marginTop: '40px' }}>
          <AddUsers />
          <RemoveMember />
        </div>
      </Popup>
      <Popup
        position="right"
        visible={visible3}
        onMaskClick={() => {
          setVisible3(false)
        }}
        bodyStyle={{ height: '100%' }}>
        <div style={{ padding: '24px', marginTop: '40px' }}>
          <GrantRole />
        </div>
      </Popup>
      <Popup
        position="right"
        visible={visible4}
        onMaskClick={() => {
          setVisible4(false)
        }}
        bodyStyle={{ height: '100%' }}>
        <div style={{ padding: '24px', marginTop: '40px' }}>
          
        </div>
      </Popup>
    </Box>
  )
}

export default AdminDrawer
