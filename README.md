  # Calendar dApp
### Telos Blockchain

| Repo | README |
| ------ | ------ |
| ERC6551 | https://github.com/bunyCloud/ERC6551/README.md |
| Calendar | https://github.com/bunyCloud/Solidity-calendar/README.md |
| EIP| https://eips.ethereum.org/EIPS/eip-6551 |

## Concept
Solidity Smartcontracts create token bound nft accounts that allow the NFT owners to create on chain account wallets for managing date/time specific events, nft ticket events, erc20 deposits. 

*Working but in active development.

#### Deploy SmartContracts
Open hardhat folder.
add your wallet mnemonic to mnemonic.txt file
Open 'deploy' folder
Add contract name of contract you are deploying ie. TheBUNY
Add constructor arguments if required. ie. TheBUNY contract takes a marketplace address as deployment constructor. 

Type Commands
`yarn `
`yarn compile`
`yarn deploy`
`yarn verify-testnet`

1. Deploy the NFT token contract to use as an example 'TheBUNY.sol'.
2. Deploy token bound account implementation. 'BunyERC6551Account.sol'
3. Deploy token bound account factory contract 'BunyERC6551Registry.sol'.

### Frontend
dApp is designed using React.js, 

##### Dependencies
- ethers.js
- Chakra-ui
- Antd
- ipfs-http-client
- axios
- react-big-calendar
- -react-datepicker
-  react-router-dom

