import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import BunyERC6551Registry from '../contracts/BunyERC6551Registry.json'
import { Text, Table, Thead, Tbody, Tr, Th, Td, HStack, Button, Link, Box } from '@chakra-ui/react'
import { AppContext } from '../AppContext'
import WhatNetworkName from './WhatNetworkName'
import { getExplorer, getExplorerName } from '../config/networks'
import { ExternalLinkIcon } from '@chakra-ui/icons'

function WhatIsBound({ isOwner, nftOwner, onIsActive }) {
  const [isActive, setIsActive] = useState(false)
  const { accountAddress, chainId } = useContext(AppContext)
  const [implementation, setImplementation] = useState('')
  const [tokenChainId, setTokenChainId] = useState('')
  const [tokenContractAddress, setTokenContractAddress] = useState('')
  const [tokenID, setTokenID] = useState('')
  const [salt, setSalt] = useState('')

  //explorer data

  const teloscanTestnetUrl = getExplorer(chainId.toString())

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setIsActive(false)
        const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
        const registryContract = new ethers.Contract(BunyERC6551Registry.address, BunyERC6551Registry.abi, provider)
        const accountDetails = await registryContract.getAccountDetails(accountAddress)

        console.log('Checking for existing token bound account')
        setImplementation(accountDetails[0])
        setTokenChainId(accountDetails[1].toString())
        setTokenContractAddress(accountDetails[2])

        const tokenIDBigNumber = ethers.BigNumber.from(accountDetails[3])
        setTokenID(tokenIDBigNumber.toString())

        if (tokenIDBigNumber.gte(1)) {
          setIsActive(true)
          onIsActive(true)
          console.log('Token Bound Account Found')
        }

        setSalt(accountDetails[4].toString())
      } catch (error) {
        console.error('Error checking account:', error)
      }
    }

    fetchAccountDetails(accountAddress)
  }, [accountAddress, onIsActive])

  return (
    <>
    
      <Table mt={2} variant="striped" size={'sm'}>
        <Thead></Thead>
        <Tbody bg="ghostwhite" fontSize={'small'}>
          <Tr>
            <Td>Is Owner?</Td>
            <Td>
              {isOwner && (
                <>
                  <HStack>
                    <Text> ({isOwner.toString()})</Text>
                    <Text>You own this NFT</Text>
                  </HStack>
                </>
              )}
            </Td>
          </Tr>
          <Tr>
            <Td>Token Bound?</Td>
            <Td>
              {isActive && (
                <>
                  <HStack>
                    <Text>Account found - </Text> <WhatNetworkName chainId={chainId} />
                    <Text> ({chainId})</Text>
                  </HStack>
                </>
              )}
            </Td>
          </Tr>
          <Tr>
            <Td>Account</Td>
            <Td>
              <Link href={`${teloscanTestnetUrl}/address/${accountAddress}`} isExternal>
                <HStack spacing="23px">
                  <Text>{accountAddress.toString()}</Text>
                  <ExternalLinkIcon mx="2px" />
                </HStack>
              </Link>
            </Td>
          </Tr>
          <Tr>
            <Td>Current Owner</Td>
            <Td>
              <Link href={`${teloscanTestnetUrl}/address/${nftOwner}`} isExternal>
                <HStack spacing="6px">
                  <Text>{nftOwner.toString()}</Text>
                  <ExternalLinkIcon mx="2px" />
                </HStack>
              </Link>
            </Td>
          </Tr>
          {isActive && (
            <>
              <Tr>
                <Td>Implementation</Td>
                <Td>
                  <Link href={`${teloscanTestnetUrl}/address/${implementation}`} isExternal>
                    <HStack spacing="6px">
                      <Text>{implementation}</Text>
                      <ExternalLinkIcon mx="2px" />
                    </HStack>
                  </Link>
                </Td>
              </Tr>
            </>
          )}
        </Tbody>
      </Table>
    </>
  )
}

export default WhatIsBound
