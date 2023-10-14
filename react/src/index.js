import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.scss'
import App from './App'
import {
  injectedWallet,
  braveWallet,
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  trustWallet,
  uniswapWallet,
  phantomWallet,
} from '@rainbow-me/rainbowkit/wallets'
import '@rainbow-me/rainbowkit/styles.css'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { coreWallet } from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import reportWebVitals from './reportWebVitals'
import { publicProvider } from 'wagmi/providers/public'
import { ChakraProvider } from '@chakra-ui/react'

const projectId = '4f599aad1c07b506f0fb04428e96352b'

const dappName = 'Daily Telos'

const telosTestnet = {
  id: 41,
  name: 'Telos',
  network: 'telosTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Telos',
    symbol: 'TLOS',
  },
  rpcUrls: {
    default: { http: ['https://testnet15.telos.caleos.io/evm'] },
    public: { http: ['https://testnet.telos.net/evm'] },
  },
  blockExplorers: {
    default: {
      name: 'Teloscan (testnet)',
      url: 'https://testnet.teloscan.io/',
    },
  },
  iconUrls: ['https://static.crypto.com/token/icons/telos/color_icon.png'],

  testnet: true,
}

const CustomAvatar = ({ address, ensImage, size }) => {
  // Define the generateColorFromAddress function here
  return ensImage ? (
    <img
      src={ensImage} // Use the provided ensImage if available
      alt={`Avatar for ${address}`}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }} // Use '50%' to make the image round
    />
  ) : (
    <img
      src="/calendar.png" // Set the path to your static image in the public folder
      alt={`Avatar for ${address}`}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }} // Use '50%' to make the image round
    />
  )
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [telosTestnet, ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [telosTestnet] : [])],
  [publicProvider()],
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      coreWallet({ projectId, chains }),
      braveWallet({ chains }),
      coinbaseWallet({ dappName, chains }),
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      uniswapWallet({ projectId, chains }),
      phantomWallet({ chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const client = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider coolMode avatar={CustomAvatar} showRecentTransactions={true} chains={chains}>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
