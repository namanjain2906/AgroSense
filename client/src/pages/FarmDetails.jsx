
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const FarmDetails = () => {
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    farmName: '',
    location: '',
    size: '',
    soilType: '',
    irrigationType: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setMessage('You must be logged in to add a farm.');
      return;
    }
    try {
      const res = await fetch('https://agrosense-server.vercel.app/api/myfarm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, ownerId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Farm details added successfully!');
        setForm({
          farmName: '',
          location: '',
          size: '',
          soilType: '',
          irrigationType: ''
        });
      } else {
        setMessage(data.error || 'Error adding farm details');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101613] p-6">
      <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col gap-6 border border-green-900">
        <h2 className="text-center text-green-200 mb-4 font-bold text-2xl">Add Farm Details</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className='text-green-300'>Farm Name</label>
          <input name="farmName" value={form.farmName} onChange={handleChange} placeholder="Farm Name" required className="p-3 rounded-lg border border-green-800 text-base outline-none w-full bg-green-950 text-green-100 focus:border-green-400 transition" />
          <label className='text-green-300'>Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required className="p-3 rounded-lg border border-green-800 text-base outline-none w-full bg-green-950 text-green-100 focus:border-green-400 transition" />
          <label className='text-green-300'>Land size in acres</label>
          <input name="size" value={form.size} onChange={handleChange} placeholder="Size (acres)" type="number" required className="p-3 rounded-lg border border-green-800 text-base outline-none w-full bg-green-950 text-green-100 focus:border-green-400 transition" />
          <label className='text-green-300'>Soil Type</label>
          <input name="soilType" value={form.soilType} onChange={handleChange} placeholder="Soil Type" required className="p-3 rounded-lg border border-green-800 text-base outline-none w-full bg-green-950 text-green-100 focus:border-green-400 transition" />
          <label className='text-green-300'>Irrigation Type</label>
          <input name="irrigationType" value={form.irrigationType} onChange={handleChange} placeholder="Irrigation Type" required className="p-3 rounded-lg border border-green-800 text-base outline-none w-full bg-green-950 text-green-100 focus:border-green-400 transition" />
          <button type="submit" className="bg-gradient-to-tr from-green-800 to-green-700 text-green-50 rounded-lg py-3 font-semibold hover:bg-green-700 hover:text-green-200 transition text-base border border-green-900 shadow">Add Farm</button>
        </form>
        {message && <p className={`text-center font-medium mt-2 ${message.includes('success') ? 'text-green-400' : 'text-green-300'}`}>{message}</p>}
      </div>
    </div>
  );

};

export default FarmDetails;