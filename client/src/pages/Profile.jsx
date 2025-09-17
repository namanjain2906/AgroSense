import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="p-10">You are not logged in.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#101613] px-2 sm:px-6 md:px-16 lg:px-36">
      <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-3 sm:p-8 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md border border-green-900">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-green-200">My Profile</h2>
        <div className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl text-green-100"><strong className="text-green-400">Username:</strong> {user.username}</div>
        <div className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl text-green-100"><strong className="text-green-400">Name:</strong> {user.firstName} {user.lastName}</div>
        <div className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl text-green-100"><strong className="text-green-400">Email:</strong> {user.email}</div>
        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-6 px-3 sm:px-4 py-2 bg-gradient-to-tr from-green-800 to-green-700 text-green-50 rounded-md hover:bg-green-700 hover:text-green-200 transition duration-300 text-xs sm:text-base border border-green-900 shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
