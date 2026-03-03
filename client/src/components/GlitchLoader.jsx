import { useEffect, useState } from "react";

function GlitchLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => setLoading(false), 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center bg-cyberDark relative overflow-hidden transition-opacity duration-700 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Animated Aura Layers */}
        <div className="aura aura1"></div>
        <div className="aura aura2"></div>

        <h1 className="glitch-elite text-6xl md:text-7xl font-extrabold">
          InkNova
        </h1>

        <p className="mt-4 text-neonBlue text-sm tracking-widest opacity-90 animate-flicker">
          Your Stories. Reimagined.
        </p>

        <p className="mt-4 text-gray-400 text-xs tracking-widest">
          Initializing Universe<span className="dots"></span>
        </p>

        <div className="mt-8 w-52 h-1 bg-gray-800 rounded overflow-hidden">
          <div className="loading-bar-elite h-full"></div>
        </div>
      </div>
    );
  }

  return children;
}

export default GlitchLoader;