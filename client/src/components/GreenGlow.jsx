import React from "react";

// Green radial gradient background effect component
const GreenGlow = ({ className = "", style = {}, children }) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={style}
    >
      {/* Radial green glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: "radial-gradient(circle at 30% 40%, rgba(34,197,94,0.08) 0%, rgba(22,101,52,0.18) 40%, rgba(9,9,11,0.98) 80%)",
          filter: "blur(0px)",
        }}
      />
      {/* Content above the glow */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GreenGlow;
