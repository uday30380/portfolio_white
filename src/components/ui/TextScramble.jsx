import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * TextScramble component
 * Cycles through random glyphs before resolving to original text when scrolled into view.
 */
const TextScramble = ({
  text,
  className = "",
  as = 'span',
  speed = 30,
  scrambleDuration = 600,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    let frame = 0;
    const totalFrames = Math.max(12, Math.floor(scrambleDuration / speed));
    const chars = text.split('');

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      const scrambled = chars.map((char, index) => {
        if (char === ' ') return ' ';
        // Resolve letters progressively from left to right as progress increases
        if (index / chars.length < progress) {
          return char;
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      setDisplayText(scrambled);

      if (frame >= totalFrames) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, text, speed, scrambleDuration]);

  return React.createElement(as, { ref, className }, displayText);
};

export default TextScramble;
