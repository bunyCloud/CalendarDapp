import { Card, theme } from 'antd'
import {
  Button,
  Box,
  Text,
  HStack,
  Center,
  VStack,
  Input,
  IconButton,
  Grid,
  InputGroup,
  InputRightElement,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  GridItem,
  Wrap,
  WrapItem,
  Link,
} from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import CreateTelosCalendar from '../Calendar/CreateTelosCalendar'
import CalendarFactory from '../../contracts/CalendarFactory.json'
import { ethers } from 'ethers'
import { useToast } from '@chakra-ui/toast'
import WhatChainId from '../../utils/whatChainId'
import { formatAddress, formatChainAsNum } from '../../utils/formatMetamask'
import WhatNetworkName from '../../utils/WhatNetworkName'
import { NoticeBar } from 'antd-mobile'
import { WalletOutlined } from '@ant-design/icons'
import { AppContext } from '../../AppContext'

const CreateCalendarForm = () => {
  const toast = useToast()
  const { account } = useContext(AppContext)
  const [inputName, setInputName] = useState()
  const [inputAdmin, setInputAdmin] = useState()
  const [current, setCurrent] = useState(0)
  const [chainId, setChainId] = useState()

  const handleChainId = (chainId) => {
    setChainId(formatChainAsNum(chainId))
  }
  // Function to reset all state variables
  const handleReset = () => {
    setCurrent(null)
    setInputName(null)
    setInputAdmin(null)
  }

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  
  const reloadPage = () => {
    window.location.reload()
  }

  const handleCalendarName = (name) => {
    setInputName(name)
  }
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const [useAccount, setUseAccount] = useState(false)
  const handleUseAccount = () => setInputAdmin(account)

  const [deployLog, setDeployLog] = useState(null)
  const createCalendar = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contractAddress = CalendarFactory.address
      const contractABI = CalendarFactory.abi
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      const transaction = await contract.createTelosCalendar(inputName)
      const tx = await transaction.wait()
      // Set transaction explorer url
      console.log(tx)
      setDeployLog(`https://testnet.teloscan.io/tx/${transaction.hash}`)
      console.log(`https://testnet.teloscan.io/tx/${transaction.hash}`)
      // If the transaction succeeds, show a success toast
      toast({
        title: 'Transaction Successful',
        description: 'The calendar was created successfully.',
        status: 'success',
        duration: 5000, // Duration in milliseconds (5 seconds)
        isClosable: true,
      })

      next()
    } catch (error) {
      console.error('Error creating calendar:', error)
      // If the transaction fails, show an error toast
      toast({
        title: 'Transaction Failed',
        description: 'An error occurred while creating the calendar.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const isError = inputAdmin === ''

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Trigger the same logic as the button's click event when 'Enter' is pressed
      next()
    }
  }

  const steps = [
    {
      title: 'Calendar Name',
      content: <CreateTelosCalendar next={next} prev={prev} onCalendarNameChange={handleCalendarName} />,
    },
    {
      title: 'Administrator Address',
      content: (
        <Box p={2} bg="ghostwhite">
          <FormControl isRequired isInvalid={isError}>
            <VStack>
              <HStack w="100%">
                <InputGroup size="md">
                  <Input
                    size={'sm'}
                    onKeyDown={handleInputKeyPress}
                    bg="white"
                    border="1px solid silver"
                    placeholder="Input admin address"
                    value={inputAdmin}
                    onChange={(e) => setInputAdmin(e.target.value)}
                  />

                  <InputRightElement width="2.5rem" mt={-1}>
                    <IconButton
                      size={'sm'}
                      bg="transparent"
                      variant="unstyled"
                      colorScheme="twitter"
                      onClick={handleUseAccount}
                      aria-label="Use Connected Wallet"
                      icon={<WalletOutlined />}
                    />
                  </InputRightElement>
                </InputGroup>

                <Button colorScheme="twitter" size={'sm'} onClick={next}>
                  Next
                </Button>
              </HStack>
              {!isError ? (
                <FormHelperText>
                  <Text noOfLines={1}>Wallet address of calendar administrator.</Text>
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )}
            </VStack>
          </FormControl>
        </Box>
      ),
    },
    {
      title: 'Review & Deploy',
      content: (
        <Box w={'100%'} minWidth={'180px'} h={'auto'} bg="ghostwhite" p={2}>
          <Box p={2} bg="white" border="1px solid silver">
            <HStack p={1}>
              <Text as="b">Name:</Text>
              <Text p={1}>{inputName && <>{inputName}</>}</Text>
            </HStack>

            <HStack p={1}>
              <Text as="b">
                <>Admin:</>
              </Text>
              <Text noOfLines={3} w={'auto'}>
                {inputAdmin && <>{formatAddress(inputAdmin)}</>}
              </Text>
            </HStack>
            {inputAdmin && inputName && (
              <>
                <Button w="100%" onClick={createCalendar} colorScheme="twitter" mt={0} mb={2} size={'sm'}>
                  Deploy
                </Button>
              </>
            )}
          </Box>

          <NoticeBar
            wrap
            content={
              <HStack w="auto" gap="2px">
                <Wrap>
                  <WrapItem>
                    <Text noOfLines={2} fontSize={'12px'} overflow={'auto'}>
                      *Deploying Calnedar to
                    </Text>
                  </WrapItem>
                  <WrapItem fontSize={'12px'}>
                    <WhatChainId onChainId={handleChainId} />
                    <WhatNetworkName chainId={chainId} />
                  </WrapItem>
                </Wrap>
              </HStack>
            }
            color="alert"
          />
        </Box>
      ),
    },
    {
      title: 'Transaction Results',
      content: (
        <>
          <Text noOfLines={6} maxWidth={300}>
            {deployLog && (
              <>
              
              <Center>
              
              <VStack>
              <Text w='100%' p={2} bg='yellow.100'>Calendar succesfully deployed! </Text>
              <Link color='blue' href={deployLog} target='_blank'>
              Click to view transaction
              </Link>
              <Button variant={'ghost'} onClick={reloadPage} size={'sm'}>Reload Page</Button>
              
              </VStack>
              </Center>
              
              </>
            )}
          </Text>
        </>
      ),
    },
  ]

  const { token } = theme.useToken()

  const items = steps.map((item) => ({ key: item.title, title: item.title }))

  return (
    <>
      <>
        <VStack bg="ghostwhite" border="1px solid silver" mb={6}>
          <Text w="100%" textAlign="left" as="b" bg="white" p={2} borderBottom="1px solid silver">
            Create Calendar
          </Text>

          <div>
            <Card
              bodyStyle={{ padding: '0px', maxWidth: '360px' }}
              headStyle={{ fontSize: '12px' }}
              title={steps[current].title ? <>{steps[current].title}</> : <></>}>
              <>{steps[current].content && <>{steps[current].content}</>}</>
              <>
                <Center w={'auto'} p={1} borderTop="1px solid silver">
                  <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                    <GridItem colSpan={2} h="auto">
                      <Center>
                        {current > 0 && (
                          <Button size="xs" onClick={() => prev()}>
                            Previous
                          </Button>
                        )}
                      </Center>
                    </GridItem>
                    <GridItem>
                      <Center>
                        <Button ml={2} mr={2} size="xs" type="default" bg="#917e7a" color="white" onClick={handleReset}>
                          Reset
                        </Button>
                      </Center>
                    </GridItem>
                    <GridItem colStart={4} colEnd={6} h="auto">
                     
                    </GridItem>
                  </Grid>
                </Center>
              </>
            </Card>
          </div>
        </VStack>
      </>
    </>
  )
}

export default CreateCalendarForm
