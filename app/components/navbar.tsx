import React from 'react'

export default function Navbar() {
  return (
    <nav className='font-[family-name:var(--font-monstserrat)] w-full h-24 flex items-center justify-between bg-white md:px-28 px-14 pt-4'>
        <p className='text-black font-bold text-[2.125rem]'>Nebula</p>

        <div className='flex space-x-8'>
            <button className='w-[9.4rem] h-[4.25rem] rounded-[2rem] flex justify-center items-center bg-transparent font-normal text-xl text-black'>Sign in</button>
            <button className='w-[9.4rem] h-[4.25rem] rounded-[2rem] flex justify-center items-center bg-[#3D46FF] font-normal text-xl text-white'>Register</button>
        </div>
    </nav>
  )
}
