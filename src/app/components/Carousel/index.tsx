"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import image1 from "@/assets/image1.jpg";
import image2 from "@/assets/image2.jpg";


// Carousel data with images and achievement-themed text
const carouselItems = [
  {
    id: 1,
    image: image1,
    text: "Earn Your Certificate",
  },
  {
    id: 2,
    image: image2,
    text: "Celebrate Your Success",
  },

];

// Carousel component
const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [carouselItems]);

  // Typing animation variants
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Letter animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Get the current text based on activeIndex
  const currentText = carouselItems[activeIndex].text;
  const letters = currentText.split("");

  return (
    <div className="w-full py-10 bg-gradient-to-r from-cyan-500 to-blue-500" id="home">
      <div className="max-w-7xl mx-auto px-4">
        {/* Responsive Flex Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
          {/* Left Side - Typing Text */}
          <motion.div
            className="w-full md:w-1/2 flex items-center justify-center"
            key={activeIndex}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={textVariants}
          >
            <div className="text-center">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg audio_font"
                >
                  {letter}
                </motion.span>
              ))}
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  transition: {
                    duration: 0.7,
                    repeat: Infinity,
                  },
                }}
                className="w-1 h-8 sm:h-10 md:h-12 bg-white inline-block ml-1"
              />
            </div>
          </motion.div>

          {/* Right Side - 3D Circular Carousel */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
              {carouselItems.map((item, index) => {
                const totalItems = carouselItems.length;
                const angleStep = 360 / totalItems;
                const angle = angleStep * (index - activeIndex);
                const radius = 100; // Base radius, adjustable
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius * 0.3;

                const isActive = index === activeIndex;
                const rotateY = isActive ? 0 : angle * 0.3;
                const scale = isActive ? 1.2 : 0.7;
                const opacity = isActive ? 1 : 0.5;
                const zIndex = isActive ? 20 : Math.round(10 - Math.abs(y));

                return (
                  <motion.div
                    key={item.id}
                    className="absolute w-32 sm:w-40 md:w-48 h-48 sm:h-56 md:h-64 rounded-xl shadow-2xl transform perspective-1000 overflow-hidden"
                    style={{
                      transform: `translate(${x}px, ${y}px) rotateY(${rotateY}deg)`,
                      zIndex: zIndex,
                      transition: "all 0.6s ease-out",
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      scale: scale,
                      opacity: opacity,
                      rotateY: rotateY,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.text}
                      fill
                      className="object-cover rounded-xl"
                      priority
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;