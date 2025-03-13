"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CardProps {
  imageSrc: string; // Prop for the certificate image (consider typing this as string for better type safety)
  certificateName: string; // Prop for the certificate name (consider typing this as string)
  onViewClick: () => void; // Prop for handling the view button click
}

const Card: React.FC<CardProps> = ({ imageSrc, certificateName, onViewClick }) => {
  // Custom animation variants (using bounce effect)
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.7,
        bounce: 0.3,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Button animation variants
  const buttonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#00ccbb",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="w-80 h-[400px] bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      {/* Certificate Image */}
      <div className="w-full h-2/3 relative">
        <Image
          src={imageSrc}
          alt={certificateName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Certificate Name */}
      <div className="w-full h-1/6 flex items-center justify-center p-4">
        <h3 className="text-xl font-bold text-white drop-shadow-md audio_font">
          {certificateName}
        </h3>
      </div>

      {/* View Certificate Button */}
      <div className="w-full h-1/6 flex items-center justify-center p-4">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={onViewClick} // Attach the onViewClick handler
          className="w-full max-w-xs px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-colors duration-300 audio_font"
        >
          View Certificate
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Card;