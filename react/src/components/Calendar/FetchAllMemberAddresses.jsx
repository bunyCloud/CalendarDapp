import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../AppContext';
import { ethers } from 'ethers';
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json';
import AddressList from '../../utils/AddressList'; // Make sure the path is correct if you've placed this in a different directory
import { formatAddress } from '../../utils/formatMetamask';

const FetchAllMemberAddresses = () => {
  const [memberArray, setMemberArray] = useState([]);
  const { displayCalendar } = useContext(AppContext);
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm');
  const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider);

  useEffect(() => {
    async function fetchAllMembers() {
      try {
        const members = await contract.getAllMemberAddresses();
        if (members.length === 0) {
          console.log("No members found.");
        }
        setMemberArray(members);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }

    fetchAllMembers();
  }, [contract]);

  return (
    <AddressList title="" addresses={memberArray} formatter={formatAddress} />
  );
};

export default FetchAllMemberAddresses;
