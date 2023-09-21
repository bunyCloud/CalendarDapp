import React, { useState } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, Button, IconButton, Text, Heading, Input, Center } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { UserOutlined } from '@ant-design/icons'
import { ethers } from 'ethers'

const AddEventDrawer = ({ contractAddress, contractABI }) => {
  
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [newOwner, setNewOwner] = useState('')

  const addOwner = async (newOwner) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      //const tx = await contract.addOwner(newOwner)
      await tx.wait()
      alert('Owner added successfully!')
    } catch (error) {
      console.error('Error adding owner:', error)
    }
  }

  return (
    <Box mt={2}>
      <Button
        variant={'outline'}
        color="purple"
        border='1px solid purple'
        leftIcon={<UserOutlined />}
        onClick={() => {
          setVisible1(true)
        }}>
        <HStack pr={2} gap="auto">
          <IconButton
            size={'xs'}
            variant={'unstyled'}
            colorScheme="purple"
            onClick={() => {
              setVisible1(true)
            }}
            aria-label="Action"
            icon={<AddIcon />}
          />

          <Text>Add Owner</Text>
        </HStack>
      </Button>
      <Popup
        position="right"
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false)
        }}
        bodyStyle={{ height: '100%', width: '300px' }}>
        <div style={{ padding: '14px', marginTop: '40px' }}>
          <Space direction="vertical">
            <div>Add Owner to Multi Signature Vault</div>
            <Button
              size="small"
              p={2}
              variant={'outline'}
              colorScheme="purple"
              onClick={() => {
                setVisible2(true)
              }}>
              Settings
            </Button>

            <Box mt={3} p={2} bg="InfoBackground" border="1px solid silver">
              <Heading size="md">Add Owner</Heading>
              <Text fontSize="sm">Add a new owner to the multi-sig wallet.</Text>
              <Input size="sm" mt={3} placeholder="Owner Address" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
              <Text fontSize="sm">Enter the address of the new owner.</Text>
              <Center>
                <Button colorScheme="messenger" w="100%" mt={2} onClick={() => addOwner(newOwner)}>
                  Add Owner
                </Button>
              </Center>
            </Box>
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
          <div>This is the second popup layer</div>
        </div>
      </Popup>
    </Box>
  )
}

export default AddEventDrawer
