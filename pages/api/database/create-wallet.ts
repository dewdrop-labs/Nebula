/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Helper function to create an Aztec wallet using CLI
export async function createAztecWallet(email: any) {
  // Create output directory if it doesn't exist
  const outputDir = path.join(process.cwd(), 'wallets');
  console.log(`Output directory path: ${outputDir}`);
  
  if (!fs.existsSync(outputDir)) {
    console.log('Creating output directory as it does not exist');
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Create a unique identifier based on email
  const userId = Buffer.from(email).toString('base64').replace(/[\/\+\=]/g, '');
  const walletDir = path.join(outputDir, userId);
  
  console.log(`Wallet directory path: ${walletDir}`);
  
  if (!fs.existsSync(walletDir)) {
    console.log('Creating wallet directory as it does not exist');
    fs.mkdirSync(walletDir, { recursive: true });
  }

  const alias = email;
  
  try {
    // Execute the Aztec wallet CLI command to create an account
    const command = `aztec-wallet create-account -a "${alias}" -payment method=fee_juice,feePayer=test0 --no-wait`;
    console.log(`Executing command: ${command}`);
    
    let stdout = '';
    let stderr = '';
    
    try {
      // Try the normal execution path
      console.log('Attempting normal execution path');
      const result = await execPromise(command, { timeout: 300000 });;
      stdout = result.stdout;
      stderr = result.stderr;
      console.log('Command executed successfully');
    } catch (execError: any) {
      // If execution fails but we still get output with account info, consider it successful
      console.log('Command execution failed with error', execError.message);
      
      if (execError.stdout && execError.stdout.includes('Account stored in database with aliases')) {
        console.log('CLI command failed but account was created successfully');
        stdout = execError.stdout;
        stderr = execError.stderr;
      } else {
        // If no account info was found, rethrow the error
        console.error('No account information found in output');
        throw execError;
      }
    }
    
    console.log('Command stdout:', stdout);
    
    // Parse the output to extract wallet address regardless of how we got here
    const addressMatch = stdout.match(/Address:\s+([0x0-9a-fA-F]+)/);
    const secretKeyMatch = stdout.match(/Secret key:\s+([0x0-9a-fA-F]+)/);
    const publicKeyMatch = stdout.match(/Public key:\s+([0x0-9a-fA-F]+)/);
    
    const walletAddress = addressMatch ? addressMatch[1] : null;
    const secretKey = secretKeyMatch ? secretKeyMatch[1] : null;
    const publicKey = publicKeyMatch ? publicKeyMatch[1] : null;
    
    console.log('Extracted wallet info:', { 
      walletAddress: walletAddress ? `${walletAddress.substring(0, 10)}...` : null,
      hasSecretKey: !!secretKey,
      hasPublicKey: !!publicKey
    });
    
    if (!walletAddress) {
      throw new Error('Failed to extract wallet address from CLI output');
    }
    
    // Store the wallet info in a dedicated file
    const walletInfo = {
      email,
      walletAddress,
      publicKey,
      secretKey, // In a production environment, don't store the secret key
      createdAt: new Date().toISOString()
    };
    
    const walletInfoPath = path.join(walletDir, 'wallet-info.json');
    console.log(`Writing wallet info to: ${walletInfoPath}`);
    
    try {
      fs.writeFileSync(
        walletInfoPath,
        JSON.stringify(walletInfo, null, 2)
      );
      console.log('Wallet info successfully written to file');
      
      // Verify that the file was created
      if (fs.existsSync(walletInfoPath)) {
        const fileStats = fs.statSync(walletInfoPath);
        console.log(`File created with size: ${fileStats.size} bytes`);
      } else {
        console.error('File not found after writing!');
      }
    } catch (writeError) {
      console.error('Error writing wallet info to file:', writeError);
      throw writeError;
    }
    
    return {
      walletAddress,
      publicKey,
      // In a production environment, don't return the secret key
      secretKey
    };
  } catch (error: any) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}