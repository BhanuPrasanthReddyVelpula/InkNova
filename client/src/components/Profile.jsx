import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">

      {/* Profile Button */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-neonBlue rounded-full flex items-center justify-center font-bold text-black cursor-pointer"
      >
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-gray-900 rounded-xl shadow-neon p-4 z-50">

          <p className="font-semibold mb-1">{user.name}</p>
          <p className="text-sm text-gray-400 mb-3">
            {user.email}
          </p>

          <p className="text-sm mb-3">
            {user.subscriptionActive ? (
              <span className="text-green-400">
                ⭐ Subscribed
              </span>
            ) : (
              <span className="text-yellow-400">
                Free User
              </span>
            )}
          </p>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full bg-red-600 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}

export default Profile;