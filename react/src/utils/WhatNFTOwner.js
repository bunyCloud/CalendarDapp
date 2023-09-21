import React, { useEffect, useContext, useState } from 'react'
import { ethers } from 'ethers'
import { Text } from '@chakra-ui/react'
import TheBUNY from '../contracts/TheBUNY.json'
import { AppContext } from '../AppContext'


const WhatNFTOwner = ({onIsOwner, onNftOwner, inputAddress, inputTokenId, inputChainId }) => {
  const { account } = useContext(AppContext)
  const [isOwner, setIsOwner] = useState(false)
  const [nftOwner, setNftOwner] = useState(null)


  let provider
  if (inputChainId === '1') {
    provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/7b0c9a81ffce485b81a8ae728b43e948')
  } else if (inputChainId === '43113') {
    provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
  } else if (inputChainId === '41') {
    provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
  } else if (inputChainId === '40') {
    provider = new ethers.providers.JsonRpcProvider('https://mainnet.telos.net/evm')
  }

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const contract = new ethers.Contract(inputAddress, TheBUNY.abi, provider)
        const nftOwner = await contract.ownerOf(inputTokenId)
        setNftOwner(nftOwner)
        onNftOwner(nftOwner)
        if (nftOwner !== account) {
          setIsOwner(true)
          onIsOwner(true)
          console.log('connected user is owner')
        }
      } catch (error) {
        console.error('Unable to fetch NFT data:', error)
      }
    }

    fetchNFTData()
  }, [inputAddress, account, provider, inputTokenId, onNftOwner, onIsOwner])

  

  return (
    
      <>
      {/*
      <Text noOfLines={1} overflow={'hidden'}  >
        {nftOwner && (<>{nftOwner}</>)}
      </Text>
      */}
      </>
    
  )
}

export default WhatNFTOwner
