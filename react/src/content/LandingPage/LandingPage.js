import React, { useContext, useState } from 'react'
import { Tabs, Tab, TabList, TabPanels, TabPanel, Grid, Column, Button } from '@carbon/react'
import DailyTelosMain from '../../components/Calendar/DailyTelosMain'
import { AppContext } from '../../AppContext'
import FetchCalendarInfo from '../../components/Calendar/FetchCalendarInfo'
import AdminDashboard from '../../components/Calendar/AdminDashboard'
import AddressGrid from '../../components/Calendar/AddressGrid'
import { Calendar } from '@carbon/icons-react'
import CreateEventModal from '../../components/Modals/CreateEventModal'

export default function LandingPage() {
  const { account, chainId, displayCalendar } = useContext(AppContext)

  const [calendarName, setCalendarName] = useState('')

  return (
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__r2">
        <Tabs defaultSelectedIndex={0}>
          <TabList >
            <Tab labelText='Calendar'>
              
                <Button hasIconOnly renderIcon={Calendar} kind='primary'>
                  
                </Button>
              
            </Tab>
            <Tab>Add Event</Tab>
            <Tab>Community</Tab>
            <Tab>Manage</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DailyTelosMain />
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column lg={16} md={8} sm={4} className="landing-page__tab-content">
                  Event scheduling form for the actively selected community.
                  <CreateEventModal />
                  
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column lg={16} md={8} sm={4} className="landing-page__tab-content" style={{padding:'8px', border:'1px solid ThreeDFace'}}>
                  Community information such as member details and guest access can be found on this page.
                  <div style={{ width: '100%' }}>
                    <FetchCalendarInfo />
                  </div>
                  <AddressGrid calendarName={calendarName} />
                </Column>
              </Grid>
            </TabPanel>

            <TabPanel>
              <Grid className="tabs-group-content">
                <Column lg={16} md={8} sm={4} className="landing-page__tab-content">
                  Administrator dashboard for adding or revoking user roles, deleting events and adding new members.
                  <AdminDashboard />
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
      </Column>
    </Grid>
  )
}
