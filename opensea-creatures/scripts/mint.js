require("dotenv").config();

const ethers = require('ethers')
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY.startsWith('0x')? process.env.PRIVATE_KEY: '0x' + process.env.PRIVATE_KEY;
const NETWORK = process.env.NETWORK
const NUM_CREATURES = 1


if (!PRIVATE_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a private key, owner, network, and contract address, see .env.sample")
    return
}

const NFT_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "mintTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

const FACTORY_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_optionId",
        "type": "uint256"
      },
      {
        "name": "_toAddress",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

async function main() {
    const provider = ethers.providers.getDefaultProvider(NETWORK);
    const wallet = new ethers.Wallet( PRIVATE_KEY, provider );

    if (NFT_CONTRACT_ADDRESS) {
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, wallet);
        // Creatures issued directly to the owner.
        for (var i = 0; i < NUM_CREATURES; i++) {
            const result = await nftContract.mintTo(OWNER_ADDRESS);
            console.log("Minted creature. Transaction: ", result.hash);
            await result.wait(); // wait for transaction to be mined
        }
    }
  }

main()