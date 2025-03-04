import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { AuthResponse } from "../types/authTypes";
import { FaUser, FaLock } from "react-icons/fa";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: AuthResponse = await login({ email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role || "");
        navigate("/"); // Redirect to the main page or dashboard
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#fdf7f3]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-[350px] border-2 border-yellow-500">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b-2 pb-1">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center border-b-2 pb-1">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none"
            />
          </div>
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-black font-semibold underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
