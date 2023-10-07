import React, { useContext } from 'react'
import { HStack, Center, Wrap, WrapItem } from '@chakra-ui/react'
import InvitationsDrawer from './InvitationsDrawer'
import FetchMembersDrawer from './FetchMembersDrawer'
import { AppContext } from '../../AppContext'
import AddCalendarDrawer from './AddCalendarDrawer'

const IconDashboard = ({ fetchInvitations }) => {
  const { account, logged, accountAddress } = useContext(AppContext)

  return (
    <Center>
      <HStack>
        <Wrap>
          <WrapItem>
            {/* CreateEventDrawer component */}
            <AddCalendarDrawer />
          </WrapItem>
          <WrapItem>
            {/* InvitationsDrawer component */}
            <InvitationsDrawer fetchInvitations={fetchInvitations} />
          </WrapItem>
          <WrapItem>
            {/* FetchMembersDrawer component */}
            <FetchMembersDrawer />
          </WrapItem>
          <WrapItem>{/* <SettingsDrawer */}</WrapItem>
        </Wrap>
      </HStack>
    </Center>
  )
}

export default IconDashboard
