import React from 'react'
import videoBanner from '../assets/Video Banner Stock Videos - Rural Farming Agriculture Nature.mp4';

const HeroSection = () => {
  return (
    <div className='w-full h-screen bg-black/80 flex flex-col items-center justify-center shadow-lg relative'>
      <video
        className="w-full h-full object-cover"
        src={videoBanner}
        autoPlay
        loop
        muted
      />
      {/* Dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 pointer-events-none flex justify-center items-center text-center">
      <div className='p-15 bg-white/20 backdrop-blur w-full '>

        <p className='text-5xl'>Your Personal Farming AI Assistant</p>
      </div>
      </div>
    </div>
  )
}

export default HeroSection