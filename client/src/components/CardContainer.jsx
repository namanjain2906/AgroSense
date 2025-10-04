import React from "react";
import { toast } from 'react-hot-toast';
import Cards from "./Cards";
import FeatureCard from "./FeatureCard";
import { useNavigate } from "react-router-dom";
import { BellRing, Bot, ClipboardClock, Tractor } from "lucide-react";

const CardContainer = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center flex flex-col justify-between text-lg sm:text-2xl md:text-3xl font-semibold pt-6 sm:pt-10 min-h-screen">
      <p className=" mb-2">Our Features</p>
      <div className="w-full flex justify-center">
        <div className="flex flex-row gap-4 p-7 sm:gap-10 overflow-x-auto">
          <div className="flex flex-col gap-6">
            <FeatureCard
              Icon={<ClipboardClock className="h-12 w-12" />}
              Title={"Activity Tracking"}
              onClick={() => {
                try {
                  navigate("/myfarm");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } catch {
                  toast.error('Navigation failed');
                }
              }}
              Content={
                "Provides a centralized digital record system for past crop and activity tracking"
              }
            />
            <FeatureCard
            Icon={<Bot className="h-12 w-12" />}
              Title={"AI assistant in Malayalam"}
              onClick={() => {
                navigate("/sakhi");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              Content={
                "Introduces AI-driven advisory tailored for Kerala's farming conditions"
              }
            />
          </div>
          <div className="flex flex-col gap-6">
            <FeatureCard
            Icon={<BellRing className="h-12 w-12" />}
              Title={"Alerts & Reminder"}
              onClick={() => {
                navigate("/advisory");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              Content={
                "Provides timely personalized alerts & reminders which helps farmer to take action on time"
              }
            />
            <FeatureCard
            Icon={<Tractor className="h-12 w-12" />}
              Title={"Farmer & Farm Profiling"}
              onClick={() => {
                navigate("/myfarm");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              Content={"Stores complete information of farmer and farm"}
            />
          </div>
        </div>
      </div>
      <p className=" mt-8 mb-2">Agriculture Headlines</p>
      <div className="w-full flex justify-center">
        <div className="flex flex-row gap-4 p-7 sm:gap-10 overflow-x-auto">
          <Cards
            onClick={() =>
              window.open(
                "https://keralaagriculture.gov.in/en/2021/05/05/rice-development-2/",
                "_blank"
              )
            }
            Content={
              "During 2025-26, an amount of ₹ 13,420.00 lakh is provided for the promotion of rice cultivation in the State by Department of Agriculture"
            }
            Image={
              "https://keralaagriculture.gov.in/wp-content/uploads/2021/05/22b.jpg"
            }
          />
          <Cards
            onClick={() =>
              window.open(
                "https://keralaagriculture.gov.in/en/2021/05/05/location-specific-crops/",
                "_blank"
              )
            }
            Content={
              "Farm Plan Based Production Programme including pre-production support"
            }
            Image={
              "https://keralaagriculture.gov.in/wp-content/uploads/2021/09/crop-specific.png"
            }
          />
          <Cards
            onClick={() =>
              window.open(
                "https://keralaagriculture.gov.in/en/2021/05/05/vegetable-development-2/",
                "_blank"
              )
            }
            Content={"Vegetable Development through Department & VFPCK"}
            Image={
              "https://keralaagriculture.gov.in/wp-content/uploads/2021/05/62b.jpg"
            }
          />
          <Cards
            onClick={() =>
              window.open(
                "https://keralaagriculture.gov.in/en/2021/05/05/pulses/",
                "_blank"
              )
            }
            Content={"Development of Production and Technology Support"}
            Image={
              "https://keralaagriculture.gov.in/wp-content/uploads/2021/05/24c.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
