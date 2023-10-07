import { Button, Center, HStack, Text } from '@chakra-ui/react'
import { useMetaMask } from '../../hooks/useMetamask'

export const HeaderConnect = () => {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask()

  return (
    <div>

          <Center>
            <HStack>
              <div>
                {!hasProvider && (
                  <a href="https://metamask.io" target="_blank" rel="noreferrer">
                    <Text fontSize={'10px'}>Install MetaMask</Text>
                  </a>
                )}
                  <Button w={'auto'} size={'sm'}  bg='transparent' color='white' border="1px solid white" disabled={isConnecting} onClick={connectMetaMask}>
                    Connect 
                  </Button>
                
          
              </div>
            </HStack>
          </Center>
   
    </div>
  )
}
