import React from 'react'

const FeatureCard = ({Icon, Title, Content, onClick}) => {
  return (
    <div
      className="md:p-4 h-40 max-md:p-3 sm:p-5 w-100 flex-shrink-0 hover:scale-101 rounded-xl border-gray-400  duration-300 cursor-pointer border hover:shadow-md relative group overflow-hidden"
      onClick={onClick}
    >
      <div className="flex flex-col justify-center items-center relative z-10">
        <p>{Icon}</p>
        <h1 className="text-xl  text-center font-bold mt-3 ">{Title}</h1>
        <p className="text-sm text-center text-gray-500 mt-2 ">{Content}</p>
      </div>
    </div>
  );
}

export default FeatureCard