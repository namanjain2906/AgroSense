import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAppContext } from "../context/AppContext";
import { toast } from 'react-hot-toast';
import {
  FaLeaf,
  FaHistory,
  FaPlus,
  FaTractor,
  FaSeedling,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const tabs = [
  { label: "Farm Details", icon: <FaTractor /> },
  { label: "Current Crop", icon: <FaLeaf /> },
  { label: "Crop History", icon: <FaHistory /> },
  { label: "Add Crop", icon: <FaPlus /> },
];

const MyFarm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { token, farmDetails, currentCrops, pastCrops } = useAppContext();
  const navigate = useNavigate();
  const [editCrop, setEditCrop] = useState(null);
  const editFormRef = React.useRef(null);

  useEffect(() => {
    if (!token) {
      toast.error("You must be logged in to view your farm");
      navigate("/login");
    } else if (!farmDetails) {
      toast.error("Please add your farm details first");
      navigate("/farm-details");
    }
  }, [token, farmDetails, navigate]);

  useEffect(() => {
    if (editCrop && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editCrop]);

  return (
    <div className="min-h-screen pt-25 flex flex-col  md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex flex-col md:flex-col items-center py-0 md:py-8 border-b md:border-b-0 md:border-r">
        {/* Mobile: horizontal navbar */}
        <div className="flex md:hidden w-full items-center justify-between px-2 py-2  border-b">
          <nav className="flex gap-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors duration-200 text-center whitespace-nowrap overflow-hidden text-ellipsis ${
                  activeTab === idx ? "bg-green-600/20" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(idx)}
              >
                <div className="flex items-center my-3">
                  <span className="mr-3 text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </div>
                <div className="flex items-center gap-1 h-full">
                  {
                    <span
                      className={`right-0 h-full w-1 ${
                        activeTab == idx ? "bg-green-700" : "bg-null"
                      } `}
                    ></span>
                  }
                </div>
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
                className={`w-full cursor-pointer flex items-center justify-between px-6 pr-0 transition-colors duration-200 text-left whitespace-nowrap overflow-hidden text-ellipsis ${
                  activeTab === idx ? "bg-green-600/20" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(idx)}
              >
                <div className="flex items-center my-3">
                  <span className="mr-3 text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </div>
                <div className="flex items-center gap-1 h-full">
                  {
                    <span
                      className={`right-0 h-full w-1 ${
                        activeTab == idx ? "bg-green-700" : "bg-null"
                      } `}
                    ></span>
                  }
                </div>
              </button>
            ))}
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full h-full">
          {activeTab === 0 && (
            <div className="p-4  md:p-8">
              <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 flex items-center">
                Farm Details
              </h2>
              {!farmDetails && (
                <div className="text-base text-center">Loading...</div>
              )}
              {farmDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="rounded-xl p-4 shadow">
                    <div className="font-semibold mb-2">
                      Farm Name
                    </div>
                    <div className="text-lg">{farmDetails.farmName}</div>
                  </div>
                  <div className="rounded-xl p-4 shadow">
                    <div className="font-semibold mb-2">
                      Location
                    </div>
                    <div className="text-lg">{farmDetails.location}</div>
                  </div>
                  <div className="rounded-xl p-4 shadow">
                    <div className="font-semibold mb-2">
                      Size (acres)
                    </div>
                    <div className="text-lg">{farmDetails.size}</div>
                  </div>
                  <div className="rounded-xl p-4 shadow">
                    <div className="font-semibold mb-2">
                      Soil Type
                    </div>
                    <div className="text-lg">{farmDetails.soilType}</div>
                  </div>
                  <div className="rounded-xl p-4 shadow">
                    <div className="font-semibold mb-2">
                      Irrigation Type
                    </div>
                    <div className="text-lg">{farmDetails.irrigationType}</div>
                  </div>
                </div>
              )}
              {!farmDetails && (
                <div className="text-center">
                  No farm data found for this user.
                </div>
              )}
            </div>
          )}
          {activeTab === 1 && (
            <div className="p-4  md:p-8 ">
              <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center">
                <FaLeaf className="mr-2" />
                Current Crops
              </h2>
              {!currentCrops && (
                <div className="text-base text-center">Loading...</div>
              )}
              {currentCrops && currentCrops.length === 0 && (
                <div className="text-center ">
                  No current crops found.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {currentCrops && currentCrops.map((crop) => (
                  <div
                    key={crop._id}
                    className="p-6 border-2 rounded-xl relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          crop.status === "Growing"
                            ? "bg-green-700 text-green-100"
                            : crop.status === "Planted"
                            ? "bg-lime-700 text-lime-100"
                            : "bg-green-900 text-green-100"
                        }`}
                      >
                        {crop.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-bold shadow">
                        ID: {crop._id.slice(-5)}
                      </span>
                    </div>
                    <div className="flex  items-center gap-3 mb-2">
                      <FaSeedling className="text-2xl  drop-shadow" />
                      <div className="font-extrabold text-green-600 text-xl tracking-wide">
                        {crop.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Type:
                        </span>{" "}
                        <span className="">{crop.type}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Season:
                        </span>{" "}
                        <span className="">{crop.season}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Duration:
                        </span>{" "}
                        <span className="">
                          {crop.duration} days
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Soil Type:
                        </span>{" "}
                        <span className="">{crop.soilType}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Last Watered:
                        </span>{" "}
                        <span className="">
                          {crop.lastWatered
                            ? dayjs(crop.lastWatered).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Yield:
                        </span>{" "}
                        <span className="">
                          {crop.yield || "N/A"} kg
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Sowing Date:
                        </span>{" "}
                        <span className="">
                          {crop.sowingDate
                            ? dayjs(crop.sowingDate).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Harvest Date:
                        </span>{" "}
                        <span className="">
                          {crop.harvestDate
                            ? dayjs(crop.harvestDate).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Revenue:
                        </span>{" "}
                        <span className="">
                          ₹{crop.revenue || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-green-300">
                        Fertilizers Used:
                      </span>{" "}
                      <span className="">
                        {crop.fertilizersUsed?.length
                          ? crop.fertilizersUsed.join(", ")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-green-300">
                        Pesticides Used:
                      </span>{" "}
                      <span className="">
                        {crop.pesticidesUsed?.length
                          ? crop.pesticidesUsed.join(", ")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="mb-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition"
                        onClick={() => setEditCrop(crop)}
                      >
                        Update Crop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Show edit form if editCrop is set */}
              {editCrop && (
                <div ref={editFormRef}>
                  <EditCropForm
                    key={editCrop._id} // force remount on crop change
                    token={token}
                    initialValues={editCrop}
                    onClose={() => setEditCrop(null)}
                  />
                </div>
              )}
            </div>
          )}
          {activeTab === 2 && (
            <div className="p-4 md:p-8 ">
              <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center">
                <FaHistory className="mr-2" />
                Crop History
              </h2>
              {!pastCrops && (
                <div className="text-base text-center">Loading...</div>
              )}
              {pastCrops && pastCrops.length === 0 && (
                <div className="text-center ">
                  No harvested crops found.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {pastCrops && pastCrops.map((crop) => (
                  <div
                    key={crop._id}
                    className="p-6  border-2 rounded-xl relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          crop.status === "Harvested"
                            ? "bg-pink-700 text-pink-100"
                            : crop.status === "Growing"
                            ? "bg-green-700 text-green-100"
                            : "bg-yellow-700 text-yellow-100"
                        }`}
                      >
                        {crop.status}
                      </span>

                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <FaSeedling className="text-2xl  drop-shadow" />
                      <div className="font-extrabold text-green-600 text-xl tracking-wide">
                        {crop.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Type:
                        </span>{" "}
                        <span className="">{crop.type}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Season:
                        </span>{" "}
                        <span className="">{crop.season}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Duration:
                        </span>{" "}
                        <span className="">
                          {crop.duration} days
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Soil Type:
                        </span>{" "}
                        <span className="">{crop.soilType}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Last Watered:
                        </span>{" "}
                        <span className="">
                          {crop.lastWatered
                            ? dayjs(crop.lastWatered).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Yield:
                        </span>{" "}
                        <span className="">
                          {crop.yield || "N/A"} kg
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Sowing Date:
                        </span>{" "}
                        <span className="">
                          {crop.sowingDate
                            ? dayjs(crop.sowingDate).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">
                          Harvest Date:
                        </span>{" "}
                        <span className="">
                          {crop.harvestDate
                            ? dayjs(crop.harvestDate).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div>
                        <span className="font-semibold text-green-300">
                          Revenue:
                        </span>{" "}
                        <span className="">
                          ₹{crop.revenue || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-green-300">
                        Fertilizers Used:
                      </span>{" "}
                      <span className="">
                        {crop.fertilizersUsed?.length
                          ? crop.fertilizersUsed.join(", ")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-green-300">
                        Pesticides Used:
                      </span>{" "}
                      <span className="">
                        {crop.pesticidesUsed?.length
                          ? crop.pesticidesUsed.join(", ")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 3 && <AddCropForm token={token} />}
        </div>
      </main>
    </div>
  );
};

// AddCropForm component
function AddCropForm({ token }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    season: "",
    duration: "",
    soilType: "",
    irrigationType: "",
    lastWatered: "",
    yield: "",
    sowingDate: "",
    harvestDate: "",
    revenue: "",
    fertilizersUsed: "",
    pesticidesUsed: "",
    status: "Planted",
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
        fertilizersUsed: form.fertilizersUsed
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        pesticidesUsed: form.pesticidesUsed
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        lastWatered: form.lastWatered || undefined,
        harvestDate: form.harvestDate || undefined,
      };
      await fetch(
        "https://agrosense-server.vercel.app/api/crops",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      setSuccess("Crop added successfully!");
      toast.success("Crop added successfully!");
      setForm({
        name: "",
        type: "",
        season: "",
        duration: "",
        soilType: "",
        lastWatered: "",
        yield: "",
        sowingDate: "",
        harvestDate: "",
        revenue: "",
        fertilizersUsed: "",
        pesticidesUsed: "",
        status: "Planted",
      });
    } catch (err) {
      setError("Error adding crop");
      toast.error("Error adding crop");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center">
        <FaSeedling className="mr-2" /> Add Crop
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          label="Crop Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        />
        <Input
          label="Season"
          name="season"
          value={form.season}
          onChange={handleChange}
          required
        />
        <Input
          label="Duration (days)"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          type="number"
          required
        />
        {/* Soil Type Dropdown */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="soilType">
            Soil Type <span className="text-red-400">*</span>
          </label>
          <select
            id="soilType"
            name="soilType"
            value={form.soilType}
            onChange={handleChange}
            required
            className="w-full rounded-lg p-2 border"
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
        </div>
        {/* Irrigation Type Dropdown */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="irrigationType">
            Irrigation Type <span className="text-red-400">*</span>
          </label>
          <select
            id="irrigationType"
            name="irrigationType"
            value={form.irrigationType}
            onChange={handleChange}
            required
            className="w-full rounded-lg p-2 border"
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
        </div>
        <Input
          label="Last Watered"
          name="lastWatered"
          value={form.lastWatered}
          onChange={handleChange}
          type="date"
        />
        <Input
          label="Yield (kg)"
          name="yield"
          value={form.yield}
          onChange={handleChange}
          type="number"
        />
        <Input
          label="Sowing Date"
          name="sowingDate"
          value={form.sowingDate}
          onChange={handleChange}
          type="date"
          required
        />
        <Input
          label="Harvest Date"
          name="harvestDate"
          value={form.harvestDate}
          onChange={handleChange}
          type="date"
        />
        <Input
          label="Revenue (₹)"
          name="revenue"
          value={form.revenue}
          onChange={handleChange}
          type="number"
        />
        <Input
          label="Fertilizers Used (comma separated)"
          name="fertilizersUsed"
          value={form.fertilizersUsed}
          onChange={handleChange}
        />
        <Input
          label="Pesticides Used (comma separated)"
          name="pesticidesUsed"
          value={form.pesticidesUsed}
          onChange={handleChange}
        />
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg p-2 border"
          >
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
            <option value="Harvested">Harvested</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2 mt-2">
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Crop"}
          </button>
          {success && (
            <div className="text-green-400 text-center">{success}</div>
          )}
          {error && <div className=" text-center">{error}</div>}
        </div>
      </form>
    </div>
  );
}

// EditCropForm component (same as AddCropForm but with initial values and update logic)
function EditCropForm({ token, initialValues, onClose }) {
  // Always set all fields from initialValues when crop changes
  const [form, setForm] = useState({
    name: "",
    type: "",
    season: "",
    duration: "",
    soilType: "",
    irrigationType: "",
    lastWatered: "",
    yield: "",
    sowingDate: "",
    harvestDate: "",
    revenue: "",
    fertilizersUsed: "",
    pesticidesUsed: "",
    status: "Planted",
  });

  useEffect(() => {
    setForm({
      name: initialValues.name || "",
      type: initialValues.type || "",
      season: initialValues.season || "",
      duration: initialValues.duration || "",
      soilType: initialValues.soilType || "",
      irrigationType: initialValues.irrigationType || "",
      lastWatered: initialValues.lastWatered
        ? dayjs(initialValues.lastWatered).format("YYYY-MM-DD")
        : "",
      yield: initialValues.yield || "",
      sowingDate: initialValues.sowingDate
        ? dayjs(initialValues.sowingDate).format("YYYY-MM-DD")
        : "",
      harvestDate: initialValues.harvestDate
        ? dayjs(initialValues.harvestDate).format("YYYY-MM-DD")
        : "",
      revenue: initialValues.revenue || "",
      fertilizersUsed: Array.isArray(initialValues.fertilizersUsed)
        ? initialValues.fertilizersUsed.join(", ")
        : initialValues.fertilizersUsed || "",
      pesticidesUsed: Array.isArray(initialValues.pesticidesUsed)
        ? initialValues.pesticidesUsed.join(", ")
        : initialValues.pesticidesUsed || "",
      status: initialValues.status || "Planted",
    });
  }, [initialValues]);

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
        fertilizersUsed: form.fertilizersUsed
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        pesticidesUsed: form.pesticidesUsed
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        lastWatered: form.lastWatered || undefined,
        harvestDate: form.harvestDate || undefined,
      };

      if (!initialValues._id) {
        setError("Invalid crop ID. Cannot update.");
        toast.error("Invalid crop ID. Cannot update.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://agrosense-server.vercel.app/api/crops/${initialValues._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess("Crop updated successfully!");
        toast.success("Crop updated successfully!");
        onClose();
      } else {
        setError(data.error || "Error updating crop");
        toast.error(data.error || "Error updating crop");
      }
    } catch (err) {
      setError("Error updating crop");
      toast.error("Error updating crop");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg md:text-2xl font-bold mb-4 flex items-center">
          <FaSeedling className="mr-2" /> Update Crop
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input
            label="Crop Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          />
          <Input
            label="Season"
            name="season"
            value={form.season}
            onChange={handleChange}
            required
          />
          <Input
            label="Duration (days)"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            type="number"
            required
          />
          {/* Soil Type Dropdown */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="soilType">
              Soil Type <span className="text-red-400">*</span>
            </label>
            <select
              id="soilType"
              name="soilType"
              value={form.soilType}
              onChange={handleChange}
              required
              className="w-full rounded-lg p-2 border"
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
          </div>
          {/* Irrigation Type Dropdown */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="irrigationType">
              Irrigation Type <span className="text-red-400">*</span>
            </label>
            <select
              id="irrigationType"
              name="irrigationType"
              value={form.irrigationType}
              onChange={handleChange}
              required
              className="w-full rounded-lg p-2 border"
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
          </div>
          <Input
            label="Last Watered"
            name="lastWatered"
            value={form.lastWatered}
            onChange={handleChange}
            type="date"
          />
          <Input
            label="Yield (kg)"
            name="yield"
            value={form.yield}
            onChange={handleChange}
            type="number"
          />
          <Input
            label="Sowing Date"
            name="sowingDate"
            value={form.sowingDate}
            onChange={handleChange}
            type="date"
            required
          />
          <Input
            label="Harvest Date"
            name="harvestDate"
            value={form.harvestDate}
            onChange={handleChange}
            type="date"
          />
          <Input
            label="Revenue (₹)"
            name="revenue"
            value={form.revenue}
            onChange={handleChange}
            type="number"
          />
          <Input
            label="Fertilizers Used (comma separated)"
            name="fertilizersUsed"
            value={form.fertilizersUsed}
            onChange={handleChange}
          />
          <Input
            label="Pesticides Used (comma separated)"
            name="pesticidesUsed"
            value={form.pesticidesUsed}
            onChange={handleChange}
          />
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg p-2 border"
            >
              <option value="Planted">Planted</option>
              <option value="Growing">Growing</option>
              <option value="Harvested">Harvested</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Crop"}
            </button>
            {success && (
              <div className="text-green-400 text-center">{success}</div>
            )}
            {error && <div className=" text-center">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable input component
function Input({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="block mb-1 font-semibold" htmlFor={name}>
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        className="w-full rounded-lg p-2 border"
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

export default MyFarm;
const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');

// Fix: Add/ensure this route exists for updating a crop by ID
router.put('/crops/:id', async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;