"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner"; // Import toast for notifications
import { Dialog, DialogContent } from "@/components/ui/dialog"; // ShadCN Modal
import { Button } from "@/components/ui/button"; // ShadCN Button

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
  },
};

// Animation variants for form elements
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Animation for the <hr>
const hrVariants = {
  hidden: { width: "0%" },
  visible: {
    width: "50%",
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

// Button animation
const buttonVariants = {
  hover: {
    scale: 1.1,
    backgroundColor: "#00ccbb",
    transition: { type: "tween", duration: 0.3, ease: "easeOut" },
  },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/contact", formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setIsModalOpen(true); // Open modal on success
    } catch (error) {
      console.log("error", error)
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact" // ID for navigation
      className="w-full py-14 bg-gradient-to-r from-cyan-500 to-blue-500"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Animated HR */}
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
          {/* Heading */}
          <motion.h2
            variants={childVariants}
            className="text-5xl font-extrabold text-white drop-shadow-lg audio_font mb-6"
          >
            Contact Us
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={childVariants}
            className="text-lg text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Have questions or need support? Reach out to us, and we’ll get back
            to you as soon as possible!
          </motion.p>

          {/* Contact Form */}
          <motion.div
            variants={childVariants}
            className="max-w-lg mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-white/90 font-semibold mb-2 audio_font"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-white/90 font-semibold mb-2 audio_font"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-white/90 font-semibold mb-2 audio_font"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-lg border border-white/30 focus:outline-none focus:border-cyan-400 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                variants={buttonVariants}
                whileHover="hover"
                className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-colors duration-300 audio_font"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Success Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-center">Thank You!</h3>
            <p className="text-center mb-4">Your message has been sent successfully. We will get back to you soon!</p>
            <div className="flex justify-center">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Contact;