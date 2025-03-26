/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: '/dashboard'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to dashboard
      router.push(result?.url || '/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-[#3D46FF] bg-[url('/images/login-page-grid.png')] bg-cover bg-no-repeat flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="bg-gradient-to-b relative from-[rgba(36,42,153,0.71)] to-[rgba(12,14,51,0.71)]  p-12 md:w-2/5 flex flex-col items-center justify-center">
          <div className="text-white absolute top-4 left-4 text-2xl font-bold mb-8">Nebula</div>
          <Image src="/cat.svg" alt="Nebula Logo" width={128} height={128} className='w-48 h-48 ' />
        </div>

        <div className="py-12 px-12 md:px-24 md:w-3/5 bg-[#F2F2F2] text-black">
          <h2 className="text-3xl text-center mb-10">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white rounded-full focus:outline-none focus:border-blue-500 placeholder:text-[#302F2F]"
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white rounded-full focus:outline-none focus:border-blue-500 placeholder:text-[#302F2F]"
                placeholder="••••••••••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember Me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
            >
              {loading ? 'Logging in...' : 'Submit'}
            </button>

            <div className="text-center text-sm font-medium">
              New User?{' '}
              <Link href="/register" className="font-normal text-[#302F2F] underline">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;