"use client";

import { useEffect, useState } from "react";

export default function ScrollStarPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("starPromptClosed");
    if (dismissed) return;

    let triggered = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;

      const scrolledPercent = (scrollTop + windowHeight) / docHeight;

      if (scrolledPercent > 0.6 && !triggered) {
        triggered = true;
        setShow(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 👇 FALLBACK (if user doesn’t scroll)
    const timer = setTimeout(() => {
      if (!triggered) {
        setShow(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    localStorage.setItem("starPromptClosed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="scroll-star-popup">
      <button className="close-btn" onClick={handleClose}>✕</button>

      <p>Enjoying this? Support the project ⭐</p>

      <a
        href="https://github.com/YOUR_USERNAME/devfolio-analyzer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="star-btn">⭐ Star on GitHub</button>
      </a>
    </div>
  );
}