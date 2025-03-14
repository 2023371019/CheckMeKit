import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileMenu]);

  return (
    <div className='absolute top-0 left-0 w-full z-10'>
      <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent'>
        <img src={assets.logo} alt="Logo" className="w-20" />
        <ul className='hidden md:flex gap-7 text-white'>
          <a href="/" className='cursor-pointer hover:text-gray-400'>Inicio</a>
          <a href="#Nosotros" className='cursor-pointer hover:text-gray-400'>CheckMe Kit</a>
        </ul>
        <button onClick={() => navigate('/login')} className='hidden md:block bg-white px-8 py-2 rounded-full'>Sign up</button>
        <img
          src={assets.menu_icon}
          className='md:hidden w-7 cursor-pointer'
          alt="Menu Icon"
          onClick={() => setShowMobileMenu(true)}
        />
      </div>

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-full bg-white transition-transform ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex justify-end p-6'>
          <img
            src={assets.cross_icon}
            className='w-6 cursor-pointer'
            alt="Close Icon"
            onClick={() => setShowMobileMenu(false)}
          />
        </div>
        <ul className='flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium'>
          <a onClick={() => setShowMobileMenu(false)} href="/" className='px-4 py-2 rounded-full hover:bg-gray-200'>Inicio</a>
          <a onClick={() => setShowMobileMenu(false)} href="#Nosotros" className='px-4 py-2 rounded-full hover:bg-gray-200'>CheckMe Kit</a>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;