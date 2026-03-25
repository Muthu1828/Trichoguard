"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, ChevronRight, Info } from "lucide-react"

export default function ResultsPage() {
  const [data, setData] = useState<any>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResults")
    const storedImage = sessionStorage.getItem("uploadedImage")
    
    if (!stored) {
      router.push("/predict")
      return
    }

    if (stored) {
      setData(JSON.parse(stored))
    }
    if (storedImage) {
      setImageSrc(storedImage)
    }
  }, [router])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="text-gray-500">Processing your analysis...</p>
      </div>
    )
  }

  const overallScore = data?.metrics?.scalp_health || 0

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-[42px] font-bold text-[#1e293b] flex items-center justify-center gap-3">
            Your <span className="text-[#0d9488]">Analysis Results</span>
          </h1>
          <p className="text-[#64748b] mt-4 max-w-3xl mx-auto text-lg leading-relaxed">
            {data?.final_stage === "Healthy" && "Your hair and scalp are in excellent condition, showing high density and no signs of hair loss. Your healthy lifestyle habits, particularly low stress and no family history of hair loss, are highly protective."}
            {data?.final_stage === "Mild" && "We detected early signs of mild hair loss or scalp stress. Early intervention through lifestyle changes and topical care can easily reverse this."}
            {data?.final_stage === "Moderate" && "Moderate hair loss patterns detected. It's crucial to address the identified lifestyle factors and consider consulting a dermatologist."}
            {data?.final_stage === "Severe" && "Significant hair loss detected. Immediate medical intervention alongside strict lifestyle corrections is strongly advised."}
            {!["Healthy", "Mild", "Moderate", "Severe"].includes(data?.final_stage) && "Analysis complete. Review your metrics below for personalized insights."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* OVERALL SCORE PANEL */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#1e293b] mb-10 text-center">Overall Hair Health Score</h2>
            
            <div className="relative w-64 h-64 mb-10">
              {/* Profile Image Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-40 h-40 rounded-full border-8 border-white overflow-hidden shadow-xl">
                  {imageSrc ? (
                    <Image src={imageSrc} alt="Scalp" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                       <Info className="text-gray-300 w-12 h-12" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  className="stroke-[#f1f5f9] fill-none"
                  strokeWidth="16"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  className="stroke-[#0d9488] fill-none"
                  strokeWidth="16"
                  strokeDasharray="703"
                  strokeDashoffset={703 - (703 * overallScore) / 100}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                />
              </svg>

              {/* Score Text */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-2xl shadow-lg border border-gray-50 flex flex-col items-center z-20">
                <span className="text-4xl font-bold text-[#0d9488]">{overallScore}</span>
                <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider">out of 100</span>
              </div>
            </div>

            <p className="text-[#94a3b8] text-center text-sm px-6 leading-relaxed mt-4">
               {data?.final_stage === "Healthy" ? "Normal, healthy scalp and hair with no visible signs of thinning or scalp conditions." : "Visible indicators impacting overall hair density and health."}
            </p>
          </div>

          {/* DETAILED HEALTH METRICS */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 lg:col-span-2">
             <h2 className="text-xl font-bold text-[#1e293b] mb-10">Detailed Health Metrics</h2>
             
             <div className="space-y-8">
                {[
                  { label: "Scalp Health", value: data?.metrics?.scalp_health || 0, color: "bg-[#2dd4bf]" },
                  { label: "Hair Density", value: data?.metrics?.hair_density || 0, color: "bg-[#2dd4bf]" },
                  { label: "Follicle Strength", value: data?.metrics?.follicle_strength || 0, color: "bg-[#2dd4bf]" },
                  { label: "Oil Balance", value: data?.metrics?.oil_balance || 0, color: "bg-[#2dd4bf]" }
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-3 items-center">
                      <span className="text-[#475569] font-semibold text-lg">{metric.label}</span>
                      <span className="font-bold text-[#1e293b]">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-4 overflow-hidden">
                      <div 
                        className={`${metric.color} h-full rounded-full transition-all duration-1000`} 
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* STAGE ASSESSMENT SECTION */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-12 mb-12">
          <h2 className="text-xl font-bold text-[#1e293b] mb-12 text-center md:text-left">Hair Loss Stage Assessment</h2>
          
          <div className="relative mb-16">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#f1f5f9] -translate-y-1/2 z-0"></div>
            <div className="flex justify-between relative z-10 px-4 md:px-0">
               {[
                 { n: 1, label: "Normal" },
                 { n: 2, label: "Early Signs" },
                 { n: 3, label: "Moderate" },
                 { n: 4, label: "Advanced" },
                 { n: 5, label: "Severe" }
               ].map((s, i) => (
                 <div key={i} className="flex flex-col items-center">
                   <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md transition-all duration-500 ${data?.stage_number === i ? "bg-[#0d9488] text-white scale-125 border-4 border-white" : "bg-[#f1f5f9] text-[#94a3b8]"}`}>
                     {s.n}
                   </div>
                   <span className={`text-sm font-bold ${data?.stage_number === i ? "text-[#0d9488]" : "text-[#94a3b8]"}`}>{s.label}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="text-center py-4 bg-[#f0fdfa] rounded-2xl border border-[#ccfbf1]">
             <p className="text-[#0d9488] font-bold text-lg">
                You are currently at <span className="underline decoration-2 underline-offset-4">Stage {data?.stage_number ?? '?'}: {data?.final_stage || 'Calculating...'}</span>
             </p>
          </div>
        </div>

        {/* RISK & POSITIVE FACTORS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Identified Risk Factors */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10">
             <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-[#fee2e2] rounded-lg">
                 <AlertTriangle className="text-[#ef4444] w-6 h-6" />
               </div>
               <h2 className="text-xl font-bold text-[#1e293b]">Identified Risk Factors</h2>
             </div>

             <div className="space-y-4">
                {data?.reasons?.length > 0 ? data.reasons.map((r: string, i: number) => (
                  <div key={i} className="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#475569] text-sm leading-relaxed">{r}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#fee2e2] text-[#ef4444] text-[10px] font-bold rounded-lg uppercase">Medium</span>
                  </div>
                )) : (
                  <div className="text-center py-10 text-[#94a3b8]">No significant risk factors detected</div>
                )}
             </div>
          </div>

          {/* Positive Factors */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10">
             <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-[#d1fae5] rounded-lg">
                 <CheckCircle2 className="text-[#10b981] w-6 h-6" />
               </div>
               <h2 className="text-xl font-bold text-[#1e293b]">Positive Factors</h2>
             </div>

             <div className="space-y-4">
                {data?.positive_factors?.length > 0 ? data.positive_factors.map((p: string, i: number) => (
                  <div key={i} className="bg-[#f0fdfa] p-5 rounded-2xl border border-[#ccfbf1] flex items-center gap-4">
                    <CheckCircle2 className="text-[#10b981] w-5 h-5 flex-shrink-0" />
                    <p className="text-[#065f46] text-sm font-medium">{p}</p>
                  </div>
                )) : (
                  <div className="text-center py-10 text-[#94a3b8]">Maintain your current habits!</div>
                )}
             </div>
          </div>

        </div>

        {/* CTA BUTTON */}
        <div className="flex justify-center mb-20">
          <Link 
            href="/prevention" 
            className="flex items-center gap-3 bg-gradient-to-r from-[#0d9488] to-[#2563eb] text-white px-10 py-5 rounded-[22px] text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            View Prevention Recommendations
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  )
}
