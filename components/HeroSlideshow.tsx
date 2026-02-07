"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const actionShots = [
  "/action_shot_1.jpg",
  "/action_shot_2.jpg",
  "/action_shot_3.jpg",
  "/action_shot_4.jpg",
  "/action_shot_5.jpg",
];

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % actionShots.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={actionShots[currentIndex]}
            alt={`Shadow Basketball Action Shot ${currentIndex + 1}`}
            fill
            className="object-cover object-top"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
