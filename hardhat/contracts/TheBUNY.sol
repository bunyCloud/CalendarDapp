//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TheBUNY is ERC721, Ownable {
  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private supply;
  uint256 public cost = 0 ether;
  uint256 public maxSupply = 1127235;
  uint256 public maxMintAmountPerTx = 3;
  string public baseURI = 'https://ipfs.io/ipfs/QmPif7uYfrKC9QhxPQmPbKzfZWAjpyAbBWQEGm8Y9cMzzT/';
  address public marketplaceAddress;
  bool public paused = false;

  constructor() ERC721('The BUNY Project Telos NFT Proxy Account', 'IBUNY') {
  }

  mapping(bytes32 => bool) public forSale;
  mapping(bytes32 => uint256) public uriToTokenId;

  modifier mintCompliance(uint256 _mintAmount) {
    require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, 'Nope Nope! Max mint per transaction is 3');
    require(supply.current() + _mintAmount <= maxSupply, 'Max supply is 5 per wallet');
    _;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), 'ERC721AMetadata: URI query for nonexistant token');

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0 ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), '.json')) : '';
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function totalSupply() public view returns (uint256) {
    return supply.current();
  }

  function mint(uint256 _mintAmount) public payable mintCompliance(_mintAmount) {
    require(!paused, "I'm in time out!");
    require(msg.value >= cost * _mintAmount, 'I pity the fool!');

    _mintLoop(msg.sender, _mintAmount);
  }

  function mintToAddress(uint256 _mintAmount, address _receiver) public payable mintCompliance(_mintAmount) {
    require(!paused, "I'm in time out!");
    require(msg.value >= cost * _mintAmount, 'I pity the fool!');
    _mintLoop(_receiver, _mintAmount);
  }

  function mintForAddress(uint256 _mintAmount, address _receiver) public mintCompliance(_mintAmount) onlyOwner {
    _mintLoop(_receiver, _mintAmount);
  }

  function tokensOfOwner(address _owner) public view returns (uint256[] memory) {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
    uint256 currentTokenId = 1;
    uint256 ownedTokenIndex = 0;

    while (ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply) {
      address currentTokenOwner = ownerOf(currentTokenId);

      if (currentTokenOwner == _owner) {
        ownedTokenIds[ownedTokenIndex] = currentTokenId;

        ownedTokenIndex++;
      }

      currentTokenId++;
    }

    return ownedTokenIds;
  }

  function setCost(uint256 _cost) public onlyOwner {
    cost = _cost;
  }

  function setPaused(bool _state) public onlyOwner {
    paused = _state;
  }

  function withdraw() public onlyOwner {
    // 20% tax to the king
    // =============================================================================
    (bool hs, ) = payable(0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964).call{ value: (address(this).balance * 100) / 100 }('');
    require(hs);
    // =============================================================================
  }

  function _mintLoop(address _receiver, uint256 _mintAmount) internal {
    for (uint256 i = 0; i < _mintAmount; i++) {
      supply.increment();
      _safeMint(_receiver, supply.current());
    }
  }
}
