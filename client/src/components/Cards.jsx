import React from "react";

const Cards = ({ Image, Title, Content, onClick }) => {
  return (
    <div
      className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 h-80 sm:h-96 md:h-90 md:p-4 max-md:p-3 sm:p-5 flex-shrink-0 hover:scale-105 rounded-3xl duration-300 cursor-pointer border border-green-900 shadow-xl relative group overflow-hidden"
      onClick={onClick}
    >
      {/* Green Glow Effect on Hover */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-60 transition duration-300 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #3ba96f33 0%, transparent 70%)'}} />
      <div className="flex flex-col justify-center items-center relative z-10">
        <img
          className="sm:h-40 md:h-40 w-full object-cover rounded-3xl"
          src={Image}
          alt="image"
        />
        <h1 className="text-lg sm:text-xl w-50 md:text-2xl text-center font-bold mt-3 text-green-300">{Title}</h1>
        <p className="text-sm text-center w-50 mt-2 text-green-100">{Content}</p>
      </div>
    </div>
  );
};

export default Cards;
