"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

const ChatGreeting = () => {
  const GREETING_KEYWORDS = [
    `Welcome User!`,
    "What do you want to know?",
    "How can I help you today?",
  ];

  const [currentKeywordIndex, setCurrentKeywordIndex] = useState<number>(0);

  const updateKeywordIndex = useCallback(() => {
    setCurrentKeywordIndex(
      (prevIndex) => (prevIndex + 1) % GREETING_KEYWORDS.length
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updateKeywordIndex, 3500);
    return () => clearInterval(interval);
  }, [updateKeywordIndex]);

  return (
    <div className="flex flex-col items-center gap-8 -mt-10">
      <div className="w-20 h-20 rounded-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.5 }}
          animate={{ scale: 1.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1 }}
        >
          <Image
            src="/star.gif"
            alt="Star"
            width={100}
            height={100}
            // loading="eager"
            // priority
            className="w-full h-full mix-blend-overlay"
            style={{ mixBlendMode: "luminosity" }}
          />
        </motion.div>
      </div>

      <div className="flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentKeywordIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              {GREETING_KEYWORDS[currentKeywordIndex]}
            </h1>
          </motion.span>
        </AnimatePresence>
        <p className="text-gray-500 mt-2">
          Let AI handle your daily tasks and simplify your workday.
        </p>
      </div>
    </div>
  );
};

export default ChatGreeting;
