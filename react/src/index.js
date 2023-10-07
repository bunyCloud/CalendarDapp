import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { ChakraProvider } from '@chakra-ui/react'

const client = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          logging: {
            developerMode: false,
          },
                    getUniversalLink: true,
          checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
          dappMetadata: {
            name: 'Daily Telos',
            url: 'https://dailytelos.netlify.app',
          },
        }}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </MetaMaskProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
