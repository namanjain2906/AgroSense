import React from "react";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Assistant = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/sakhi");
  };
  return (
    <button
      onClick={handleClick}
      className="bg-orange-400 cursor-pointer h-20 w-20 rounded-full fixed bottom-10 right-10 flex justify-center items-center"
    >
      <FaRobot className="text-white" size={40} />
    </button>
  );
};

export default Assistant;