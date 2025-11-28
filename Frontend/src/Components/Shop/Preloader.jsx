import React, { useEffect, useState } from "react";
import "../../assects/css/preloader.css";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // 1.2s
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="preloader">
      <div className="preloader__spinner">
        <div className="preloader__bounce1"></div>
        <div className="preloader__bounce2"></div>
        <div className="preloader__bounce3"></div>
      </div>
    </div>
  );
};

export default Preloader;
