"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Utensils, Droplets, Sparkles, Heart, Moon, Wind, ShieldCheck, Brain, Activity, PlusCircle, AlertCircle, Search, Stethoscope, X, ChevronRight } from "lucide-react"

export default function PreventionPage() {
  const [data, setData] = useState<any>(null)
  const [selectedRec, setSelectedRec] = useState<any>(null)
  const router = useRouter()
  
  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResults")
    if (!stored) {
      router.push("/predict")
      return
    }
    if (stored) {
      setData(JSON.parse(stored))
    }
  }, [router])

  if (!data) return null;

  const recommendations = data.recommendations || []

  const getIcon = (category: string) => {
    switch(category) {
      case "Nutrition": return <Utensils className="w-6 h-6 text-blue-500" />
      case "Lifestyle": return <Activity className="w-6 h-6 text-orange-500" />
      case "Scalp Care": return <Sparkles className="w-6 h-6 text-teal-500" />
      case "Medical": return <Stethoscope className="w-6 h-6 text-red-500" />
      case "Physical": return <Activity className="w-6 h-6 text-purple-500" />
      case "Mindset": return <Brain className="w-6 h-6 text-indigo-500" />
      case "Urgent": return <AlertCircle className="w-6 h-6 text-red-600" />
      default: return <PlusCircle className="w-6 h-6 text-gray-500" />
    }
  }

  const getCategoryBg = (category: string) => {
    switch(category) {
      case "Nutrition": return "bg-blue-50"
      case "Lifestyle": return "bg-orange-50"
      case "Scalp Care": return "bg-teal-50"
      case "Medical": return "bg-red-50"
      case "Urgent": return "bg-red-100"
      default: return "bg-gray-50"
    }
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans py-16 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-[#f0fdfa] text-[#0d9488] px-4 py-1 rounded-full text-sm font-bold border border-[#ccfbf1] flex items-center gap-2">
               <ShieldCheck size={16} /> Targeted for {data.final_stage} Phase
            </div>
          </div>
          <h1 className="text-[48px] font-bold text-[#1e293b]">
            Your <span className="text-[#0d9488]">Prevention Plan</span>
          </h1>
          <p className="text-[#64748b] mt-4 max-w-2xl mx-auto text-lg">
            Highly specific clinical and lifestyle recommendations tailored precisely to your **{data.final_stage}** stage analysis.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex justify-center gap-6 mb-16">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 italic">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
            <span className="text-xs font-bold text-[#64748b]">High Priority</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 italic">
            <div className="w-2 h-2 rounded-full bg-[#f97316]"></div>
            <span className="text-xs font-bold text-[#64748b]">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 italic">
            <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
            <span className="text-xs font-bold text-[#64748b]">Low Priority</span>
          </div>
        </div>

        {/* RECOMMENDATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {recommendations.length > 0 ? recommendations.map((rec: any, i: number) => (
             <div key={i} className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col items-start transition-all hover:shadow-md hover:border-teal-100 h-full group/card">
               
               {/* TOP ROW: ICON & TAGS */}
               <div className="flex justify-between w-full mb-8">
                  <div className={`p-4 rounded-2xl ${getCategoryBg(rec.category)}`}>
                    {getIcon(rec.category)}
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 ${rec.priority === 'HIGH' ? 'bg-[#fee2e2] text-[#ef4444]' : rec.priority === 'MEDIUM' ? 'bg-[#dbeafe] text-[#2563eb]' : 'bg-[#fed7aa] text-[#f97316]'} text-[10px] font-bold rounded-lg uppercase self-start`}>
                      {rec.priority}
                    </span>
                  </div>
               </div>

               <h3 className="text-2xl font-bold text-[#1e293b] mb-4 leading-tight group-hover/card:text-[#0d9488] transition-colors">
                 {rec.title}
               </h3>
               
               <p className="text-[#64748b] text-sm leading-relaxed mb-8 flex-grow">
                 {rec.description}
               </p>

               <button 
                onClick={() => setSelectedRec(rec)}
                className="w-full flex items-center justify-between bg-[#f8fafc] text-[#475569] font-bold text-xs py-4 px-6 rounded-2xl hover:bg-[#e2e8f0] transition-all group/btn"
               >
                 <span>Read Detailed Guide</span>
                 <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
               </button>
             </div>
           )) : (
             <div className="col-span-full py-20 text-center">
                <div className="bg-white rounded-3xl p-12 border border-dashed border-gray-200 inline-block">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No specific recommendations found. Keep maintaining your healthy habits!</p>
                </div>
             </div>
           )}
        </div>

        {/* MODAL / DEEP DIVE */}
        {selectedRec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-12 relative overflow-hidden animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedRec(null)}
                className="absolute top-8 right-8 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className={`p-5 rounded-2xl ${getCategoryBg(selectedRec.category)}`}>
                  {getIcon(selectedRec.category)}
                </div>
                <div>
                  <div className="flex gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#0d9488] uppercase tracking-widest">{selectedRec.category}</span>
                    <span className="text-[10px] font-bold text-gray-300">•</span>
                    <span className="text-[10px] font-bold text-[#ef4444] uppercase tracking-widest">{selectedRec.priority} PRIORITY</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#1e293b]">{selectedRec.title}</h2>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-[#475569] text-lg leading-relaxed mb-8">
                  {selectedRec.description} This action is prioritized because your current {selectedRec.category.toLowerCase()} habits directly impact follicle cellular health.
                </p>
                
                <h4 className="font-bold text-[#1e293b] mb-4">Step-by-Step Implementation:</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">1</div>
                    <p className="text-sm text-[#64748b]">Monitor consistency for the first 21 days to form a biological habit.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">2</div>
                    <p className="text-sm text-[#64748b]">Combine this with your other high-priority {data.final_stage.toLowerCase()} phase protocols.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">3</div>
                    <p className="text-sm text-[#64748b]">If symptoms persist or worsen, escalate to a professional trichological review.</p>
                  </li>
                </ul>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setSelectedRec(null)}
                  className="bg-[#1e293b] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-black transition-all"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
