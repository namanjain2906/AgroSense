import React from 'react'
import HeroSection from '../components/HeroSection'
import Cards from '../components/Cards'
import CardContainer from '../components/CardContainer'

const Home = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <HeroSection />
      </div>
      <CardContainer />
    </div>
  )
}

export default Home