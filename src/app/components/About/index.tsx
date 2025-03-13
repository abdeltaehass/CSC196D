"use client";

import React from "react";
import { motion } from "framer-motion";

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Animation variants for staggered children
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
    width: "50%", // Expands to 50% of the container width
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const About = () => {
  return (
    <section
      id="about"
      className="w-full py-16 bg-gradient-to-r from-cyan-500 to-blue-500" // Same gradient as Carousel
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
          <motion.h2
            variants={childVariants}
            className="text-5xl font-extrabold text-white drop-shadow-lg audio_font mb-6"
          >
            About Us
          </motion.h2>
          <motion.p
            variants={childVariants}
            className="text-lg text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            At DappPortal, we&apos;re passionate about technology. Our mission is to
            bridge the gap between traditional systems and the future of
            blockchain, providing secure, transparent, and innovative solutions.
            Whether you're earning a certificate, celebrating success, or
            unlocking new achievements, we&apos;re here to support your journey with
            cutting-edge DApps.
          </motion.p>
          <motion.div
            variants={childVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-white audio_font mb-3">Innovation</h3>
              <p className="text-white/80">We push boundaries with decentralized technology.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-white audio_font mb-3">Transparency</h3>
              <p className="text-white/80">Trust and openness define our blockchain solutions.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-white audio_font mb-3">Empowerment</h3>
              <p className="text-white/80">We empower users with accessible DApps.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;