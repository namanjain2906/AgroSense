import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext.jsx';
import {
  CircleUserRound,
  MapPin,
  MenuIcon,
  Package,
  SearchIcon,
  XIcon,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

    return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-2 sm:py-5 px-2 sm:px-6 md:px-16 lg:px-36 backdrop-blur bg-transparent">
      <Link to="/" className="text-base sm:text-lg md:text-xl mx-2 sm:mx-5">
        AgroSense
      </Link>

      <div
        className={`max-md:absolute top-0 left-0 backdrop-blur max-md:font-medium max-md:text-base md:py-3 md:px-6 max-md:gap-4 md:gap-3 lg:gap-16 bg-black/70 max-md:h-screen flex flex-col md:flex-row justify-center items-center min-md:rounded-full md:border md:bg-white/10 md:border-gray-300/20 overflow-hidden transition-[width] duration-300
        ${isOpen ? "max-md:w-full" : "max-md:w-0"}`}
      >
        <XIcon
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer hover:text-gray-300"
        ></XIcon>
        <Link
          to={"/"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          Home
        </Link>
        <Link
          to={"/myfarm"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          My Farm
        </Link>

        <Link
          to={"/advisory"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          Advisory
        </Link>
        <Link
          to={"/weather"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          Weather
        </Link>
        <Link
          to={"/crops"}
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
          className="hover:text-gray-300"
        >
          Crops
        </Link>
      </div>
      {/* Show Login if not logged in, else show My Profile */}
      {!user ? (
        <Link
          to="/login"
          className="px-4 py-2 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition duration-300"
        >
          Login
        </Link>
      ) : (
        <Link
          to="/profile"
          className="px-3 py-1 sm:px-6 sm:py-2 border border-green-600 rounded-lg text-green-400 hover:bg-green-600 hover:text-white transition duration-200 ml-2 sm:ml-4 text-xs sm:text-base "
        >
          My Profile
        </Link>
      )}
      <MenuIcon
        onClick={() => setIsOpen(true)}
        className="w-8 h-8 cursor-pointer hover:text-gray-300 min-md:hidden"
      />
    </div>
  );
};

export default Navbar;
