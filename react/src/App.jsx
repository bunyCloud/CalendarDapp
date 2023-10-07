import React, { useState } from 'react'
import UIShell from './content/UIShell/UIShell'
import './App.scss'
import { ethers } from 'ethers'
import CalendarDailyTelos from './contracts/CalendarDailyTelos.json'
import { AppContext } from './AppContext'
import { useEffect } from 'react'

function App(){

  
    const [invitations, setInvitations] = useState([])
    const [invitationCount, setInvitationCount] = useState(0)
    const [isGuest, setGuestRole] = useState(null)
    const [isMember, setMemberRole] = useState(null)
    const [signature, setSignature] = useState(null)
    const [chainId, setChainId] = useState(null)
    const [account, setAccount] = useState('')
    const [userRole, setUserRole] = useState(null)
    const [displayCalendar, setDisplayCalendar] = useState(CalendarDailyTelos.address)
    const [logged, setLogged] = useState(false)
    const [calendarName, setCalendarName] = useState(null);
    const [rpcUrl,setRpcUrl] = useState('https://testnet15.telos.caleos.io/evm')

    useEffect(() => {
      async function fetchCalendarName() {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
        const name = await contract.calendarName()
        console.log(`Connecting to calendar ${name}`)
        setCalendarName(name)
      }
      fetchCalendarName()
    }, [displayCalendar])
 
  
    return (
      <div className="app">
        <AppContext.Provider
          value={{
            rpcUrl,
            setRpcUrl,
            logged,
            setLogged,
            account,
            setAccount,
            chainId,
            setChainId,
            userRole,
            setUserRole,
            isMember,
            setMemberRole,
            isGuest,
            setGuestRole,
            invitations,
            setInvitations,
            signature,
            setSignature,
            displayCalendar,
            setDisplayCalendar,
            calendarName,
            setCalendarName,
            invitationCount,
            setInvitationCount,
          }}>
          <UIShell />
          
        </AppContext.Provider>
      </div>
    )
  }


export default App
