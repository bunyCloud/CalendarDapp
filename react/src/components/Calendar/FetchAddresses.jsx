import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext'
import { ethers } from 'ethers'
import CalendarDailyTelos from '../../contracts/CalendarDailyTelos.json'
import AddressList from '../../utils/AddressList'
import { formatAddress } from '../../utils/formatMetamask'

const FetchAddresses = ({ role, roleName }) => {
  const [addressArray, setAddressArray] = useState([])
  const { displayCalendar, rpcUrl } = useContext(AppContext)

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, provider)

        const addresses = await contract.getAddressesByRole(role) // Updated to call the correct function
        if (addresses.length === 0) {
          console.log(`No ${roleName} addresses found.`)
        }
        setAddressArray(addresses)
      } catch (error) {
        console.error('Error fetching addresses:', error)
      }
    }

    fetchAddresses()
  }, [role, displayCalendar])

  return (
    <>
      <AddressList title="" addresses={addressArray} formatter={formatAddress} />
    </>
  )
}

export default FetchAddresses
