import React from "react";
import { toast } from 'react-hot-toast';

const Cards = ({ Image, Title, Content, onClick }) => {

  return (
    <div
      className="h-80 sm:h-96 md:h-80 md:p-2 max-md:p-3 sm:p-5 flex-shrink-0 hover:scale-101 rounded-xl border-gray-400 duration-300 cursor-pointer border-2 hover:shadow-md relative group overflow-hidden"
      onClick={onClick}
    >
      <div className="flex flex-col justify-center items-center relative z-10">
        <img
          className="sm:h-40 md:h-40 w-full object-cover rounded-xl"
          src={Image}
          alt="image"
          onError={()=>toast.error('Failed to load card image')}
        />
        <h1 className="text-lg sm:text-xl w-50 md:text-2xl text-center font-bold mt-3 ">{Title}</h1>
        <p className="text-sm text-center w-50 mt-2 ">{Content}</p>
      </div>
    </div>
  );
};

export default Cards;
