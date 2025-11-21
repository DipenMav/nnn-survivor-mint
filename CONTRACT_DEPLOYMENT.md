# NNN Survivor NFT Contract Deployment Guide

This document provides instructions for deploying the ERC-721 NFT contract for the NNN Survivor NFT project.

## Contract Specifications

- **Name**: NNN Survivor NFT
- **Symbol**: NNN
- **Chain**: Base (Chain ID: 8453)
- **Total Supply**: 69 NFTs
- **Mint Type**: Free (gas only)
- **Metadata**: IPFS or static hosting

## Contract Features

1. **ERC-721 Standard**: Full compliance with OpenZeppelin ERC-721
2. **Owner-only Minting**: Only contract owner can mint
3. **Supply Cap**: Maximum 69 tokens
4. **One per Wallet**: Each address can only receive one token
5. **Metadata**: Token URI points to metadata JSON

## Recommended Tools

### Option 1: Remix IDE (Easiest)
1. Go to https://remix.ethereum.org
2. Create new file `NNNSurvivorNFT.sol`
3. Paste the contract code (see below)
4. Compile with Solidity 0.8.20+
5. Deploy to Base using MetaMask
6. Set contract address in environment variables

### Option 2: Hardhat/Foundry
For more advanced deployment with scripts and verification.

## Sample Contract Code

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NNNSurvivorNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 69;
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    
    mapping(address => bool) public hasMinted;
    
    constructor(
        string memory baseTokenURI
    ) ERC721("NNN Survivor NFT", "NNN") Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }
    
    function mint(address to) public onlyOwner {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(!hasMinted[to], "Address already minted");
        
        uint256 tokenId = _tokenIdCounter + 1;
        _tokenIdCounter = tokenId;
        hasMinted[to] = true;
        
        _safeMint(to, tokenId);
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }
}
\`\`\`

## Metadata Structure

Create a JSON file for each token (1.json, 2.json, ..., 69.json):

\`\`\`json
{
  "name": "NNN Survivor NFT #1",
  "description": "No Nut November Survivor NFT. Only the disciplined survive. Limited edition of 69.",
  "image": "ipfs://YOUR_IMAGE_HASH_HERE",
  "attributes": [
    {
      "trait_type": "Challenge",
      "value": "No Nut November"
    },
    {
      "trait_type": "Strength",
      "value": "Unbreakable Discipline"
    },
    {
      "trait_type": "Edition",
      "value": "2025"
    },
    {
      "trait_type": "Token ID",
      "value": 1
    }
  ]
}
\`\`\`

## Deployment Steps

### 1. Upload NFT Image to IPFS
- Use Pinata, NFT.Storage, or similar service
- Get the IPFS hash (e.g., `ipfs://Qm...`)

### 2. Create and Upload Metadata
- Create 69 JSON files (1.json through 69.json)
- Upload to IPFS or host statically
- Get the base URI (e.g., `ipfs://Qm.../` or `https://yourdomain.com/metadata/`)

### 3. Deploy Contract
1. Connect to Base network in MetaMask
2. Deploy contract with base URI parameter
3. Save the contract address

### 4. Update Environment Variables
Add the contract address to your Supabase secrets or environment:
- `CONTRACT_ADDRESS`: The deployed contract address
- `PRIVATE_KEY`: Owner wallet private key for minting

### 5. Integrate with Backend
Update the mint edge function to call the contract:
- Use viem or ethers.js
- Call `mint(address)` function
- Wait for transaction confirmation
- Update database with transaction hash

## Base Network Details

- **Network Name**: Base
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Block Explorer**: https://basescan.org
- **Currency**: ETH

## Testing

Before mainnet deployment:
1. Deploy to Base Sepolia testnet first
2. Test minting flow
3. Verify metadata displays correctly
4. Check on OpenSea testnet

## Security Notes

- Store private keys securely (use Supabase secrets)
- Only owner can mint
- Implement rate limiting in API
- Validate all inputs
- Monitor contract events

## Verification

After deployment, verify the contract on BaseScan:
1. Go to https://basescan.org
2. Find your contract
3. Click "Verify and Publish"
4. Enter contract details
5. Makes contract readable on explorer

## Support

For deployment assistance:
- Base docs: https://docs.base.org
- OpenZeppelin docs: https://docs.openzeppelin.com
- Remix docs: https://remix-ide.readthedocs.io
