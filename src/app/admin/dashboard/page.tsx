"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner"; // Import toast for notifications
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Dialog, DialogContent } from "@/components/ui/dialog"; // ShadCN Modal
import Image from "next/image";
import {writeContract, readContract, simulateContract } from "@wagmi/core";
import {contract_abi, contract_address} from '@/lib/contract'
import { wagmiAdapter } from '@/lib/config';
import Certificates from "@/app/components/Certificates";


const AdminDashboard = () => {
  // const [certificates, setCertificates] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Explicitly type as string or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [isIssuerModalOpen, setIsIssuerModalOpen] = useState<boolean>(false);
  const [isRemoveIssuerModal, setIsRemoveIssuerModal] = useState<boolean>(false)
    const [isByteCodeModalOpen, setIsByteCodeModalOpen] = useState<boolean>(false);
   const [userId, setUserId] = useState<any>("");
   const [byteid, setbyteid] = useState<any>("");
    const [byteCode, setByteCode] = useState<any>("");
  const [certificateData, setCertificateData] = useState<any>({
    name: "",
    id :"",
    course:"",
  });
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [issuerAddress, setIssuerAddress] = useState<any>("")
  const [resulteState, setResultState] = useState<any>("")
  const [resultModal, setResulteModal] = useState<boolean>(false)
  const [addAdminModalm, setAddAdminModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ensure loading starts fresh
      try {
        console.log("Fetching data...");
        const [certificatesResponse, contactsResponse] = await Promise.all([
          axios.get("/api/certificates"),
          axios.get("/api/contact"),
        ]);
        console.log("Certificates Response:", certificatesResponse.data);
        console.log("Contacts Response:", contactsResponse.data);
        
        setContacts(contactsResponse.data || []);
      } catch (err: any) {
        console.error("Fetch error:", err.message);
        setError("Failed to fetch data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Get the name and value from the input
    setCertificateData({ ...certificateData, [name]: value }); // Update the specific field
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check if any field is empty
    if (!certificateData.name || !certificateData.id || !certificateData.course) {
      toast.error("Please fill all fields.");
      return;
    }
  
    // Create FormData object
    const formData = new FormData();
    formData.append("name", certificateData.name);
    formData.append("id", certificateData.id);
    formData.append("course", certificateData.course);
  
    // Log FormData contents explicitly
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    try {
      // Uncomment this when ready to test API
      // await axios.post("/api/certificates", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      // const certificatesResponse = await axios.get("/api/certificates");
      // setCertificates(certificatesResponse.data || []);
      const gas = await simulateContract(wagmiAdapter.wagmiConfig, {
        address: contract_address,
        abi: contract_abi,
        functionName: "issueCertificate",
        args: [certificateData.name, certificateData.id, certificateData.course],
      });
      
      if(gas){
        const res = await writeContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "issueCertificate",
          args: [certificateData.name, certificateData.id, certificateData.course],
       
        });
        console.log("res", res);

        toast.success("Certificate uploaded successfully!");
        setCertificateData({ name: "", id: "", course: "" }); // Reset all fields to empty strings
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error uploading certificate:", error); // Log the error for debugging
      toast.error("Error uploading certificate.");
    }
  };

  const handleCopyByteCode = () => {
    navigator.clipboard.writeText(byteCode);
    alert("Bytecode copied to clipboard!");
  };

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
        setIsRemoveModalOpen(false);
      } catch (error) {
        console.error("Error fetching bytecode:", error);
        alert("Failed to fetch bytecode. Check console for details.");
      }
    };
 
    const RemoveCertificate = async () => {
      if (!byteid) {
        alert("Please enter a Byte Code");
        return;
      }
  
      try {

        const gas = await simulateContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "revokeCertificate", // Replace with your actual function name
          args: [byteid],
        });
        

       if(gas){
        const result = await writeContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "revokeCertificate", // Replace with your actual function name
          args: [byteid], // Assuming the function takes a user ID as an argument
        });
        console.log("resulte", result)
        
        setResultState("Certificate Revoked Successfully")
        setTimeout(() => {
          setIsRemoveModalOpen(false); 
          setIsByteCodeModalOpen(false);
          setResulteModal(true); 
        }, 4000);
       }

      } catch (error) {
        console.error("Error fetching bytecode:", error);
        alert("Failed to fetch bytecode. Check console for details.");
      }
    };
    const AddIssuer = async () => {
      if (!issuerAddress) {
        alert("Please enter a Address");
        return;
      }
  
      try {

        const gas = await simulateContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "addIssuer", // Replace with your actual function name
          args: [issuerAddress],
        });

       if(gas){
        const result = await writeContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "addIssuer", // Replace with your actual function name
          args: [issuerAddress], // Assuming the function takes a user ID as an argument
        });
        
        console.log("resulte", result)
        setResultState("Issuer Added Successfully")
        setTimeout(() => {
          setIsIssuerModalOpen(false); // Close the current modal (assumed User Details)
          setResulteModal(true); // Open the new success modal
        }, 4000);
       }
      } catch (error) {
        console.error("Error fetching bytecode:", error);
        alert("Maybe you are not allow to Add Issuer");
      }
    };

    const RemoveIssuer = async () => {
      if (!issuerAddress) {
        alert("Please enter a Address");
        return;
      }
  
      try {

        const gas = await simulateContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "removeIssuer", // Replace with your actual function name
          args: [issuerAddress],
        });

       if(gas){
        const result = await writeContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "removeIssuer", // Replace with your actual function name
          args: [issuerAddress], // Assuming the function takes a user ID as an argument
        });
        
        console.log("resulte", result)
        setResultState("Certificate Revoked Successfully")
        setTimeout(() => {
          setIsRemoveIssuerModal(false); // Close the current modal (assumed User Details)
          setResulteModal(true); // Open the new success modal
        }, 4000);
       }
      } catch (error) {
        console.error("Error Occur While Removing Issuer:", error);
        alert("Maybe you are not allow to remove Issuer");
      }
    };

    const AddAdmin = async () => {
      if (!issuerAddress) {
        alert("Please enter a Address");
        return;
      }
  
      try {

        const gas = await simulateContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "addAdmin", // Replace with your actual function name
          args: [issuerAddress],
        });

       if(gas){
        const result = await writeContract(wagmiAdapter.wagmiConfig, {
          address: contract_address,
          abi: contract_abi,
          functionName: "addAdmin", // Replace with your actual function name
          args: [issuerAddress], // Assuming the function takes a user ID as an argument
        });
        
        console.log("resulte", result)
        setResultState("Admin Added Successfully")
        setTimeout(() => {
          setAddAdminModal(false); // Close the current modal (assumed User Details)
          setResulteModal(true); // Open the new success modal
        }, 4000);
       }
      } catch (error) {
        console.error("Error Occur While Adding Admin:", error);
        alert("Maybe you are not allow to Add Admin");
      }
    };
 
 

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-6 mt-12 relative">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">Admin Dashboard</h1>

      <div className="text-center mb-6 flex sm:flex-row flex-col gap-4 items-center justify-center">
        <Button onClick={() => setIsModalOpen(true)}>Add Certificate</Button>
        <Button onClick={() => setIsRemoveModalOpen(true)}>Remove Certificate</Button>
        <Button onClick={() => setIsIssuerModalOpen(true)}>Add Issuer</Button>
        <Button onClick={() => setIsRemoveIssuerModal(true)}>Remove Issuer</Button>
        <Button onClick={() => setAddAdminModal(true)}>Add Admin</Button>
      </div>


      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Add New Certificate</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">User Name</label>
              <input
                type="text"
                name="name"
                value={certificateData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400"
                placeholder="Enter Username"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">User ID</label>
              <input
                type="text"
                name="id"
                value={certificateData.id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400"
                placeholder="Enter User Id"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Course Name</label>
              <input
                type="text"
                name="course"
                value={certificateData.course}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400"
                placeholder="Enter Course name"
                required
              />
            </div>
            {/* <div>
              <label className="block font-semibold mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400"
                required
              />
            </div> */}
            <div className="flex justify-end gap-4">
              <Button  onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal for Viewing Certificate */}
      <Dialog open={isModalOpen && !!selectedCertificate} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Certificate Details</h3>
          {selectedCertificate && (
            <>
              <div className="relative h-64 mb-4">
                <Image
                  src={selectedCertificate.imageUrl}
                  alt={selectedCertificate.name}
                  fill
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <p className="text-white text-center mb-2">
                <strong>Name:</strong> {selectedCertificate.name}
              </p>
              <p className="text-white text-center mb-4">
                <strong>ID:</strong> {selectedCertificate._id}
              </p>
              <div className="flex justify-center">
                <Button onClick={() => setIsModalOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Remove Certificate</h3>
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
      
        </DialogContent>
      </Dialog>

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
              <div className="mb-4 max-w-md mx-auto mt-5">
            <input
              type="text"
              value={byteid}
              onChange={(e) => setbyteid(e.target.value)}
              placeholder="Enter Byte Code"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 audio_font mb-4"
            />
            <button
              onClick={RemoveCertificate}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
            >
              Remove Certificate
            </button>
          
          </div>
            </div>
          </div>
        )}

        
      <Dialog open={isIssuerModalOpen} onOpenChange={setIsIssuerModalOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Add Issuer</h3>
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              value={issuerAddress}
              onChange={(e) => setIssuerAddress(e.target.value)}
              placeholder="Enter Address"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 audio_font mb-4"
            />
            <button
              onClick={AddIssuer}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
            >
             Add Issuer
            </button>
          
          </div>
      
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveIssuerModal} onOpenChange={setIsRemoveIssuerModal}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Add Issuer</h3>
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              value={issuerAddress}
              onChange={(e) => setIssuerAddress(e.target.value)}
              placeholder="Enter Address"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 audio_font mb-4"
            />
            <button
              onClick={RemoveIssuer}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
            >
             Remove Issuer
            </button>
          
          </div>
      
        </DialogContent>
      </Dialog>

      {/* add admin modal */}
      
      <Dialog open={addAdminModalm} onOpenChange={setAddAdminModal}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Add Admin</h3>
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              value={issuerAddress}
              onChange={(e) => setIssuerAddress(e.target.value)}
              placeholder="Enter Address"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 audio_font mb-4"
            />
            <button
              onClick={AddAdmin}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
            >
             Add Admin
            </button>
          
          </div>
      
        </DialogContent>
      </Dialog>

      <Dialog open={resultModal} onOpenChange={setResulteModal}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
        
          <div className="mb-8 max-w-md mx-auto">
           <p className="text-gray text-lg text-center">{resulteState}</p>
            <button
              onClick={() => setResulteModal(false)}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors audio_font"
            >
             Close
            </button>
          
          </div>
      
        </DialogContent>
      </Dialog>


      {/* Certificates Section */}
      {/* <div className="mt-10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Certificates</h2>
        {loading && <p className="text-white text-center">Loading...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {certificates.length > 0 && !loading && !error ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 relative"
              >
                <Card
                  imageSrc={certificate.imageUrl}
                  certificateName={certificate.name}
                  onViewClick={() => handleViewCertificate(certificate)}
                />
                <div className="flex justify-between mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(certificate._id)}
                  >
                    Delete
                  </Button>
                  <Button>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && <p className="text-white text-center">No certificates uploaded yet.</p>
        )}
      </div> */}
      <Certificates/>

      {/* Contacts Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Contact Submissions</h2>
        {loading && <p className="text-white text-center">Loading...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {contacts.length > 0 && !loading && !error ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20"
              >
                <p className="text-white">
                  <strong>Name:</strong> {contact.name}
                </p>
                <p className="text-white">
                  <strong>Email:</strong> {contact.email}
                </p>
                <p className="text-white">
                  <strong>Message:</strong> {contact.message}
                </p>
                <p className="text-white text-sm">
                  <strong>Date:</strong>{" "}
                  {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && <p className="text-white text-center">No contact submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;