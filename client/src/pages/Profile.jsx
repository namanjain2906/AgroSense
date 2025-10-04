import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <div className="p-10">You are not logged in.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-2 sm:px-6 md:px-16 lg:px-36">
      <div className=" p-3 sm:p-8 rounded-xl  w-full max-w-xs sm:max-w-md border ">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-green-600">
          My Profile
        </h2>
        <div className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl ">
          <strong className="text-green-600">Username:</strong> {user.username}
        </div>
        <div className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl ">
          <strong className="text-green-600">Name:</strong> {user.firstName}{" "}
          {user.lastName}
        </div>
        <div className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl ">
          <strong className="text-green-600">Email:</strong> {user.email}
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-6 px-3 sm:px-4 py-2 rounded-md hover:bg-green-700 bg-green-600 transition duration-300 text-xs sm:text-base "
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
