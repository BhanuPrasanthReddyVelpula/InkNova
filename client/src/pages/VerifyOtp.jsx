import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      alert("Account verified successfully");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleVerify}
        className="bg-cyberCard p-8 rounded-xl shadow-neon w-80"
      >
        <h2 className="text-2xl mb-6 text-center text-neonPink">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-400 mb-4 text-center">
          Enter the OTP sent to your email
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          required
          className="w-full mb-4 p-2 rounded bg-black border border-neonBlue text-center tracking-widest"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-neonPink to-neonBlue p-2 rounded font-bold">
          Verify
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;