"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Farming3DBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-background">
      <motion.div
        className="absolute w-[28rem] h-[28rem] rounded-full bg-gradient-to-r from-green-400 to-lime-600 opacity-30 blur-3xl"
        animate={{
          x: [0, 150, -150, 0],
          y: [0, -150, 150, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-yellow-400 to-green-500 opacity-30 blur-2xl"
        animate={{
          x: [100, -120, 80, 0],
          y: [-80, 120, -120, 0],
          scale: [1.1, 1.4, 1.2],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 opacity-30 blur-2xl"
        animate={{
          x: [-120, 120, -80, 0],
          y: [100, -100, 150, 0],
          scale: [1, 1.2, 1.4, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
