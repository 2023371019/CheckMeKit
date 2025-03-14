import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div
      className='flex flex-col items-center justify-center container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden'
      id='About'
    >
      <h1 className='text-2xl sm:text-4xl font-bold mb-2'>
        Sobre <span className='underline underline-offset-4 decoration-1 font-light'>CheckMe Kit</span>
      </h1>
      <p className='text-gray-500 max-w-80 text-center mb-8'>
        Innovación en monitoreo de salud, cuidado en cada latido.
      </p>
      <div className='flex flex-col md:flex-row items-center md:items-start md:gap-20'>
        <img src={assets.brand_img} alt="" className='w-full sm:w-1/2 max-w-lg' />
    
      <div className='flex flex-col items-center md:items-start mt-10 text-gray-600'>
        <div className='grid grid-cols-2 gap-6 md:gap-10 w-full 2xl:pr-28'>
            <div>
                <p className='text-4xl font-medium text-gray-800'>10+</p>
                <p>Años de innovación en salud</p>
            </div>
            <div>
                <p className='text-4xl font-medium text-gray-800'>12+</p>
                <p>Funciones avanzadas de monitoreo</p>
            </div>
            <div>
                <p className='text-4xl font-medium text-gray-800'>20+</p>
                <p>Países con usuarios de CheckMe Kit</p>
            </div>
            <div>
                <p className='text-4xl font-medium text-gray-800'>25+</p>
                <p>Miles de usuarios monitoreados</p>
            </div>
        </div>
        <p className='my-10 max-w-lg'>CheckMe Kit es un dispositivo innovador que permite 
            monitorear de forma remota la oxigenación y el ritmo cardiaco con precisión 
            médica. Su tecnología avanzada garantiza mediciones en tiempo real, brindando 
            tranquilidad y control sobre la salud en cualquier momento y lugar.</p>
            <button className='bg-blue-600 text-white px-8 py-2 rounded'>Leer más</button>
      </div>
    </div>
</div>
  );
};

export default About;
