import React, { useState } from 'react'
import { ethers } from 'ethers'
import { Button, Divider, HStack, Text } from '@chakra-ui/react'
import {Button as AntButton} from 'antd'
import { formatAddress } from '../utils/formatMetamask'

const MetamaskSignature = ({ accountAddress, onSignedIn, onSignature, tokenContract, networkName,  tokenId }) => {
  const [address, setAddress] = useState(null)
  const [greeting, setGreeting] = useState(null)
  const [signature, setSignature] = useState(null)
  const [signedIn, setSignedIn] = useState(null)
 // ...
 const requestSignature = async () => {
  setSignedIn(false)
  if (typeof window.ethereum !== 'undefined') {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    const trimAddress = formatAddress(account)
    const customGreeting = `You have arrived! This wallet address ${trimAddress} has been confirmed to own and control this NFT ${tokenContract} | token id: ${tokenId} on the ${networkName} blockchain.`
    
    const message = {
      domain: {
        chainId: 41, // replace this with the actual chainId
        name: 'Buny Cloud Experimental Telos Dapp', // replace this with the name of your DApp
        verifyingContract: `${accountAddress}`, // replace this with the contract address that verifies the signature
        version: '1',
      },
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Greeting: [
          { name: 'greeting', type: 'string' },
        ],
      },
      primaryType: 'Greeting',
      message: {
        greeting: customGreeting,
      },
    }

    const params = [account, JSON.stringify(message)]
    const method = 'eth_signTypedData_v4'

    const signature = await window.ethereum.request({ method, params })

    // Recover signer address from the signature
    const recoveredAddress = '0x' + ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'bytes32'],
      [ethers.utils.id('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message.domain.name)),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message.domain.version)),
      message.domain.chainId,
      message.domain.verifyingContract,
      ethers.utils.id('Greeting(string greeting)'),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message.message.greeting))])).slice(26)

    setAddress(account)
    setGreeting(customGreeting)
    setSignature(signature)

    // Pass the signature back to the parent component
    if (onSignature) {
      onSignature(signature)
    }

    if (account.toLowerCase() === recoveredAddress.toLowerCase()) {
      alert('Success! Account confirmed.')
      setSignedIn(true)
      console.log('User successfully signed in')
      if (onSignedIn) {
        // Pass the account address back to the parent component
        onSignedIn(account)
      }
    } else {
      alert('Failed! The signer does not control the address.')
    }
  } else {
    alert('Please install MetaMask!')
  }
}
// ...

  return (
    <div>
      {!signedIn ? (
        <>
        <Button colorScheme='twitter' variant='outline' 
 onClick={requestSignature}>
            Sign in
          </Button>
        </>
      ) : (
        <>
          <AntButton block href="/" width="100%">
            Go to Account
          </AntButton>
          <Divider m={2} />
        </>
      )}
      {address && (
        <div>
          <HStack>
            <Text fontSize="12px" as="b">
              Wallet:
            </Text>
            <Text fontSize="12px">
              {address.slice(0, 12)}...{address.slice(-14)}
            </Text>
          </HStack>
          <HStack>
            <Text fontSize="12px" as="b">
              Account:
            </Text>
            <Text fontSize="12px">
              {accountAddress.slice(0, 12)}...{accountAddress.slice(-14)}
            </Text>
          </HStack>
          <HStack mt={2}>
            <Text fontSize="12px" as="b">
              Message:
            </Text>
            <Text noOfLines={8} fontSize="12px">
              {greeting}
            </Text>
          </HStack>
          <HStack mt={2}>
            <Text fontSize="12px" as="b">
              Signature:
            </Text>
            <Text noOfLines={8} fontSize="12px">
              {signature}
            </Text>
          </HStack>
        </div>
      )}
    </div>
  )
}

export default MetamaskSignature
