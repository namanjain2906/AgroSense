import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaLeaf, FaHistory, FaPlus, FaTractor, FaSeedling } from "react-icons/fa";

const tabs = [
  { label: "Farm Details", icon: <FaTractor /> },
  { label: "Current Crop", icon: <FaLeaf /> },
  { label: "Crop History", icon: <FaHistory /> },
  { label: "Add Crop", icon: <FaPlus /> },
];

const MyFarm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { token } = useContext(AuthContext);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCrops, setCurrentCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(false);
  const [cropsError, setCropsError] = useState(null);
  const [historyCrops, setHistoryCrops] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  // Fetch current crops for the logged-in user
  useEffect(() => {
    const fetchCrops = async () => {
      setCropsLoading(true);
      setCropsError(null);
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const res = await axios.get('https://agrosense-server.vercel.app/api/crops/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const crops = res.data.crops || [];
        const today = dayjs();
        // Current crops: growing (today between sowingDate and harvestDate)
        const currentFiltered = crops.filter(crop => {
          const sowing = crop.sowingDate ? dayjs(crop.sowingDate) : null;
          const harvest = crop.harvestDate ? dayjs(crop.harvestDate) : null;
          return sowing && harvest && today.isAfter(sowing) && today.isBefore(harvest);
        });
        setCurrentCrops(currentFiltered);
        // History crops: harvested (today after harvestDate)
        const historyFiltered = crops.filter(crop => {
          const harvest = crop.harvestDate ? dayjs(crop.harvestDate) : null;
          return harvest && today.isAfter(harvest);
        });
        setHistoryCrops(historyFiltered);
      } catch (err) {
        setCropsError(err.response?.data?.error || err.message);
        setHistoryError(err.response?.data?.error || err.message);
      }
      setCropsLoading(false);
      setHistoryLoading(false);
    };
    if (token) fetchCrops();
  }, [token]);

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://agrosense-server.vercel.app/api/myfarm/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarm(res.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
      setLoading(false);
    };
    if (token) fetchFarm();
  }, [token]);

  return (
    <div className="min-h-screen pt-25 bg-[#0a0a0b] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#101613] text-[#b6e3b6] flex flex-col md:flex-col items-center py-0 md:py-8 border-b md:border-b-0 md:border-r border-[#1a2a1a]">
        <div className="flex md:hidden w-full items-center justify-between px-2 py-2 bg-[#101613] border-b border-[#1a2a1a]">
          <nav className="flex gap-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors duration-200 text-center whitespace-nowrap overflow-hidden text-ellipsis ${
                  activeTab === idx
                    ? "bg-gradient-to-tr from-[#1a2a1a] to-[#14532d] text-[#b6e3b6] shadow-lg"
                    : "hover:bg-[#1a2a1a] text-[#b6e3b6]"
                }`}
                onClick={() => setActiveTab(idx)}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        {/* Desktop: vertical sidebar */}
        <div className="hidden md:flex flex-col items-center w-full">
          <nav className="flex flex-col w-full gap-0">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                className={`w-full flex items-center px-6 py-3 my-2 rounded-lg transition-colors duration-200 text-left whitespace-nowrap overflow-hidden text-ellipsis ${
                  activeTab === idx
                    ? "bg-gradient-to-tr from-[#1a2a1a] to-[#14532d] text-[#b6e3b6] shadow-lg"
                    : "hover:bg-[#1a2a1a] text-[#b6e3b6]"
                }`}
                onClick={() => setActiveTab(idx)}
              >
                <span className="mr-3 text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-md md:max-w-3xl">
          {activeTab === 0 && (
            <div className="bg-green-950 rounded-xl p-4 md:p-8 shadow-lg text-green-300">
              <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 flex items-center">
                <FaTractor className="mr-1 md:mr-2" />
                Farm Details
              </h2>
              {loading && <div className="text-base text-center">Loading...</div>}
              {error && <div className="text-green-400 text-center">{error}</div>}
              {farm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-green-900 rounded-xl p-4 shadow">
                    <div className="font-semibold text-green-300 mb-2">Farm Name</div>
                    <div className="text-lg">{farm.farmName}</div>
                  </div>
                  <div className="bg-green-900 rounded-xl p-4 shadow">
                    <div className="font-semibold text-green-300 mb-2">Location</div>
                    <div className="text-lg">{farm.location}</div>
                  </div>
                  <div className="bg-green-900 rounded-xl p-4 shadow">
                    <div className="font-semibold text-green-300 mb-2">Size (acres)</div>
                    <div className="text-lg">{farm.size}</div>
                  </div>
                  <div className="bg-green-900 rounded-xl p-4 shadow">
                    <div className="font-semibold text-green-300 mb-2">Soil Type</div>
                    <div className="text-lg">{farm.soilType}</div>
                  </div>
                  <div className="bg-green-900 rounded-xl p-4 shadow">
                    <div className="font-semibold text-green-300 mb-2">Irrigation Type</div>
                    <div className="text-lg">{farm.irrigationType}</div>
                  </div>
                </div>
              )}
              {!loading && !farm && !error && (
                <div className="text-center text-green-400">No farm data found for this user.</div>
              )}
            </div>
          )}
          {activeTab === 1 && (
            <div className="bg-green-950 rounded-xl p-4 md:p-8 shadow-lg text-green-300">
              <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center">
                <FaLeaf className="mr-2" />
                Current Crop(s)
              </h2>
              {cropsLoading && <div className="text-base text-center">Loading...</div>}
              {cropsError && <div className="text-green-400 text-center">{cropsError}</div>}
              {!cropsLoading && currentCrops.length === 0 && !cropsError && (
                <div className="text-center text-green-400">No current crops found.</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {currentCrops.map((crop) => (
                  <div key={crop._id} className="bg-gradient-to-br from-green-900 via-green-800 to-green-950 rounded-2xl p-6 shadow-xl text-green-100 border border-green-900 relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${crop.status === 'Growing' ? 'bg-green-700 text-green-100' : crop.status === 'Planted' ? 'bg-lime-700 text-lime-100' : 'bg-green-900 text-green-100'}`}>{crop.status}</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-200 font-bold shadow">ID: {crop._id.slice(-5)}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <FaSeedling className="text-2xl text-green-400 drop-shadow" />
                      <div className="font-extrabold text-green-200 text-xl tracking-wide">{crop.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                      <div><span className="font-semibold text-green-300">Type:</span> <span className="text-green-100">{crop.type}</span></div>
                      <div><span className="font-semibold text-green-300">Season:</span> <span className="text-green-100">{crop.season}</span></div>
                      <div><span className="font-semibold text-green-300">Duration:</span> <span className="text-green-100">{crop.duration} days</span></div>
                      <div><span className="font-semibold text-green-300">Soil Type:</span> <span className="text-green-100">{crop.soilType}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div><span className="font-semibold text-green-300">Last Watered:</span> <span className="text-green-100">{crop.lastWatered ? dayjs(crop.lastWatered).format('DD/MM/YYYY') : 'N/A'}</span></div>
                      <div><span className="font-semibold text-green-300">Yield:</span> <span className="text-green-100">{crop.yield || 'N/A'} kg</span></div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div><span className="font-semibold text-green-300">Sowing Date:</span> <span className="text-green-100">{crop.sowingDate ? dayjs(crop.sowingDate).format('DD/MM/YYYY') : 'N/A'}</span></div>
                      <div><span className="font-semibold text-green-300">Harvest Date:</span> <span className="text-green-100">{crop.harvestDate ? dayjs(crop.harvestDate).format('DD/MM/YYYY') : 'N/A'}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div><span className="font-semibold text-green-300">Revenue:</span> <span className="text-green-100">₹{crop.revenue || 'N/A'}</span></div>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-green-300">Fertilizers Used:</span> <span className="text-green-100">{crop.fertilizersUsed?.length ? crop.fertilizersUsed.join(', ') : 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-green-300">Pesticides Used:</span> <span className="text-green-100">{crop.pesticidesUsed?.length ? crop.pesticidesUsed.join(', ') : 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="bg-[#1a131a] rounded-xl p-4 md:p-8 shadow-lg text-pink-300">
              <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center">
                <FaHistory className="mr-2" />
                Crop History
              </h2>
              {historyLoading && <div className="text-base text-center">Loading...</div>}
              {historyError && <div className="text-red-400 text-center">{historyError}</div>}
              {!historyLoading && historyCrops.length === 0 && !historyError && (
                <div className="text-center text-pink-400">No harvested crops found.</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {historyCrops.map((crop) => (
                  <div key={crop._id} className="bg-gradient-to-br from-[#181014] via-[#221021] to-[#2a0a1a] rounded-2xl p-6 shadow-xl text-pink-100 border border-pink-900 relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${crop.status === 'Harvested' ? 'bg-pink-700 text-pink-100' : crop.status === 'Growing' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>{crop.status}</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-pink-900 text-pink-200 font-bold shadow">ID: {crop._id.slice(-5)}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <FaSeedling className="text-2xl text-pink-400 drop-shadow" />
                      <div className="font-extrabold text-pink-200 text-xl tracking-wide">{crop.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                      <div><span className="font-semibold text-pink-300">Type:</span> <span className="text-pink-100">{crop.type}</span></div>
                      <div><span className="font-semibold text-pink-300">Season:</span> <span className="text-pink-100">{crop.season}</span></div>
                      <div><span className="font-semibold text-pink-300">Duration:</span> <span className="text-pink-100">{crop.duration} days</span></div>
                      <div><span className="font-semibold text-pink-300">Soil Type:</span> <span className="text-pink-100">{crop.soilType}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div><span className="font-semibold text-pink-300">Last Watered:</span> <span className="text-pink-100">{crop.lastWatered ? dayjs(crop.lastWatered).format('DD/MM/YYYY') : 'N/A'}</span></div>
                      <div><span className="font-semibold text-pink-300">Yield:</span> <span className="text-pink-100">{crop.yield || 'N/A'} kg</span></div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div><span className="font-semibold text-pink-300">Sowing Date:</span> <span className="text-pink-100">{crop.sowingDate ? dayjs(crop.sowingDate).format('DD/MM/YYYY') : 'N/A'}</span></div>
                      <div><span className="font-semibold text-pink-300">Harvest Date:</span> <span className="text-pink-100">{crop.harvestDate ? dayjs(crop.harvestDate).format('DD/MM/YYYY') : 'N/A'}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div><span className="font-semibold text-pink-300">Revenue:</span> <span className="text-pink-100">₹{crop.revenue || 'N/A'}</span></div>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-pink-300">Fertilizers Used:</span> <span className="text-pink-100">{crop.fertilizersUsed?.length ? crop.fertilizersUsed.join(', ') : 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-pink-300">Pesticides Used:</span> <span className="text-pink-100">{crop.pesticidesUsed?.length ? crop.pesticidesUsed.join(', ') : 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <AddCropForm token={token} />
          )}
      </div>
    </main>
  </div>
  );
}

// AddCropForm component
function AddCropForm({ token }) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    season: '',
    duration: '',
    soilType: '',
    lastWatered: '',
    yield: '',
    sowingDate: '',
    harvestDate: '',
    revenue: '',
    fertilizersUsed: '',
    pesticidesUsed: '',
    status: 'Planted',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        yield: form.yield ? Number(form.yield) : undefined,
        revenue: form.revenue ? Number(form.revenue) : undefined,
        fertilizersUsed: form.fertilizersUsed.split(',').map(f => f.trim()).filter(Boolean),
        pesticidesUsed: form.pesticidesUsed.split(',').map(p => p.trim()).filter(Boolean),
        lastWatered: form.lastWatered || undefined,
        harvestDate: form.harvestDate || undefined,
      };
      await axios.post('https://agrosense-server.vercel.app/api/crops', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Crop added successfully!');
      setForm({
        name: '', type: '', season: '', duration: '', soilType: '', lastWatered: '', yield: '', sowingDate: '', harvestDate: '', revenue: '', fertilizersUsed: '', pesticidesUsed: '', status: 'Planted',
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#1a131a] rounded-xl p-4 md:p-8 shadow-lg text-pink-300 w-full max-w-2xl mx-auto">
      <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center">
        <FaSeedling className="mr-2" /> Add Crop
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Crop Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Type" name="type" value={form.type} onChange={handleChange} required />
        <Input label="Season" name="season" value={form.season} onChange={handleChange} required />
        <Input label="Duration (days)" name="duration" value={form.duration} onChange={handleChange} type="number" required />
        <Input label="Soil Type" name="soilType" value={form.soilType} onChange={handleChange} required />
        <Input label="Last Watered" name="lastWatered" value={form.lastWatered} onChange={handleChange} type="date" />
        <Input label="Yield (kg)" name="yield" value={form.yield} onChange={handleChange} type="number" />
        <Input label="Sowing Date" name="sowingDate" value={form.sowingDate} onChange={handleChange} type="date" required />
        <Input label="Harvest Date" name="harvestDate" value={form.harvestDate} onChange={handleChange} type="date" />
        <Input label="Revenue (₹)" name="revenue" value={form.revenue} onChange={handleChange} type="number" />
        <Input label="Fertilizers Used (comma separated)" name="fertilizersUsed" value={form.fertilizersUsed} onChange={handleChange} />
        <Input label="Pesticides Used (comma separated)" name="pesticidesUsed" value={form.pesticidesUsed} onChange={handleChange} />
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-semibold">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-lg p-2 bg-[#181014] text-pink-200 border border-pink-700">
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
            <option value="Harvested">Harvested</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2 mt-2">
          <button type="submit" className="bg-pink-700 hover:bg-pink-800 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200" disabled={loading}>
            {loading ? 'Adding...' : 'Add Crop'}
          </button>
          {success && <div className="text-green-400 text-center">{success}</div>}
          {error && <div className="text-red-400 text-center">{error}</div>}
        </div>
      </form>
    </div>
  );
}

// Reusable input component
function Input({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="block mb-1 font-semibold" htmlFor={name}>{label}{required && <span className="text-red-400">*</span>}</label>
      <input
        className="w-full rounded-lg p-2 bg-[#181014] text-pink-200 border border-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
      />
    </div>
  );
}
// (Removed duplicate closing tags and braces)

export default MyFarm;
