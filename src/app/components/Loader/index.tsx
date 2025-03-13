// /src/app/components/Loader.tsx
"use client";

import { motion, Variants } from "framer-motion";

const Loader = () => {
  // Variants for letters coming from random directions
  const letterVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.5, // Slower for smoothness
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  // Define initial random positions for each letter of "Dapp Portal"
  const letters = "Dapp Portal".split("");
  const initialPositions = letters.map(() => ({
    x: (Math.random() - 0.5) * 1000, // Random x between -500 and 500
    y: (Math.random() - 0.5) * 1000, // Random y between -500 and 500
  }));

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* "Dapp Portal" Letters */}
      <motion.div
        className="flex space-x-1 text-white text-2xl font-bold"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } }, // Stagger letters for smoothness
          exit: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            initial={{
              x: initialPositions[index].x,
              y: initialPositions[index].y,
            }}
            animate="animate"
            exit="exit"
            className="audio_font"
          >
            {letter === " " ? "\u00A0" : letter} {/* Handle space */}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Loader;