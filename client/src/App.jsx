import React from 'react'
import {Toaster} from 'react-hot-toast';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Crops from './pages/Crops';
import MyFarm from './pages/MyFarm';
import Weather from './pages/Weather';
import Advisory from './pages/Advisory';
import Sakhi from './pages/Sakhi';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from './pages/Profile.jsx';
import FarmDetails from './pages/FarmDetails.jsx';
import Assistant from './components/Assistant.jsx';

const App = () => {
  return (
    <div className='relative overflow-hidden'>
      <Toaster></Toaster>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/crops' element={<Crops/>}></Route>
        <Route path='/myfarm' element={<MyFarm/>}></Route>
        <Route path='/weather' element={<Weather/>}></Route>
        <Route path='/advisory' element={<Advisory/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/farm-details' element={<FarmDetails/>}></Route>
        <Route path='/sakhi' element={<Sakhi/>}></Route>
      </Routes>
      <Assistant/>
      <Footer/>

    </div>
  )
}

export default App