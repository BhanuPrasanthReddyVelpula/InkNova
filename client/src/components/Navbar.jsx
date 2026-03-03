import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Profile from "./Profile";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="relative z-20 flex justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-md border-b border-neonBlue">
      
      <Link to="/" className="text-2xl text-neonPink font-bold">
        InkNova
      </Link>

      <div className="flex items-center gap-6">

        <Link
          to="/"
          className="hover:text-neonBlue transition duration-300 hover:drop-shadow-[0_0_8px_#00F5FF]"
        >
          Home
        </Link>
        
        {!user && (
          <Link
            to="/login"
            className="bg-gradient-to-r from-neonPink to-neonBlue px-4 py-2 rounded font-semibold"
          >
            Login
          </Link>
        )}

        {user && <Profile />}

      </div>
    </nav>
  );
}

export default Navbar;