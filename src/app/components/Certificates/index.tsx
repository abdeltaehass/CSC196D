"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { readContract } from "@wagmi/core";
import { contract_abi, contract_address } from "@/lib/contract";
import { wagmiAdapter } from "@/lib/config"; // Import your Wagmi config

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const hrVariants = {
  hidden: { width: "0%" },
  visible: {
    width: "50%",
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const Certificates = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [byteCode, setByteCode] = useState("");
  const [isByteCodeModalOpen, setIsByteCodeModalOpen] = useState(false);
  const [inputByteCode, setInputByteCode] = useState("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  // const fetchCertificates = async () => {
  //   try {
  //     const response = await axios.get("/api/certificates");
  //     console.log("Fetched Certificates:", response.data);
      
      
  //   } catch (err) {
  //     console.error("Failed to fetch certificates:", err);
  //     setError("Failed to fetch data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCertificates();
  // }, []);

 

  
  // Fetch bytecode from contract
  const handleGetByteCode = async () => {
    if (!userId) {
      alert("Please enter a User ID");
      return;
    }

    try {
      const result = await readContract(wagmiAdapter.wagmiConfig, {
        address: contract_address,
        abi: contract_abi,
        functionName: "getCertificatesByStudentId", // Replace with your actual function name
        args: [userId], // Assuming the function takes a user ID as an argument
      });
      setByteCode(result as string); // Assuming the result is a string (bytecode)
      setIsByteCodeModalOpen(true);
    } catch (error) {
      console.error("Error fetching bytecode:", error);
      alert("Failed to fetch bytecode. Check console for details.");
    }
  };

  // Copy bytecode to clipboard
  const handleCopyByteCode = () => {
    navigator.clipboard.writeText(byteCode);
    alert("Bytecode copied to clipboard!");
  };

  // Read user details from contract using bytecode
  const handleReadUserDetails = async () => {
    if (!inputByteCode) {
      alert("Please enter bytecode");
      return;
    }

    try {
      const result = await readContract(wagmiAdapter.wagmiConfig, {
        address: contract_address, // Or another contract address if different
        abi: contract_abi,
        functionName: "verifyCertificate", // Replace with your actual function name
        args: [inputByteCode], // Assuming it takes bytecode as an argument
      });
      console.log("user detal", result)
      setUserDetails(result); // Assuming result is an object with user details
      setIsUserDetailsModalOpen(true);
    } catch (error) {
      console.error("Error reading user details:", error);
      alert("Failed to read user details. Check console for details.");
    }
  };

  // if (loading) return <p className="text-white text-center">Loading...</p>;
  // if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <section
      id="certificates"
      className="w-full py-16 bg-gradient-to-r from-cyan-500 to-blue-500"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="flex justify-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.hr
            variants={hrVariants}
            className="h-1 bg-white/50 rounded-full border-none"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="text-center"
        >
          <h2 className="text-5xl font-extrabold text-white drop-shadow-lg audio_font mb-8">
            Certificates
          </h2>

          {/* Search Bar */}
          {/* <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by ID or Name"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 audio_font"
            />
          </div> */}

          {/* User ID Input and Get Byte Code Button */}
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 audio_font mb-4"
            />
            <button
              onClick={handleGetByteCode}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
            >
              Get Byte Code
            </button>
          </div>

          {/* Byte Code Input and Read User Details Button */}
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              value={inputByteCode}
              onChange={(e) => setInputByteCode(e.target.value)}
              placeholder="Enter Byte Code"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 audio_font mb-4"
            />
            <button
              onClick={handleReadUserDetails}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
            >
              Get Certificate Details
            </button>
          </div>

          {/* Certificates Grid */}
          {/* {filteredCertificates.length === 0 ? (
            <p className="text-white text-center">No certificates found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {filteredCertificates.map((certificate) => (
                <Card
                  key={certificate._id}
                  imageSrc={certificate.imageUrl}
                  certificateName={certificate.name}
                  onViewClick={() => handleViewCertificate(certificate)}
                />
              ))}
            </div>
          )} */}
        </motion.div>

        {/* Certificate Details Modal */}
        {/* {isModalOpen && selectedCertificate && (
          <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 w-full max-w-md">
              <h3 className="text-2xl font-bold text-white audio_font mb-4 text-center">
                Certificate Details
              </h3>
              <div className="relative h-48 mb-4">
                <Image
                  src={selectedCertificate.imageUrl}
                  alt={selectedCertificate.name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <p className="text-black text-center mb-2">
                <strong>Name:</strong> {selectedCertificate.name}
              </p>
              <p className="text-black text-center mb-4">
                <strong>ID:</strong> {selectedCertificate._id}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Byte Code Modal */}
        {isByteCodeModalOpen && (
          <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 w-full max-w-md">
              <h3 className="text-2xl font-bold text-white audio_font mb-4 text-center">
                Byte Code
              </h3>
              <p className="text-black text-center mb-4 break-all">{byteCode}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCopyByteCode}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
                >
                  Copy
                </button>
                <button
                  onClick={() => setIsByteCodeModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors audio_font"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {/* User Details Modal */}
        {isUserDetailsModalOpen && userDetails && (
          <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 w-full max-w-md">
              <h3 className="text-2xl font-bold text-white audio_font mb-4 text-center">
                User Details
              </h3>
              <div className="text-black text-center space-y-2">
                <p>
                  <strong>Name:</strong> {userDetails[0] || "N/A"}
                </p>
                <p>
                  <strong>ID:</strong> {userDetails[1] || "N/A"}
                </p>
                <p>
                  <strong>Course:</strong> {userDetails[2] || "N/A"}
                </p>
                <p>
                  <strong>Issuer:</strong> {userDetails[3] || "N/A"}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {userDetails[4]
                    ? new Date(Number(userDetails[4]) * 1000).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Active:</strong> {userDetails[5] ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setIsUserDetailsModalOpen(false)}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;