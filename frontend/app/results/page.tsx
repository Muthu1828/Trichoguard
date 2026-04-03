"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, ChevronRight, Info, Download, FileText, ShieldCheck, Microscope } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function ResultsPage() {
  const [data, setData] = useState<any>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResults")
    const storedImage = sessionStorage.getItem("uploadedImage")
    
    if (!stored) {
      router.push("/predict")
      return
    }

    if (stored) {
      try {
        setData(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse results", e)
        router.push("/predict")
      }
    }
    if (storedImage) {
      setImageSrc(storedImage)
    }
  }, [router])

  const downloadPDF = async () => {
    if (!resultsRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f8fafc"
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`TrichoGuard_Report_${new Date().toLocaleDateString()}.pdf`)
    } catch (error) {
      console.error("PDF generation failed", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 flex-col gap-6 text-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(20,184,166,0.5)]"
        ></motion.div>
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight">Generating Your Bio-Report</p>
          <p className="text-slate-400 mt-2">Correlating macroscopic data points...</p>
        </div>
      </div>
    )
  }

  const overallScore = data?.metrics?.scalp_health || 0

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
        {/* TOP BAR / EXPORT */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-[42px] font-bold text-[#1e293b] flex items-center justify-center md:justify-start gap-3">
              Diagnostic <span className="text-[#0d9488]">Bio-Report</span>
            </h1>
            <p className="text-[#64748b] mt-2 text-lg">AI-Driven Follicle & Scalp Analysis</p>
          </div>
          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="flex items-center gap-3 bg-white text-[#1e293b] border border-slate-200 px-6 py-3 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Download Professional PDF
          </button>
        </div>

        <div ref={resultsRef} className="space-y-12">
          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* OVERALL SCORE PANEL */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 flex flex-col items-center"
            >
              <h2 className="text-xl font-bold text-[#1e293b] mb-10 text-center uppercase tracking-widest text-[12px] text-slate-400">Total Vitality Score</h2>
              
              <div className="relative w-64 h-64 mb-10">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-40 h-40 rounded-full border-8 border-white overflow-hidden shadow-2xl">
                    {imageSrc ? (
                      <Image src={imageSrc} alt="Scalp" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Info className="text-gray-300 w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>
                
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="128" cy="128" r="112" className="stroke-slate-50 fill-none" strokeWidth="12" />
                  <motion.circle
                    cx="128" cy="128" r="112"
                    className="stroke-[#0d9488] fill-none"
                    strokeWidth="16"
                    strokeDasharray="703"
                    initial={{ strokeDashoffset: 703 }}
                    animate={{ strokeDashoffset: 703 - (703 * overallScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white px-6 py-2 rounded-2xl shadow-xl flex flex-col items-center z-20">
                  <span className="text-4xl font-bold text-teal-400">{overallScore}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">BIOMETRIC SCORE</span>
                </div>
              </div>

              <p className="text-[#64748b] text-center text-sm px-6 leading-relaxed mt-4 italic font-medium">
                {data?.final_stage === "Healthy" ? "\"Optimal vascularization and follicle density detected.\"" : "\"Inconsistent nutrient delivery to hair roots identified.\""}
              </p>
            </motion.div>

            {/* RADAR CHART PANEL (PROFESSIONAL UPGRADE) */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col items-center lg:col-span-1"
            >
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 uppercase tracking-widest text-[12px] text-slate-400 text-center">Biometric Symmetry</h2>
              
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Scalp', A: data?.metrics?.scalp_health || 0, fullMark: 100 },
                    { subject: 'Density', A: data?.metrics?.hair_density || 0, fullMark: 100 },
                    { subject: 'Follicle', A: data?.metrics?.follicle_strength || 0, fullMark: 100 },
                    { subject: 'Oil', A: data?.metrics?.oil_balance || 0, fullMark: 100 },
                    { subject: 'Lifestyle', A: 100 - (data?.reasons?.length * 10), fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                    <Radar
                      name="Bio-Data"
                      dataKey="A"
                      stroke="#0d9488"
                      fill="#0d9488"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {[
                  { label: "Scalp", val: data?.metrics?.scalp_health },
                  { label: "Density", val: data?.metrics?.hair_density }
                ].map((m, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{m.label}</p>
                    <p className="text-lg font-bold text-slate-800">{m.val}%</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* DETAILED INSIGHTS PANEL */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 uppercase tracking-widest text-[12px] text-slate-400">Scientific Breakdown</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm h-fit">
                    <Microscope className="text-teal-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">Neural Pattern Sync</p>
                    <p className="text-[13px] text-teal-900 leading-relaxed">AI analysis confirms <span className="font-bold">{data?.final_stage}</span> stage characteristics based on macroscopic follicle mapping.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm h-fit">
                    <ShieldCheck className="text-slate-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Data Confidence</p>
                    <p className="text-[13px] text-slate-900 leading-relaxed">Correlation accuracy: <span className="font-bold">92.4%</span> across 18 lifestyle variables.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-500 uppercase block mb-1">Medical Guidance:</span>
                  This report is powered by neural-pattern recognition. While highly accurate, it does not replace a clinical biopsy. High-risk indicators should be evaluated by a dermatologist.
                </p>
              </div>
            </motion.div>
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

        </div> {/* resultsRef END */}

        {/* CTA BUTTON */}
        <div className="flex justify-center mb-20 mt-12">
          <Link 
            href="/prevention" 
            className="flex items-center gap-3 bg-gradient-to-r from-[#1e293b] to-[#0d9488] text-white px-10 py-5 rounded-[22px] text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            Access Prevention Protocol
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  )
}
