import React, { useContext, useState } from 'react'
import { Popup, Space, Button } from 'antd-mobile'
import { IconButton, Tooltip } from '@chakra-ui/react'
import { AtSignIcon } from '@chakra-ui/icons'
import { AppContext } from '../../AppContext'
import FetchInvitations from '../Calendar/FetchInvitations'
import InvitationSwipe from '../Calendar/InvitationSwipe'

const InvitationsDrawer = ({ fetchInvitations }) => {
  const { account, logged } = useContext(AppContext)
  const [visible6, setVisible6] = useState(false)
  const [visibleCloseRight, setVisibleCloseRight] = useState(false)

  return (
    <>
      <Tooltip label="View Event Invitations" placement="top">
        <IconButton bg="transparent" color="black" size="md" onClick={() => setVisible6(true)} icon={<AtSignIcon />} />
      </Tooltip>
      <>
        <Popup bodyStyle={{ height: 'auto', padding: '2px', overflow: 'hidden' }} visible={visible6} onMaskClick={() => setVisible6(false)}>
          <InvitationSwipe account={account} logged={logged} fetchInvitations={fetchInvitations} />
        </Popup>
      </>
    </>
  )
}

export default InvitationsDrawer
