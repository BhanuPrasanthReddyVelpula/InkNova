import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-cyberCard p-8 rounded-xl shadow-neon w-80"
      >
        <h2 className="text-2xl mb-6 text-center text-neonPink">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 p-2 rounded bg-black border border-neonBlue focus:outline-none focus:shadow-neon"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-4 p-2 rounded bg-black border border-neonBlue focus:outline-none focus:shadow-neon"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-neonPink to-neonBlue p-2 rounded font-bold mb-4">
          Login
        </button>

        {/* Register Section */}
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?
        </p>

        <Link
          to="/register"
          className="block text-center mt-2 text-neonBlue hover:underline font-semibold"
        >
          Create Account
        </Link>

      </form>
    </div>
  );
}

export default Login;