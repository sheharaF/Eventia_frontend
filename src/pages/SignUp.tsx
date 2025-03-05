import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaFileUpload } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId =
  "889856854626-somdl54dv1d2o19tjursnh9omdc3fqj1.apps.googleusercontent.com";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Normal Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      // If Vendor, check for Business Registration upload
      if (role === "Vendor") {
        const brFileInput = document.getElementById(
          "brUpload"
        ) as HTMLInputElement;
        if (brFileInput?.files?.length) {
          formData.append("businessRegistration", brFileInput.files[0]);
        } else {
          setError("Business Registration document is required for Vendors.");
          return;
        }
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData, // Using FormData for file upload
      });

      const data = await response.json();
      if (data.message) {
        navigate("/login"); // Redirect to login after successful registration
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        // Decode the token to check if it's valid
        const decoded: any = jwtDecode(credentialResponse.credential);
        console.log("Decoded Google Token:", decoded); // Debugging

        if (!decoded.email) {
          setError("Invalid Google token. Please try again.");
          return;
        }

        // Send the token to the backend
        const response = await fetch("http://localhost:5000/api/google/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token); // Store token
          navigate("/");
        } else {
          setError(data.error || "Google authentication failed.");
        }
      } catch (err) {
        setError("Google authentication failed. Please try again.");
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center items-center h-screen bg-[#fdf7f3]">
        <div className="bg-white p-8 rounded-2xl shadow-md w-[350px] border-2 border-yellow-500">
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border-b-2 pb-1">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full outline-none"
              />
            </div>
            <div className="flex items-center border-b-2 pb-1">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
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
            <div className="flex items-center border-b-2 pb-1">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full outline-none"
              >
                <option value="User">User</option>
                <option value="Vendor">Vendor</option>
              </select>
            </div>

            {/* File Upload for Vendors */}
            {role === "Vendor" && (
              <div className="flex flex-col space-y-2">
                <label className="font-semibold">
                  Upload Business Registration (BR)
                </label>
                <div className="flex items-center border-b-2 pb-1">
                  <FaFileUpload className="text-gray-500 mr-2" />
                  <input
                    type="file"
                    id="brUpload"
                    accept=".pdf,.jpg,.png"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Google Sign-In */}
          <div className="mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign-In failed. Try again.")}
            />
          </div>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-black font-semibold underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp;
