"use client"
import FuturisticOrb from "../components/FuturisticOrb"
import Link from "next/link"
import { useRef } from "react"

export default function Home() {
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const steps = [
    {
      title: "Snapshot & Scan",
      desc: "Upload a clear image of your scalp. Our AI identifies follicle density and patterns.",
      icon: "📸"
    },
    {
      title: "Lifestyle Analysis",
      desc: "Answer brief questions about your habits, stress, and family history for a deeper look.",
      icon: "📝"
    },
    {
      title: "Intelligent Synthesis",
      desc: "Wait a few seconds while our deep learning models fuse your data into a clear health score.",
      icon: "🧠"
    },
    {
      title: "Actionable Plan",
      desc: "Receive a specialized hair growth journey with medical-grade prevention tips.",
      icon: "🚀"
    }
  ]

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-x-hidden pt-4 md:pt-20 pb-12 md:pb-20">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed left-0 top-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-10%] top-[20%] w-[600px] h-[600px] bg-sky-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute right-[-10%] bottom-[20%] w-[600px] h-[600px] bg-teal-200/30 blur-[120px] rounded-full"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 md:px-12 pt-2 md:pt-20 pb-12 md:pb-20 min-h-[50vh] md:min-h-[90vh] overflow-hidden">
        <div className="flex flex-row items-center justify-between gap-4 sm:gap-10 md:gap-16 max-w-7xl w-full">
          
          {/* TEXT CONTENT - FLUID TYPOGRAPHY */}
          <div className="flex-[1.5] sm:flex-1 text-left z-20">
            <div className="inline-block px-3 py-1 mb-2 md:mb-4 text-[clamp(0.6rem,1.5vw,0.875rem)] font-bold tracking-[0.2em] text-teal-600 bg-teal-100/80 rounded-full backdrop-blur-sm uppercase">
              AI-Powered Scalp InteligencE
            </div>
            <h1 className="text-[clamp(1.5rem,5vw,4.5rem)] font-black leading-[1.05] text-slate-900 tracking-tighter">
              Predict & <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Prevent Hair Loss
              </span> <br /> 
              Before It Starts
            </h1>

            <p className="mt-3 md:mt-8 text-slate-600 text-[clamp(0.75rem,2vw,1.25rem)] max-w-lg leading-relaxed font-medium opacity-90">
              Specialized deep learning for early detection and personalized prevention strategies.
            </p>

            <div className="mt-6 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-6 w-full sm:w-auto">
              <Link
                href="/predict"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl md:rounded-3xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold shadow-xl shadow-teal-300/20 hover:scale-105 active:scale-95 transition-all duration-300 text-center text-sm md:text-base"
              >
                Scan Now →
              </Link>

              <button 
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl md:rounded-3xl border-2 border-slate-200 text-slate-800 font-bold hover:bg-white hover:border-teal-500 hover:text-teal-600 hover:shadow-lg transition-all duration-300 text-center text-sm md:text-base"
              >
                Explore Tech
              </button>
            </div>
          </div>

          {/* FLUID ORB - NO MORE SCALE TRANSFORMS */}
          <div className="flex-1 relative flex justify-center items-center py-2 md:py-4">
            <div className="absolute inset-0 bg-blue-500/10 blur-[clamp(20px,8vw,80px)] scale-150 animate-pulse"></div>
            <div className="w-full max-w-[520px]">
              <FuturisticOrb />
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section ref={howItWorksRef} className="relative z-10 py-16 md:py-32 bg-white/60 backdrop-blur-xl border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-black text-slate-900 mb-4 md:mb-6 leading-tight">How TrichoGuard Works</h2>
            <div className="w-16 md:w-24 h-1.5 md:h-2 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 md:mt-8 text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Our system combines advanced visual analysis with lifestyle data to create 
              the world's most accessible hair health assistant.
            </p>
          </div>

          <div className="flex lg:grid lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 -mx-6 px-6 snap-x snap-mandatory no-scrollbar">
            {steps.map((step, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center group p-6 md:p-8 rounded-[30px] md:rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-teal-100 transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[30px] bg-slate-50 flex items-center justify-center text-3xl md:text-4xl mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-teal-50 transition-all duration-500">
                  {step.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">{step.title}</h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE TRICHOGUARD */}
      <section className="relative z-10 px-6 py-20 md:py-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            
            <div className="space-y-6 md:space-y-10">
              <div className="inline-block px-4 py-2 text-xs font-bold tracking-widest text-blue-600 bg-blue-50 rounded-full uppercase">
                The Science of Prevention
              </div>
              <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-black text-slate-900 leading-[1.1]">
                Why Choose <br />
                <span className="text-teal-600">TrichoGuard?</span>
              </h2>
              <p className="text-slate-600 text-lg md:text-xl max-w-xl leading-relaxed">
                Existing solutions only treat hair loss when it's visible. We use AI vision to catch changes before you notice them.
              </p>
              
              <div className="space-y-6 pt-4">
                {[
                  { t: "See the Invisible", d: "Detect hair thinning patterns months before they become visible to the human eye.", i: "🔬" },
                  { t: "Tailored to You", d: "Get advice that actually works because it's based on your sleep, stress, and unique habits.", i: "📱" },
                  { t: "Stop the Guesswork", d: "Stop worrying and start acting with a clear, medically-backed preservation roadmap.", i: "🌱" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 md:gap-6 group">
                    <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl md:text-2xl group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                      {item.i}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 md:text-lg">{item.t}</h4>
                      <p className="text-slate-500 text-sm md:text-base">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-teal-200/20 blur-[100px] rounded-full scale-125 animate-pulse"></div>
              <div className="relative bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-white">
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                    <span className="text-slate-400 font-medium font-mono text-sm tracking-tighter">AI_HAIR_ANALYZER_v1.0</span>
                    <div className="px-3 py-1 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full animate-pulse uppercase tracking-wider">SCANNING_ACCURACY_STABLE</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[88%] bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>FOLLICLE DENSITY ACCURACY</span>
                      <span className="text-teal-600">92.4%</span>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>EARLY SIGNAL DETECTION</span>
                      <span className="text-teal-600">94.1%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <p className="text-slate-400 text-xs font-mono leading-relaxed">
                      [OK] SYNCING_LIFESTYLE_DATA... <br />
                      [OK] ANALYZING_FOLLICLE_HEALTH... <br />
                      [OK] GENERATING_ACTION_PLAN... <br />
                      [OK] SYSTEM_OPTIMIZED
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MEDICAL PRECAUTIONS & DISCLAIMER */}
      <footer className="relative z-10 px-4 md:px-6 py-16 md:py-24 bg-gradient-to-b from-slate-50 to-slate-200 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[30px] md:rounded-[40px] p-8 md:p-16 shadow-2xl border border-white">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-100 flex items-center justify-center text-xl md:text-2xl">⚠️</div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">Medical Precautions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-slate-600 text-sm md:text-base">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 md:mb-2">Non-Diagnostic Service</h4>
                  <p>TrichoGuard is an AI-powered screening tool, not a medical diagnosis. Interpret results as general health guidance only.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 md:mb-2">Professional Consultation</h4>
                  <p>Consult a certified dermatologist before starting any medical treatments (e.g., Minoxidil) suggested by the AI.</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 pl-0 md:pl-12">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 md:mb-2">Image Reliability</h4>
                  <p>Accuracy depends on lighting and clearing hair away from the scalp surface during analysis.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 md:mb-2">Emergency Disclaimer</h4>
                  <p>If you experience sudden or painful hair loss, seek immediate medical attention from a clinic.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-500 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-base md:text-lg">T</div>
                <span className="font-black text-lg md:text-xl tracking-tight text-slate-900">TrichoGuard <span className="text-teal-500 font-medium text-xs ml-0.5">AI</span></span>
              </div>
              <p className="text-[10px] md:text-sm font-medium text-slate-400 text-center md:text-left">© 2026 TrichoGuard Intelligence Unit. Built for Early Detection.</p>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}