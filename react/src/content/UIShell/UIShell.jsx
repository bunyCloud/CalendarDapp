import React from 'react'
import {
  HeaderContainer,
  Header,
  SkipToContent,
  HeaderMenuButton,
  HeaderNavigation,
  HeaderGlobalBar,
  SideNav,
  SideNavItems,
  Content,
  Theme,
  FormLabel,
  HeaderGlobalAction,
} from '@carbon/react'
import { Image } from '@chakra-ui/react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ErrorBoundary from '../../components/ErrorBoundary'
import LandingPage from '../LandingPage'
import NotFound from '../../components/NotFound'
import CalendarSelector from '../../components/Calendar/CalendarSelector'
import FetchCalendarInfoDashboard from '../../components/Calendar/FetchCalendarInfoDashboard'
import ConnectMetaMask from '../../components/Header/ConnectMetaMask'
import FetchAllEvents from '../../components/Calendar/FetchAllEvents'
import CreateCalendarForm from '../../components/Forms/CreateCalendarForm'
import { Notification } from '@carbon/icons-react'
import AccountDashboardDrawer from '../../components/Drawers/AccountDashboardDrawer'

class UIShell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: `/${window.location.pathname.split('/')[1] ?? ''}`,
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Theme theme="g90">
          <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
              <div>
                <Header aria-label="Daily Telos">
                  <SkipToContent />
                  <HeaderMenuButton aria-label="Open menu" onClick={onClickSideNavExpand} isActive={isSideNavExpanded} />
                  <Image src="/dailyTelos-logo.png" w="100px" h="auto" />
                  <HeaderNavigation aria-label="Daily Telos">
                            </HeaderNavigation>
                  <HeaderGlobalBar>
                    <HeaderGlobalAction aria-label="Search" tooltipAlignment="end">
                      <Notification size={20} />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="Search" tooltipAlignment="end">
                  <AccountDashboardDrawer />
                    </HeaderGlobalAction>
                    <ConnectMetaMask />
                  </HeaderGlobalBar>
                  <ErrorBoundary>
                    <SideNav style={{ marginTop: '-2px', borderTop: '1px solid silver' }} aria-label="Side navigation" expanded={isSideNavExpanded}>
                      <SideNavItems>
                        <FormLabel>Overview</FormLabel>
                        <>
                          <div
                            style={{
                              //marginBottom: '1px',
                              padding: '1px',
                            }}>
                            <FetchCalendarInfoDashboard />
                          </div>
                          <div
                            style={{
                              marginBottom: '1px',
                              padding: '0px',
                            }}>
                            <CalendarSelector />
                          </div>
                          <FormLabel>Upcoming Events</FormLabel>

                          <div
                            style={{
                              marginBottom: '1px',
                              padding: '1px',
                            }}>
                            <FetchAllEvents />
                          </div>
                        </>
                        <div
                          style={{
                            marginTop: '1px',
                            padding: '1px',
                          }}>
                          <FormLabel>Create a Community</FormLabel>

                          <CreateCalendarForm />
                        </div>
                      </SideNavItems>
                    </SideNav>
                  </ErrorBoundary>
                </Header>
              </div>
            )}
          />
        </Theme>
        <Content className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </BrowserRouter>
    )
  }
}

export default UIShell
