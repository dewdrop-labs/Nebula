'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [mintAmount, setMintAmount] = useState<string>('100');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserWalletAddress(session.user.email);
    }
  }, [session]);

  const fetchUserWalletAddress = async (email: string) => {
    try {
      setStatusMessage('Fetching wallet address...');
      const response = await fetch('/api/database/get-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet address');
      }

      const data = await response.json();
      setUserWalletAddress(data?.wallet_address || null);
      setStatusMessage('Wallet address fetched successfully.');
    } catch (error) {
      console.error('Error fetching wallet address:', error);
      setStatusMessage('Error fetching wallet address.');
    }
  };

  const handleRegisterUser = async () => {
    if (!session?.user?.email || !userWalletAddress) return;
    
    try {
      setLoading({ ...loading, register: true });
      setStatusMessage('Registering user...');
      
      const result = await fetch('/api/aztec/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session.user.email,
          walletAddress: userWalletAddress 
        }),
      });
      
      const data = await result.json();
      setResults({ ...results, register: data });
      setStatusMessage(`Registration ${data.success ? 'successful' : 'failed'}.`);
    } catch (error) {
      console.error('Error registering user:', error);
      setResults({ ...results, register: { success: false, error: String(error) } });
      setStatusMessage('Error registering user.');
    } finally {
      setLoading({ ...loading, register: false });
    }
  };

  const handleGetAddressByEmail = async () => {
    if (!session?.user?.email) return;
    
    try {
      setLoading({ ...loading, getAddress: true });
      setStatusMessage('Getting address from email...');
      
      const result = await fetch('/api/aztec/get-address-by-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      });
      
      const data = await result.json();
      setResults({ ...results, getAddress: data });
      setStatusMessage('Address retrieved successfully.');
    } catch (error) {
      console.error('Error getting address by email:', error);
      setResults({ ...results, getAddress: { success: false, error: String(error) } });
      setStatusMessage('Error getting address.');
    } finally {
      setLoading({ ...loading, getAddress: false });
    }
  };

  const handleGetEmailByAddress = async () => {
    if (!userWalletAddress) return;
    
    try {
      setLoading({ ...loading, getEmail: true });
      setStatusMessage('Getting email from address...');
      
      const result = await fetch('/api/aztec/get-email-by-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: userWalletAddress }),
      });
      
      const data = await result.json();
      setResults({ ...results, getEmail: data });
      setStatusMessage('Email hash retrieved successfully.');
    } catch (error) {
      console.error('Error getting email by address:', error);
      setResults({ ...results, getEmail: { success: false, error: String(error) } });
      setStatusMessage('Error getting email hash.');
    } finally {
      setLoading({ ...loading, getEmail: false });
    }
  };

  const handleMintTokens = async () => {
    if (!session?.user?.email) return;
    
    try {
      setLoading({ ...loading, mint: true });
      setStatusMessage(`Minting ${mintAmount} tokens...`);
      
      const result = await fetch('/api/aztec/mint-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session.user.email,
          amount: BigInt(mintAmount).toString()
        }),
      });
      
      const data = await result.json();
      setResults({ ...results, mint: data });
      setStatusMessage(`Minting ${data.success ? 'successful' : 'failed'}.`);
    } catch (error) {
      console.error('Error minting tokens:', error);
      setResults({ ...results, mint: { success: false, error: String(error) } });
      setStatusMessage('Error minting tokens.');
    } finally {
      setLoading({ ...loading, mint: false });
    }
  };

  const handleGetBalance = async () => {
    if (!session?.user?.email) return;
  
    try {
      setLoading((prev) => ({ ...prev, balance: true }));
      setStatusMessage("Getting balance...");
  
      const response = await fetch("/api/aztec/get-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch balance");
      }
  
      setResults((prev) => ({ ...prev, balance: { success: true, balance: data.balance } }));
      setStatusMessage("Balance retrieved successfully.");
    } catch (error) {
      console.error("Error getting balance:", error);
      setResults((prev) => ({ ...prev, balance: { success: false, error: String(error) } }));
      setStatusMessage("Error getting balance.");
    } finally {
      setLoading((prev) => ({ ...prev, balance: false }));
    }
  };
  
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="flex justify-center items-center min-h-screen">Please sign in to access this page.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nebula User Dashboard</h1>
      
      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold">User Information</h2>
            <p className="text-gray-600">Your account details</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-1">Email:</p>
              <div className="font-medium">{session?.user?.email || 'Not available'}</div>
            </div>
            <div>
              <p className="font-semibold mb-1">Wallet Address:</p>
              <div className="font-medium overflow-ellipsis overflow-hidden">
                {userWalletAddress || 'Not available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Status</h2>
          </div>
          <div className="p-2 bg-gray-100 rounded min-h-10">
            {statusMessage || 'No active operations'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Register User</h2>
            <p className="text-gray-600">Register your wallet with your email</p>
          </div>
          <div>
            <button 
              onClick={handleRegisterUser} 
              disabled={loading.register || !userWalletAddress}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading.register ? 'Registering...' : 'Register User'}
            </button>
            {results.register && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(results.register, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Get Address by Email</h2>
            <p className="text-gray-600">Retrieve your address using your email</p>
          </div>
          <div>
            <button 
              onClick={handleGetAddressByEmail} 
              disabled={loading.getAddress}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading.getAddress ? 'Getting Address...' : 'Get Address'}
            </button>
            {results.getAddress && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(results.getAddress, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Get Email by Address</h2>
            <p className="text-gray-600">Retrieve email hash using your address</p>
          </div>
          <div>
            <button 
              onClick={handleGetEmailByAddress} 
              disabled={loading.getEmail || !userWalletAddress}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading.getEmail ? 'Getting Email Hash...' : 'Get Email Hash'}
            </button>
            {results.getEmail && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(results.getEmail, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Mint Tokens</h2>
            <p className="text-gray-600">Mint tokens to your account</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="amount" className="block mb-1 font-medium">Amount</label>
                <input
                  id="amount"
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  min="1"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleMintTokens} 
                  disabled={loading.mint}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {loading.mint ? 'Minting...' : 'Mint'}
                </button>
              </div>
            </div>
            {results.mint && (
              <div className="p-2 bg-gray-100 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(results.mint, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Get Balance</h2>
            <p className="text-gray-600">Check your token balance</p>
          </div>
          <div>
            <button 
              onClick={handleGetBalance} 
              disabled={loading.balance}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading.balance ? 'Getting Balance...' : 'Get Balance'}
            </button>
            {results.balance && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(results.balance, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}