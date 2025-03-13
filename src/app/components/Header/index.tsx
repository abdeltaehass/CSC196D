"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MenuData } from "@/app/data"; // Adjust path if necessary
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, usePathname } from "next/navigation";
import '@reown/appkit-wallet-button/react'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleRouter = ()=>{
    router.push("/");
  }

  

  // Animation variants for the header
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    scrolled: {
      opacity: 0.9,
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      y: 10,
      transition: { duration: 0.3 },
    },
  };

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
    hover: { scale: 1.1, color: "#ffffff", transition: { duration: 0.2 } },
  };

  // Animation variants for the connect wallet button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.4 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  // RGB bor

  

  // Handle scroll to section
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle scroll event to detect scrolling and apply glassy effect
  useEffect(() => {
    const handleScrollEvent = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate={isScrolled ? "scrolled" : "visible"}
      className="flex w-full h-[60px] bg-gradient-to-r from-cyan-500 to-blue-500 items-center justify-between px-5 fixed top-0 z-50 transition-all duration-300"
    >
      {/* Logo */}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white audio_font text-2xl cursor-pointer"
        onClick={handleRouter}
      >
        DappPortal
      </motion.span>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <motion.button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isMobileMenuOpen ? (
            <CloseIcon fontSize="large" />
          ) : (
            <MenuIcon fontSize="large" />
          )}
        </motion.button>
      </div>

      {/* Desktop Menu and Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } md:flex md:items-center md:justify-center md:flex-1 absolute md:static top-[60px] left-0 w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 md:bg-transparent p-4 md:p-0 md:flex-row flex-col gap-4 md:gap-4 z-40 transition-all duration-300`}
      >
        {MenuData.map((item, index) => (
          <motion.a
            key={item.id}
            href={pathname === "/admin" || pathname === "/admin/dashboard" ? "/" : item.url}
            custom={index}
            variants={menuItemVariants}
            initial="hidden"
            animate="visible" // Always visible on desktop, only hidden on mobile when menu is closed
            whileHover="hover"
            onClick={(e) => handleScroll(e, item.id)}
            className="text-white hover:text-gray-200 transition-colors cursor-pointer monstrate_font text-lg md:text-base"
          >
            {item.title}
          </motion.a>
        ))}
        {/* Connect Wallet Button Inside Mobile Menu */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="md:hidden" // Show only on mobile inside the menu
        >
          {/* <motion.button
            variants={rgbBorderVariants}
            animate="animate"
            className="audio_font text-white px-4 py-2 rounded-full bg-transparent border-2 w-full text-center"
            whileHover="hover"
          >
            <motion.span variants={textVariants} initial="initial">
              Connect Wallet
            </motion.span>
          </motion.button> */}
          <appkit-button />
        </motion.div>
      </div>

      {/* Connect Wallet Button on Right for Desktop */}
      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="hidden md:block" // Show only on desktop
      >
        {/* <motion.button
          variants={rgbBorderVariants}
          animate="animate"
          className="audio_font text-white px-4 py-2 rounded-full bg-transparent border-2"
          whileHover="hover"
        >
          <motion.span variants={textVariants} initial="initial">
            Connect Wallet
          </motion.span>
        </motion.button> */}
         <appkit-button />
      </motion.div>
    </motion.div>
  );
};

export default Header;