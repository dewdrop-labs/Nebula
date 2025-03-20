'use client'
import React from 'react'
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className='font-[family-name:var(--font-monstserrat)] w-full h-24 flex items-center justify-between bg-white'>
        <p className='text-black font-bold text-[2.125rem]'>Nebula</p>

        <div className='flex space-x-4'>
        <button className='w-[9.4rem] h-[4.25rem] rounded-[2rem] flex justify-center items-center bg-transparent font-normal text-xl text-black' onClick={() => signIn("google")}>Sign in</button>
        {session ? (
          <button className='px-6 py-2 rounded-full flex justify-center items-center bg-[#3D46FF] font-normal text-[18px] text-white' onClick={() => signOut()}>{session.user?.name}</button>
      ) : (
        <button className='px-12 py-2 rounded-full flex justify-center items-center bg-[#3D46FF] font-normal text-[18px] text-white' onClick={() => signIn("google")}>Register</button>
       
      )}
        </div>
    </nav>
  )
}
