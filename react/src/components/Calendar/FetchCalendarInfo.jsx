import React, { useState, useEffect, useContext } from 'react';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import { ethers } from 'ethers';
import { AppContext } from '../../AppContext';

const FetchCalendarInfo = ({onDataFetch}) => {
  const { displayCalendar, calendarName, rpcUrl } = useContext(AppContext);
  const [adminCount, setAdminCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  //const [calendarName, setCalendarName] = useState(null);


 

  useEffect(() => {

    async function fetchStats() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
      const ac = await contract.adminCount()
      const gc = await contract.guestCount()
      const mc = await contract.memberCount()
      const te = await contract.totalEvents()
      // Update state variables
      setAdminCount(ac.toString())
      setGuestCount(gc.toString())
      setMemberCount(mc.toString())
      setTotalEvents(te.toString())
    }

    fetchStats()
  }, [displayCalendar])

  useEffect(() => {
    async function fetchStats() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)
      const te = await contract.totalEvents()
      setTotalEvents(te.toString())
    }
    fetchStats()
  }, [displayCalendar])

  useEffect(() => {
    if (onDataFetch) {
      onDataFetch({
        adminCount,
        guestCount,
        memberCount,
        totalEvents,
        calendarName
      });
    }
  }, [adminCount, guestCount, memberCount, totalEvents, calendarName, onDataFetch]);

  
    return (

    null
    );
  }
  
  export default FetchCalendarInfo;
  
