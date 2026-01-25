"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    }, 20000); // Change every 20 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {actionShots.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Shadow Basketball Action Shot ${index + 1}`}
            fill
            className="object-cover object-top"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
