"use client"

import { Brain, HeartPulse, TrendingUp, Activity } from "lucide-react"
import { useEffect, useRef } from "react"

export default function FuturisticOrb() {
  const orbRef = useRef<HTMLDivElement>(null)

  // 3D Tilt Effect (ONLY center orb tilts)
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!orbRef.current) return
      const { clientX, clientY } = e
      const x = (window.innerWidth / 2 - clientX) / 60 // Slightly reduced sensitivity
      const y = (window.innerHeight / 2 - clientY) / 60
      orbRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
    }

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  return (
    <div className="relative w-full aspect-square flex items-center justify-center max-w-[520px] mx-auto">

      {/* PARTICLES */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="w-[1.5%] h-[1.5%] bg-teal-300 rounded-full absolute top-[15%] left-[15%] animate-ping opacity-50" />
        <div className="w-[1.5%] h-[1.5%] bg-blue-300 rounded-full absolute bottom-[25%] right-[20%] animate-pulse opacity-50" />
      </div>

      {/* ORBIT LINES */}
      <div className="absolute w-full h-full">
        <svg viewBox="0 0 520 520" className="w-full h-full opacity-20">
          <circle cx="260" cy="260" r="200" stroke="currentColor" strokeWidth="1" fill="none" className="text-slate-400" />
          <circle cx="260" cy="260" r="150" stroke="currentColor" strokeWidth="1" fill="none" className="text-slate-400" />
        </svg>
      </div>

      {/* ORBITING ICONS (RELATIVE TO CONTAINER) */}
      <div className="absolute w-[80%] h-[80%] animate-orbit">

        {/* TOP */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="animate-counter-orbit bg-white shadow-lg p-[10%] rounded-full">
            <Brain className="w-[1.2em] h-[1.2em] text-purple-500" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="animate-counter-orbit bg-white shadow-lg p-[10%] rounded-full">
            <TrendingUp className="w-[1.2em] h-[1.2em] text-green-500" />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
          <div className="animate-counter-orbit bg-white shadow-lg p-[10%] rounded-full">
            <HeartPulse className="w-[1.2em] h-[1.2em] text-red-400" />
          </div>
        </div>

        {/* LEFT */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <div className="animate-counter-orbit bg-white shadow-lg p-[10%] rounded-full">
            <Activity className="w-[1.2em] h-[1.2em] text-blue-500" />
          </div>
        </div>

      </div>

      {/* CENTER GLOW */}
      <div className="absolute w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-400 to-teal-400 blur-[20%] opacity-30" />

      {/* MAIN ORB */}
      <div
        ref={orbRef}
        className="absolute w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-2xl transition-transform duration-200"
      >
        <div className="w-[85%] h-[85%] rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center relative overflow-hidden">

          {/* LIGHT SWEEP */}
          <div className="absolute w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent rotate-45 animate-sweep" />

          {/* REALISTIC HAIR ANIMATION */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-8"
            >
              <defs>
                <linearGradient id="hairStrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                
                <radialGradient id="bulbGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>

                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Multiple strands for realism */}
              <g className="animate-hair-sway">
                {/* Main Strand */}
                <path
                  d="M50 80 C 45 60, 60 40, 50 15"
                  stroke="url(#hairStrandGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#softGlow)"
                  className="opacity-90"
                />
                {/* Side Strand Left */}
                <path
                  d="M48 78 C 40 55, 50 35, 45 20"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-hair-sway-alt"
                />
                {/* Side Strand Right */}
                <path
                  d="M52 78 C 60 55, 55 35, 58 25"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-hair-sway-delayed"
                />
              </g>

              {/* Root Bulb with pulsing effect */}
              <circle
                cx="50"
                cy="82"
                r="8"
                fill="url(#bulbGrad)"
                className="animate-pulse shadow-2xl"
                style={{ animationDuration: '3s' }}
              />
              <circle
                cx="50"
                cy="82"
                r="12"
                fill="rgba(0, 0, 0, 0.15)"
                className="animate-ping"
                style={{ animationDuration: '4s' }}
              />
            </svg>

            <style jsx>{`
              @keyframes hair-sway {
                0%, 100% { transform: rotate(-2deg) translateX(0); }
                50% { transform: rotate(3deg) translateX(3px); }
              }
              @keyframes hair-sway-alt {
                0%, 100% { transform: rotate(1deg) translateX(0); }
                50% { transform: rotate(-2deg) translateX(-2px); }
              }
              .animate-hair-sway {
                animation: hair-sway 6s ease-in-out infinite;
                transform-origin: 50% 80%;
              }
              .animate-hair-sway-alt {
                animation: hair-sway-alt 8s ease-in-out infinite;
                transform-origin: 50% 80%;
              }
              .animate-hair-sway-delayed {
                animation: hair-sway 7s ease-in-out infinite reverse;
                transform-origin: 50% 80%;
                opacity: 0.5;
              }
            `}</style>
          </div>
        </div>
      </div>

    </div>
  )
}