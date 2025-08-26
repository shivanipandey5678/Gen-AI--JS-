import React from 'react'
import raglogo from '../../assets/raglogo.png';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"


const Navbar = () => {
  return (
    <div className='flex w-[100vw] px-10% p-5 justify-between md:px-4 px-px-2   items-center font-medium text-gray-600 sticky top-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md '>
      <img src={raglogo} alt="raglogo" className=' sm:w-[20%]   md:w-[17%] cursor-pointer  w-[30%]' />
      <ul className='md:flex  hidden w-[30%] justify-evenly '>
        <li className='cursor-pointer hover:text-gray-800 '>  <a href="#Features">Features</a></li>
        <li className='cursor-pointer hover:text-gray-800 '>     <a href="#about">About</a>
        </li>
        <li  className='cursor-pointer hover:text-gray-800 '>     <a href="#contact">Contact</a>
        </li>
      </ul>
      <ul className='flex flex-row md:w-[15%]  w-[40%] justify-evenly items-center'>
      
          <AnimatedThemeToggler className='cursor-pointer w-8 h-6'/>
       
        <li  className='cursor-pointer hover:text-gray-800 '>Signup</li>
        <li  className='cursor-pointer hover:text-gray-800 '>Login</li>
      </ul>

    </div>
  )
}

export default Navbar
