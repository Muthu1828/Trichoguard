"use client"

import { useEffect } from "react"

export default function ApiWarmer() {
  useEffect(() => {
    // 1. Define possible API URLs (Racing Candidates)
    const candidates = [
      "https://trichoguard.onrender.com",
      "https://trichoguard-1.onrender.com",
      "http://127.0.0.1:8004"
    ];

    // 2. Fire-and-forget 'Wake Up' signals (HEAD requests)
    // We do this immediately on every page load to 'thaw' the Render free tier.
    console.log("DEBUG: Global API Warmer initiated...");
    
    candidates.forEach(url => {
      fetch(url, { 
        method: "HEAD", 
        mode: "no-cors", 
        credentials: "omit" 
      }).catch(() => {
        // Silently fail as this is just a wake-up signal
      });
    });

    // 3. Optional: Proactive GET to trigger model loading early
    const warmUp = async () => {
      // Just hit one of the production ones to start the heavy TensorFlow load
      try {
        await fetch(candidates[0], { method: "GET", mode: "no-cors" });
      } catch (e) {}
    }
    
    // Delayed warm up to not block initial page render
    const timer = setTimeout(warmUp, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null; // Invisible global component
}
