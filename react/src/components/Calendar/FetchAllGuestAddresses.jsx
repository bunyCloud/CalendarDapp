import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../AppContext';
import { ethers } from 'ethers';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import AddressList from '../../utils/AddressList'; // Ensure the path is correct based on your directory structure
import { formatAddress } from '../../utils/formatMetamask';

const FetchAllGuestAddresses = () => {
  const [guestArray, setGuestArray] = useState([]);
  const { displayCalendar } = useContext(AppContext);
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm');
  const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider);

  useEffect(() => {
    async function fetchAllGuests() {
      try {
        const guests = await contract.getAllGuestAddresses();
        if (guests.length === 0) {
          console.log("No guests found.");
        }
        setGuestArray(guests);
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    }

    fetchAllGuests();
  }, [contract]);

  return (
    <AddressList addresses={guestArray} formatter={formatAddress} />
  );
};

export default FetchAllGuestAddresses;
