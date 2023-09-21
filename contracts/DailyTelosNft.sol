// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DailyTelosNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to token image and name
    mapping(uint256 => string) private _tokenImage;
    mapping(uint256 => string) private _tokenName;

    constructor() ERC721("Daily Telos", "DT") {}

    function mint(string memory image, string memory name) external {
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenImage(newTokenId, image);
        _setTokenName(newTokenId, name);
    }

    function _setTokenImage(uint256 tokenId, string memory image) internal virtual {
        _tokenImage[tokenId] = image;
    }

    function _setTokenName(uint256 tokenId, string memory name) internal virtual {
        _tokenName[tokenId] = name;
    }

    function tokenImage(uint256 tokenId) public view returns (string memory) {
        return _tokenImage[tokenId];
    }

    function tokenName(uint256 tokenId) public view returns (string memory) {
        return _tokenName[tokenId];
    }
}
