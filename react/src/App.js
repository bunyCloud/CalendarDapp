import './App.css'
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import { Layout } from 'antd'
import { Footer,  SafeArea } from 'antd-mobile'

import { AppContext } from './AppContext'
import { HeaderConnect } from './components/Header/HeaderConnect'
import AddressMenu from './components/Header/AddressMenu'
import NetworkSwitcherIconOnly from './components/Header/NetworkSwitcherIconOnly'
import { formatChainAsNum } from './utils/formatMetamask'
import MetaMaskOnboarding from '@metamask/onboarding'
import { useMetaMask } from './hooks/useMetamask'
import useSessionStorageState from 'use-session-storage-state'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { HStack, IconButton, Box, Image, Grid, GridItem, Center, Button, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Avatar,Link, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import CalendarDailyTelos from './contracts/CalendarDailyTelos.json'
import MainLayout from './components/Layout/MainLayout'


function App() {
  const [connectedNetwork, setConnectedNetwork] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [displayCalendar, setDisplayCalendar] = useState(CalendarDailyTelos.address)
  const [calendarBg, setCalendarBg] = useState('#fff')
  const [calendarFontColor, setCalendarFontColor] = useState('#000')
  const [invitations, setInvitations] = useState([])
  const [invitationCount, setInvitationCount] = useState(0)
  const [isGuest, setGuestRole] = useState(null)
  const [isMember, setMemberRole] = useState(null)
  const [signature, setSignature] = useState(null)
  const [tokenContract, setTokenContract] = useState(null)
  const [tokenId, setTokenId] = useState(null)
  const [avatarImage, setAvatarImage] = useState(null)
  const [accountName, setAccountName] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)
  const [avatarName, setAvatarName] = useState(null)
  const [signedIn, setSignedIn] = useState(null)
  const [nftOwner, setNftOwner] = useState('')
  const [nftSymbol, setNftSymbol] = useState(null)
  const [hasProvider, setHasProvider] = useState(null)
  const [logged, setLogged] = useState(false)
  const forwarderOrigin = 'http://localhost:3000'
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin })
  const { utils } = require('ethers')
  const [provider, setProvider] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleConnect = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!')
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((result) => {
        console.log(result)
        setLogged(true)
        const address = utils.getAddress(result[0])
        setAccount(address)
        const newProvider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(newProvider)
        handleBalance(address, newProvider)

        console.log('Could not detect Account')
      })
    } else {
      console.log('Need to install MetaMask')
      onboarding.startOnboarding()
    }
  }

  const handleDisconnect = () => {
    setLogged(false)
    setAccount(null)
  }

  const handleBalance = (address, provider) => {
    if (address && provider) {
      provider
        .getBalance(address)
        .then((balance) => {
          let formattedBalance = ethers.utils.formatEther(balance)
          setBalance(Number(formattedBalance).toFixed(3))
        })
        .catch((error) => {
          console.error('Error while fetching the balance:', error.message)
          console.error('Stack trace:', error.stack)

          // Check if the error is due to a revert with reason
          if (error.code === ethers.utils.Logger.errors.CALL_EXCEPTION) {
            const reason = error.data ? ethers.utils.toUtf8String(error.data) : ''
            console.log('Revert reason:', reason)
          }

          // You can add more specific error handling based on the error code or message if required.
        })
    }
  }

  useEffect(() => {
    if (provider && account) {
      provider.on('block', () => {
        handleBalance(account, provider)
      })
    }
    return () => {
      if (provider) {
        provider.removeAllListeners('block')
      }
    }
  }, [provider, account])

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      console.log(provider)
      setHasProvider(Boolean(provider))
      setLogged(true)
    }

    getProvider()
  }, [])

  const reloadPage = () => {
    window.location.reload()
  }

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return 'Ethereum'
      case 40:
        return 'Telos'
      case 41:
        return 'Telos Testnet'
      case 43114:
        return 'Avalanche'
      default:
        return 'Unknown Network'
    }
  }

  useEffect(() => {
    const networkName = getNetworkName(chainId)
    console.log(`Connected to: ${networkName}`)
    setConnectedNetwork(networkName)
  }, [chainId])

  // This function will be passed to the child component
  const updateAccountAddress = (address) => {
    setAccountAddress(address)
  }


  const updateDisplayCalendar = (address) => {
    setDisplayCalendar(address)
  }

  const handleNftDetails = (nftOwner, nftSymbol, avatarImage, avatarName) => {
    setNftOwner(nftOwner)
    setNftSymbol(nftSymbol)
    //setTotalSupply(totalSupply.toString())
    setAvatarImage(avatarImage)
    setAvatarName(avatarName)
  }

  const handleAvatarImageChange = (newAvatarImage) => {
    setAvatarImage(newAvatarImage)
  }

  const handleAvatarNameChange = (newAvatarName) => {
    setAvatarName(newAvatarName)
  }
  
  useEffect(() => {
    try {
      const checkConnection = async () => {
        if (!window.ethereum) {
          console.log('Please install MetaMask!')
          return
        }

        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setChainId(formatChainAsNum(chainId)) // Set the chainId state variable

        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const logged = accounts.length > 0
        setLogged(logged)

        if (logged) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const account = accounts[0]
          const balance = await provider.getBalance(account)
          const formattedBalance = ethers.utils.formatEther(balance)
          setAccount(account)
          setBalance(Number(formattedBalance).toFixed(2))
        }
      }

      checkConnection().catch((error) => {
        console.error('An error occurred while logged into MetaMask:', error.message)
        console.error('Stack trace:', error.stack)

        // Check if the error is due to a revert with reason
        if (error.code === ethers.utils.Logger.errors.CALL_EXCEPTION) {
          const reason = error.data ? ethers.utils.toUtf8String(error.data) : ''
          console.log('Revert reason:', reason)
        }
      })
    } catch (error) {
      console.error('An error occurred in useEffect:', error.message)
      console.error('Stack trace:', error.stack)
    }
  }, [])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount('')
          setBalance('')
        }
      })

      window.ethereum.on('chainChanged', async () => {
        if (account !== '') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const balance = await provider.getBalance(account)
          setBalance(Number(ethers.utils.formatEther(balance)).toFixed(2))
        }
      })
    }
  }, [account])

 
  const fetchInvitations = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
      const contract = new ethers.Contract(CalendarDailyTelos.address, CalendarDailyTelos.abi, provider)

      let invitationNumbers
      if (accountAddress) {
        const accountInvitations = await contract.getInvitations(accountAddress)
        invitationNumbers = [...accountInvitations]
      } else {
        invitationNumbers = await contract.getInvitations(account)
      }

      const invitationStrings = invitationNumbers.map((number) => number.toString())
      setInvitations(invitationStrings)
    } catch (error) {
      console.error('Failed to fetch invitations:', error)

      // Check if the error is due to a revert with reason
      if (error.code === ethers.utils.Logger.errors.CALL_EXCEPTION) {
        const reason = error.data ? ethers.utils.toUtf8String(error.data) : ''
        console.log('Revert reason:', reason)
      }
    }
  }

  return (
    <AppContext.Provider
    value={{
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
      accountAddress,
      setAccountAddress,
      invitations,
      setInvitations,
      signature,
      setSignature,
      displayCalendar,
      setDisplayCalendar,
      calendarBg,
      setCalendarBg,
      calendarFontColor,
      setCalendarFontColor,
      avatarImage,
      setAvatarImage,
      tokenContract,
      setTokenContract,
      tokenId,
      setTokenId,
      accountName,
      setAccountName,
      invitationCount,
      setInvitationCount,
    }}>
    <>
      <div style={{ background: '#c1cfd8' }}>
        <SafeArea position="top"  />
      </div>

      <Layout style={{ overflow: 'hidden' }}>
          <Box w="100%" borderTop="0px solid white" bg="#0700dd">
            <Grid borderBottom="4px solid silver" width="100%" templateColumns="repeat(4, 1fr)" gap={0} position={'fixed'} zIndex={'banner'} bg="#0700dd">
              <GridItem colSpan={2} >
                <Image ml={4} w={'60px'} h={'40px'} mt={0} mb={1} src="/dailyTelos.png" />
              </GridItem>

              <GridItem mr={4} colStart={4} colEnd={6} color='white' >
                <HStack gap={1} justify={'right'} mt={1}>
                  <NetworkSwitcherIconOnly />
                  <div>
                    {account ? (
                      <>
                            <AddressMenu handleDisconnect={handleDisconnect} balance={balance} />
                          </>
                        ) : (
                      <>
                        <HeaderConnect />
                      </>
                    )}

                  
                  </div>

                
                  {/* Primary Menu */}
                </HStack>
              </GridItem>
            </Grid>
          </Box>
              
               <Box mt={10} p={1}>
               <MainLayout
                  chainId={chainId}
                  connectedNetwork={connectedNetwork}
                  onAvatarImageChange={handleAvatarImageChange}
                  onAccountAddressChange={updateAccountAddress}
                  onAvatarNameChange={handleAvatarNameChange}
                  handleConnect={handleConnect}
                  reloadPage={reloadPage}
                  fetchInvitations={fetchInvitations}
                  onDisplayCalendar={updateDisplayCalendar}
                />
               </Box>
              
          
        

      
      </Layout>
      <div style={{ background: '#c1cfd8', borderTop:'1px solid silver' }}>
        <SafeArea position="bottom" />
        <Footer borderTop='1px solid silver' content='Copyright 2023 © Daily Telos Joint Venture. All Rights Reserved.'></Footer>
      </div>
    </>
  </AppContext.Provider>
  )
}

export default App
