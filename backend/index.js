import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Web3 from "web3";
import cors from "cors";

// Import the ABI JSON files (using the JSON module assertion)
import supplyChainABI from "./SupplyChainABI.json" assert { type: "json" };
import votingABI from "./VotingABI.json" assert { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());

// Load environment variables
const ETH_NODE_URL = process.env.ETH_NODE_URL || "http://localhost:8545";
const SUPPLY_CHAIN_ADDRESS = process.env.SUPPLY_CHAIN_ADDRESS || "0x...";
const VOTING_ADDRESS = process.env.VOTING_ADDRESS || "0x...";
const PORT = process.env.PORT || 3000;

// Connect to the Ethereum node (Ganache or another node)
const web3 = new Web3(ETH_NODE_URL);

// Initialize contracts with their deployed addresses and ABIs
const supplyChainContract = new web3.eth.Contract(supplyChainABI, SUPPLY_CHAIN_ADDRESS);
const votingContract = new web3.eth.Contract(votingABI, VOTING_ADDRESS);

// API endpoint to create a product in the supply chain contract
app.post("/createProduct", async (req, res) => {
  try {
    const { name, price } = req.body;
    const accounts = await web3.eth.getAccounts();
    await supplyChainContract.methods.createProduct(name, price).send({ from: accounts[0] });
    res.status(200).send("Product created successfully!");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product.");
  }
});

// API endpoint to cast a vote in the voting contract
app.post("/vote", async (req, res) => {
  try {
    const { candidateId } = req.body;
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
    res.status(200).send("Vote recorded successfully!");
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).send("Error voting.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});