import React from "react";
import Cards from "./Cards";
import { useNavigate } from "react-router-dom";

const CardContainer = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#101613] text-center flex flex-col justify-between text-green-100 text-lg sm:text-2xl md:text-3xl font-semibold pt-6 sm:pt-10 min-h-screen">
      <p className="text-green-300 mb-2">Our Features</p>
      <div className="w-full flex justify-center">
        <div className="flex flex-row gap-4 p-7 sm:gap-10 overflow-x-auto">
          <Cards Title={"Activity Tracking"} onClick={()=>{navigate('/myfarm'); window.scrollTo({top: 0, behavior: "smooth"});}} Content={"Provides a centralized digital record system for past crop and activity tracking"} Image={"https://images.unsplash.com/photo-1757307046224-4f91157d1578?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />
          <Cards Title={"AI assistant in Malayalam"} onClick={()=>{navigate('/sakhi'); window.scrollTo({top: 0, behavior: "smooth"});}} Content={"Introduces AI-driven advisory tailored for Kerala's farming conditions"} Image={"https://images.unsplash.com/photo-1757307046224-4f91157d1578?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />
          <Cards Title={"Alerts & Reminder"} onClick={()=>{navigate('/advisory'); window.scrollTo({top: 0, behavior: "smooth"});}} Content={"Provides timely personalized alerts & reminders which helps farmer to take action on time"} Image={"https://images.unsplash.com/photo-1757307046224-4f91157d1578?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />
          <Cards Title={"Farmer & Farm Profiling"} onClick={()=>{navigate('/myfarm'); window.scrollTo({top: 0, behavior: "smooth"});}} Content={"Stores complete information of farmer and farm"} Image={"https://images.unsplash.com/photo-1757307046224-4f91157d1578?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />
        </div>
      </div>
  <p className="text-green-300 mt-8 mb-2">Agriculture Headlines</p>
      <div className="w-full flex justify-center">
        <div className="flex flex-row gap-4 p-7 sm:gap-10 overflow-x-auto">
          <Cards
            onClick={() => window.open("https://keralaagriculture.gov.in/en/2021/05/05/rice-development-2/", "_blank")}
            Content={"During 2025-26, an amount of ₹ 13,420.00 lakh is provided for the promotion of rice cultivation in the State by Department of Agriculture"}
            Image={"https://keralaagriculture.gov.in/wp-content/uploads/2021/05/22b.jpg"}
          />
          <Cards
            onClick={() => window.open("https://keralaagriculture.gov.in/en/2021/05/05/location-specific-crops/", "_blank")}
            Content={"Farm Plan Based Production Programme including pre-production support"}
            Image={"https://keralaagriculture.gov.in/wp-content/uploads/2021/09/crop-specific.png"}
          />
          <Cards
            onClick={() => window.open("https://keralaagriculture.gov.in/en/2021/05/05/vegetable-development-2/", "_blank")}
            Content={"Vegetable Development through Department & VFPCK"}
            Image={"https://keralaagriculture.gov.in/wp-content/uploads/2021/05/62b.jpg"}
          />
          <Cards
            onClick={() => window.open("https://keralaagriculture.gov.in/en/2021/05/05/pulses/", "_blank")}
            Content={"Development of Production and Technology Support"}
            Image={"https://keralaagriculture.gov.in/wp-content/uploads/2021/05/24c.jpg"}
          />
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
