import React, { useState } from 'react'
import { Popup, Space } from 'antd-mobile'
import { Box, HStack, Button, IconButton, Text, Tooltip } from '@chakra-ui/react'
import { AddIcon, CalendarIcon } from '@chakra-ui/icons'
import CreateCalendarForm from '../Forms/CreateCalendarForm'

const AddCalendarDrawer = () => {
  const [visible1, setVisible1] = useState(false)

  return (
    <Box>
      <Tooltip label="Create New Calendar" placement="top">
        <IconButton
          onClick={() => {
            setVisible1(true)
          }}
          bg="transparent"
          color="black"
          size="md"
          icon={<CalendarIcon />}
        />
      </Tooltip>

      <Popup
        position="right"
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false)
        }}
        bodyStyle={{ height: '100%', width: '300px' }}>
        <div style={{ padding: '14px', marginTop: '40px' }}>
          <Space direction="vertical">
            <CreateCalendarForm />
          </Space>
        </div>
        
      </Popup>
    </Box>
  )
}

export default AddCalendarDrawer
