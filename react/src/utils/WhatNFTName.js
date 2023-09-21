import React, { useEffect, useContext, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { Box, Text } from '@chakra-ui/react'
import TheBUNY from '../contracts/TheBUNY.json'
import { AppContext } from '../AppContext'


const WhatNFTName = ({ inputAddress, inputTokenId, inputChainId }) => {
  const { account } = useContext(AppContext)
  const [nftName, setNFTName] = useState(null)

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
      let metadata = {}
      try {
        const contract = new ethers.Contract(inputAddress, TheBUNY.abi, provider)
        let tokenURI = await contract.tokenURI(inputTokenId)
        if (tokenURI.startsWith('ipfs://')) {
          const ipfsGatewayUrl = 'https://ipfs.io/ipfs/' // Replace with your preferred IPFS gateway URL
          const cid = tokenURI.replace('ipfs://', '')
          tokenURI = ipfsGatewayUrl + cid
        }
   
        const response = await axios.get(tokenURI)
        const { data } = response
        if (!data) {
          throw new Error('No metadata found at provided tokenURI.')
        }
        metadata = data
        let nftName = metadata.name
        setNFTName(nftName)
      } catch (error) {
        console.error('Unable to fetch NFT data:', error)
      }
    }

    fetchNFTData()
  }, [inputAddress, inputTokenId, inputChainId, account, provider])

  

  return (
    
      <>
      
      <Text  noOfLines={2} overflow={'hidden'}  >
        {nftName && (<>{nftName}</>)}
      </Text>
      </>
    
  )
}

export default WhatNFTName
