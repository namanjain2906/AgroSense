import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext.jsx';

const FarmDetails = () => {
  const { user, token } = useAppContext();
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
      toast.error('You must be logged in to add a farm.');
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
        toast.success('Farm details added successfully!');
        setForm({
          farmName: '',
          location: '',
          size: '',
          soilType: '',
          irrigationType: ''
        });
      } else {
        setMessage(data.error || 'Error adding farm details');
        toast.error(data.error || 'Error adding farm details');
      }
    } catch (err) {
      setMessage('Server error');
      toast.error('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center py-25 justify-center  p-6">
      <div className="rounded-2xl  p-8 max-w-md w-full flex flex-col gap-6 ">
        <h2 className="text-center  mb-4 font-bold text-2xl">Add Farm Details</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className=''>Farm Name</label>
          <input name="farmName" value={form.farmName} onChange={handleChange} placeholder="Farm Name" required className="p-3 rounded-lg border  text-base outline-none w-full transition" />
          <label className=''>Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required className="p-3 rounded-lg border  text-base outline-none w-full  transition" />
          <label className=''>Land size in acres</label>
          <input name="size" value={form.size} onChange={handleChange} placeholder="Size (acres)" type="number" required className="p-3 rounded-lg border  w-full  transition" />
          <label className=''>Soil Type</label>
          <select
            name="soilType"
            value={form.soilType}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border text-base w-full transition"
          >
            <option value="">Select Soil Type</option>
            <option value="Laterite soil">Laterite soil</option>
            <option value="Alluvial soil">Alluvial soil</option>
            <option value="Red soil">Red soil</option>
            <option value="Peat soil">Peat soil</option>
            <option value="Acid saline soil">Acid saline soil</option>
            <option value="Black cotton soil">Black cotton soil</option>
            <option value="Forest soil">Forest soil</option>
            <option value="Coastal alluvial soil">Coastal alluvial soil</option>
          </select>
          <label className=''>Irrigation Type</label>
          <select
            name="irrigationType"
            value={form.irrigationType}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border text-base w-full transition"
          >
            <option value="">Select Irrigation Type</option>
            <option value="Flood irrigation">Flood irrigation</option>
            <option value="Basin irrigation">Basin irrigation</option>
            <option value="Lift irrigation">Lift irrigation</option>
            <option value="Canal irrigation">Canal irrigation</option>
            <option value="Drip irrigation">Drip irrigation</option>
            <option value="Sprinkler irrigation">Sprinkler irrigation</option>
            <option value="Traditional systems">Traditional systems</option>
          </select>
          <button type="submit" className="text-white bg-green-600 rounded-lg py-3 font-semibold hover:bg-green-800  transition text-base border ">Add Farm</button>
        </form>
        {message && <p className={`text-center font-medium mt-2 ${message.includes('success') ? 'text-green-400' : 'text-green-300'}`}>{message}</p>}
      </div>
    </div>
  );

};

export default FarmDetails;