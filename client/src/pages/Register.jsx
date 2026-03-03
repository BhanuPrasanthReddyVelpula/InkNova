import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/"); // Redirect to home after registration
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700"
      >
        <h2 className="text-3xl mb-6 text-center text-neonPink font-bold">
          Create Account
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-black border border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonPink transition"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-black border border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonPink transition"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-black border border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonPink transition"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-black border border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonPink transition"
        />

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-neonPink to-neonBlue py-3 rounded-lg font-bold hover:opacity-90 transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm">
          Already have an account?
        </p>

        <Link
          to="/login"
          className="block text-center mt-3 text-neonBlue hover:text-neonPink transition font-semibold"
        >
          Login Here
        </Link>

      </form>
    </div>
  );
}

export default Register;