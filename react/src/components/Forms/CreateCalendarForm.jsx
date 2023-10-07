import { Card } from 'antd'
import { Button, HStack, VStack, Input } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import CalendarFactory from '../../contracts/CalendarFactory.json'
import { ethers } from 'ethers'
import { useToast } from '@chakra-ui/toast'
import { AppContext } from '../../AppContext'
import { Button as CarbonButton } from '@carbon/react'

const CreateCalendarForm = () => {
  const toast = useToast()
  const { account } = useContext(AppContext)
  const [inputName, setInputName] = useState('')
  const [current, setCurrent] = useState(0)
  const [deployLog, setDeployLog] = useState(null)

  const next = () => {
    setCurrent(current + 1)
  }

  const handleCalendarName = (name) => {
    setInputName(name)
  }

  const createCalendar = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contractAddress = CalendarFactory.address
      const contractABI = CalendarFactory.abi
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      const transaction = await contract.createCalendar(inputName)
      const tx = await transaction.wait(1)
      console.log(tx)
      const deployLogLink = `https://testnet.teloscan.io/tx/${transaction.hash}`
      setDeployLog(deployLogLink)
      console.log(deployLogLink)
      toast({
        title: 'Transaction Successful',
        description: 'The calendar was created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      if (deployLogLink) {
        next()
      }
    } catch (error) {
      console.error('Error creating calendar:', error)
          toast({
        title: 'Transaction Failed',
        description: 'An error occurred while creating the calendar.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
            createCalendar()
    }
  }

  const steps = [
    {
      title: 'Calendar Name',
      content: (
        <>
          <VStack>
            <HStack gap="auto">
              <Input
                size={'sm'}
                aria-label="Create"
                bg="white"
                onKeyDown={handleInputKeyPress}
                border="1px solid silver"
                placeholder="Enter a Name"
                value={inputName}
                onChange={(e) => handleCalendarName(e.target.value)}
              />

              <CarbonButton onKeyDown={handleInputKeyPress } style={{ width: '100px' }} size="sm" kind="danger" onClick={createCalendar}>
                Create
              </CarbonButton>
            </HStack>
          </VStack>
        </>
      ),
    },

    {
      title: 'Transaction Results',
      content: (
        <>
          <HStack>
            {deployLog && (
              <>
                <Button variant={'link'} size={'sm'} href={deployLog} target="_blank">
                  View Transaction
                </Button>
              </>
            )}
          </HStack>
        </>
      ),
    },
  ]

  return (
    <>
      <>
        <VStack bg="ghostwhite" border="1px solid silver">
          <div>
            <Card bodyStyle={{ padding: '0px', maxWidth: '360px' }} headStyle={{ fontSize: '12px' }}>
              <>{steps[current].content && <>{steps[current].content}</>}</>
            </Card>
          </div>
        </VStack>
      </>
    </>
  )
}

export default CreateCalendarForm
