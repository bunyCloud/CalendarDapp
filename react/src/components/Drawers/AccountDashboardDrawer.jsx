import React, { useState, useContext } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, IconButton, Text } from '@chakra-ui/react'
import { Avatar, useDisclosure } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'


const AccountDashboardDrawer = () => {
  const [visible1, setVisible1] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account,  rpcUrl, avatarImage, chainId, signature, accountAddress } = useContext(AppContext)

  return (
    <Box mt={-2}>
      <HStack p={1} borderRadius={'md'} border="0px solid purple" mt={0} color="purple" gap="auto">
        <IconButton
          size={'xs'}
          variant={'unstyled'}
          colorScheme="purple"
          onClick={() => {
            setVisible1(true)
          }}
          aria-label="Action"
          icon={<Avatar size={'sm'} src={avatarImage} border="2px solid white"  />}
        />

      </HStack>
  
                        
      <Popup
        position="right"
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false)
        }}
        bodyStyle={{ height: '100%', width: '300px' }}>
        <div style={{  marginTop: '60px' }}>
          <Space direction="vertical">
            



          
          </Space>
        </div>
        
      </Popup>
    </Box>
  )
}

export default AccountDashboardDrawer
