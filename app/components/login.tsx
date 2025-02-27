"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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

            <Image src="/cat.svg" alt="Nebula Logo" width={128} height={128}  className='w-48 h-48 '/>
        </div>

        <div className="py-12 px-12 md:px-24 md:w-3/5 bg-[#F2F2F2] text-black">
          <h2 className="text-3xl text-center mb-10">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3  bg-white rounded-full focus:outline-none focus:border-blue-500 placeholder:text-[#302F2F]"
                placeholder="Wisdom95"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3  bg-white rounded-full focus:outline-none focus:border-blue-500 placeholder:text-[#302F2F]"
                placeholder="••••••••••••••••"
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
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              Submit
            </button>

            <div className="text-center text-sm font-medium">
              New User?{' '}
              <Link href="/sign-up" className="font-normal text-[#302F2F] underline">
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