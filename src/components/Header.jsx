import React from 'react';
import Navbar from './Navbar';

const Header = () => {
  return (
    <div
      className='min-h-screen mb-4 bg-cover bg-center flex flex-col items-center justify-center w-full overflow-hidden relative'
      style={{ backgroundImage: "url('/header_img.png')" }}
      id='Header'
    >
      <div className='absolute inset-0 bg-black bg-opacity-50 z-0'></div> {/* Overlay oscuro para el contraste */}
      <Navbar />
      <div className='container text-center mx-auto py-10 px-6 md:px-20 lg:px-32 text-white z-10'>
        <h2 className='text-4xl sm:text-6xl md:text-[82px] font-bold max-w-4xl mx-auto leading-tight'>
          Monitorea tu oxigenación y ritmo cardiaco en tiempo real, estés donde estés
        </h2>
        <div className='flex justify-center mt-8 space-x-4'>
          
        </div>
      </div>
    </div>
  );
};

export default Header;
