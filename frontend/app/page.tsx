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
    <main className="min-h-screen bg-slate-50 relative overflow-x-hidden pt-20 pb-20">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed left-0 top-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-10%] top-[20%] w-[600px] h-[600px] bg-sky-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute right-[-10%] bottom-[20%] w-[600px] h-[600px] bg-teal-200/30 blur-[120px] rounded-full"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 md:px-12 py-20 min-h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 max-w-7xl w-full">
          <div>
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-teal-600 bg-teal-100 rounded-full">
              AI-POWERED DERMATOLOGICAL INTELLIGENCE
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight">
              Predict & <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Prevent Hair Loss
              </span> <br /> 
              Before It Starts
            </h1>

            <p className="mt-8 text-slate-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              TrichoGuard uses specialized deep learning to provide early detection, 
              personalized prevention strategies, and a path to hair confidence.
            </p>

            <div className="mt-12 flex gap-6 flex-wrap">
              <Link
                href="/predict"
                className="px-10 py-5 rounded-3xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold shadow-2xl shadow-teal-300/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Scan My Scalp Now →
              </Link>

              <button 
                onClick={scrollToHowItWorks}
                className="px-10 py-5 rounded-3xl border-2 border-slate-200 text-slate-800 font-bold hover:bg-white hover:border-teal-500 hover:text-teal-600 hover:shadow-lg transition-all duration-300"
              >
                Explore Technology
              </button>
            </div>
          </div>

          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] scale-150 animate-pulse"></div>
            <FuturisticOrb />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section ref={howItWorksRef} className="relative z-10 px-6 py-32 bg-white/60 backdrop-blur-xl border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">How TrichoGuard Works</h2>
            <div className="w-24 h-2 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full"></div>
            <p className="mt-8 text-slate-500 max-w-2xl mx-auto text-lg">
              Our system combines advanced visual analysis with lifestyle data to create 
              the world's most accessible hair health assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="group p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-teal-100 transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[30px] bg-slate-50 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:bg-teal-50 transition-all duration-500">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEDICAL PRECAUTIONS & DISCLAIMER */}
      <footer className="relative z-10 px-6 py-24 bg-gradient-to-b from-slate-50 to-slate-200 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl border border-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">⚠️</div>
              <h2 className="text-3xl font-black text-slate-900">Medical Precautions & Guidelines</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Non-Diagnostic Service</h4>
                  <p>TrichoGuard is an AI-powered screening tool, not a professional medical diagnosis. Results should be interpreted as general health guidance.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Professional Consultation</h4>
                  <p>Consult a certified dermatologist or trichologist before starting any medical treatments (e.g., Minoxidil, Finasteride) suggested by the AI.</p>
                </div>
              </div>

              <div className="space-y-6 border-l border-slate-100 pl-0 md:pl-12">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Image Reliability</h4>
                  <p>Prediction accuracy is heavily dependent on image quality, lighting, and clearing hair away from the scalp surface during analysis.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Emergency Disclaimer</h4>
                  <p>If you experience sudden, painful, or scarring hair loss, please seek immediate medical attention from a clinic.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black text-lg">T</div>
                <span className="font-black text-xl tracking-tight text-slate-900">TrichoGuard <span className="text-teal-500 font-medium text-sm ml-1">AI</span></span>
              </div>
              <p className="text-sm font-medium text-slate-400">© 2026 TrichoGuard Intelligence Unit. Built for Early Detection.</p>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}