/* eslint-disable @typescript-eslint/no-explicit-any */
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { createPXEClient, waitForPXE } from "@aztec/aztec.js";
import { Contract } from "@aztec/aztec.js";
import { readFileSync } from "fs";
import { AztecAddress } from "@aztec/aztec.js";
import { NebulaContractArtifact } from "@/contracts/src/artifacts/Nebula";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth";

const { PXE_URL = "http://localhost:8080" } = process.env;

// Utility function to hash an email
function hashEmail(email: string): bigint {
  const normalizedEmail = email.toLowerCase().trim();

  // Create a simple hash that converts to a Field-like representation
  let hash = 0n;
  for (let i = 0; i < normalizedEmail.length; i++) {
    // Use a simple polynomial rolling hash
    hash = (hash * 31n + BigInt(normalizedEmail.charCodeAt(i))) % 2n ** 256n;
  }

  return hash;
}

async function getNebulaContract(wallet: any) {
  const addresses = JSON.parse(readFileSync("addresses.json", "utf8"));
  const nebulaAddress = addresses.nebula;

  console.log("Using Nebula contract address:", nebulaAddress);

  return Contract.at(
    AztecAddress.fromString(nebulaAddress),
    NebulaContractArtifact,
    wallet
  );
}

// Register a user with email hash and address
async function registerUser(
  contract: Contract,
  userAddress: AztecAddress,
  userEmail: any
) {
  try {
    // Hash the email
    const emailHash = hashEmail(userEmail);

    // Check if user is already registered
    const isRegistered = await contract.methods
      .check_if_registered(userAddress)
      .simulate();

    if (isRegistered) {
      console.log(`User ${userAddress} is already registered`);
      return false;
    }

    console.log("email hash", emailHash);
    console.log("User address:", userAddress);
    console.log("isregistered", isRegistered);

    // Attempt to register the user
    await contract.methods
      .register_user_public(emailHash, userAddress)
      .send()
      .wait();

    // Verify registration
    const finalRegistrationStatus = await contract.methods
      .check_if_registered(userAddress)
      .simulate();
    console.log(`User registration status: ${finalRegistrationStatus}`);

    return finalRegistrationStatus;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
}

// Get user address by email hash
async function getUserAddressByEmail(contract: Contract, userEmail: any) {
  try {
    const emailHash = hashEmail(userEmail);
    const userAddress = await contract.methods
      .get_user_address(emailHash)
      .simulate();
    console.log(`User address for email ${userEmail}: ${userAddress}`);
    return userAddress;
  } catch (error) {
    console.error("Error getting user address:", error);
    return null;
  }
}

export async function getUserBalanceByEmail(contract: Contract, userEmail: any) {
  try {
    const emailHash = hashEmail(userEmail);
    const userAddress = await contract.methods
      .get_user_address(emailHash)
      .simulate();
    const balance = await contract.methods
      .balance_of_public(userAddress)
      .simulate();
    console.log(`User balance for address ${userAddress}: ${balance}`);
    return balance;
  } catch (error) {
    console.error("Error getting user balance:", error);
    return null;
  }
}

// Get user email by address
async function getUserEmailByAddress(
  contract: Contract,
  userAddress: AztecAddress
) {
  try {
    const emailHash = await contract.methods
      .get_user_email(userAddress)
      .simulate();
    console.log(`Email hash for address ${userAddress}: ${emailHash}`);
    return emailHash;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

// Mint tokens by email
async function mintTokensByEmail(
  contract: Contract,
  senderWallet: any,
  recipientEmail: any,
  amount: bigint
) {
  try {
    const emailHash = hashEmail(recipientEmail);

    // Mint tokens to the user identified by email hash
    await contract.methods.mint_by_email(emailHash, amount).send().wait();

    console.log(`Minted ${amount} tokens to user with email ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error("Error minting tokens by email:", error);
    return false;
  }
}

export async function fetchUserWalletAddress(email: string) {
  try {
    // For server-side execution, make a direct database query or API call
    // This depends on your specific application setup
    
    // If running in a Next.js API route or server component:
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/database/get-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch wallet address: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.wallet_address;
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    return null;
  }
}

async function main() {
  // Get the actual logged-in user's session
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user?.email) {
  //   console.error("No user session found or email not available");
  //   process.exit(1);
  //   return;
  // }
  
  const userEmail = 'amaechiisaac450@gmail.com';
  console.log(`Using logged in user email: ${userEmail}`);
  
  const walletAddress = await fetchUserWalletAddress(userEmail);

  if (walletAddress) {
    console.log("User Wallet Address:", walletAddress);

    // If you want to use the wallet address with Aztec
    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);

    const testAddress = AztecAddress.fromString(walletAddress);

    const { l1ChainId } = await pxe.getNodeInfo();
    console.log(`Connected to chain ${l1ChainId}`);

    // Get initial test accounts
    const [ownerWallet] = await getInitialTestAccountsWallets(pxe);

    const nebulaContract = await getNebulaContract(ownerWallet);

    // Register a user
    await registerUser(nebulaContract, testAddress, userEmail);

    // Get user address by email
    await getUserAddressByEmail(nebulaContract, userEmail);

    // Get user email by address
    await getUserEmailByAddress(nebulaContract, testAddress);

    // Mint public tokens by email
    await mintTokensByEmail(nebulaContract, ownerWallet, userEmail, 100n);

    // Show private balances
    await getUserBalanceByEmail(nebulaContract, userEmail);

  } else {
    console.log("No wallet address found for the user");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(`Error in main: ${err}`);
    console.error(err.stack);
    process.exit(1);
  });