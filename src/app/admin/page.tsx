"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


const AdminLogin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validDigits = [1, 2, 3, 4, 5]; // Valid digits for each position in the PIN

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Check if the PIN contains only digits between 1 and 5
    const isValidPin = pin
      .split("")
      .every((digit) => validDigits.includes(parseInt(digit, 10)));

    if (isValidPin) {
      router.push("/admin/dashboard"); // Redirect to admin dashboard
    } else {
      setError("Invalid PIN. Each digit must be between 1 and 5.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white audio_font mb-6 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/90 font-semibold mb-2 audio_font">
              Enter PIN
            </label>
            <input
              type="text" // Changed to text to allow string input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400"
              placeholder="Enter PIN (e.g., 12345)"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-colors duration-300 audio_font"
          >
            Login
          </button>
          {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;