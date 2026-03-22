"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, Camera, RefreshCw, Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnalyzePage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    stress: 2,
    sleep: 8,
    water: 6,
    diet: "Average - Mixed diet",
    exercise: "Light - 1-2 times/week",
    hairProduct: "Minimal - Shampoo only",
    smoking: "Never smoked",
    drinking: "Non drinker",
    familyHistory: "No family history"
  })

  // ... (Upload handlers remain the same)
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
  }

  const startCamera = async () => {
    try {
      setShowCamera(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Prefer back camera on mobile
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Could not access camera. Please check permissions.")
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg")
      setImage(dataUrl)
      stopCamera()
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "stress" || name === "sleep" || name === "water"
        ? Number(value)
        : value
    })
  }

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please upload scalp image")
      return
    }

    const form = new FormData()
    setIsAnalyzing(true)
    setErrorDetails(null)

    const compressImage = async (imageSrc: string): Promise<Blob> => {
      return new Promise((resolve) => {
        const img = new (window as any).Image();
        img.src = imageSrc;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800; // Sufficient for 224px AI model
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8);
        };
      });
    };

    try {
      const compressedBlob = await compressImage(image);
      form.append("image", compressedBlob, "scalp.jpg");
      form.append("age", formData.age)
      form.append("gender", formData.gender)
      form.append("stress", formData.stress.toString())
      form.append("sleep", formData.sleep.toString())
      form.append("water", formData.water.toString())
      form.append("diet", formData.diet)
      form.append("exercise", formData.exercise)
      form.append("hairProduct", formData.hairProduct)
      form.append("smoking", formData.smoking)
      form.append("drinking", formData.drinking)
      form.append("familyHistory", formData.familyHistory)

      const apiUrl = typeof window !== "undefined" && window.location.hostname === "localhost" 
        ? "http://127.0.0.1:8001" 
        : "https://trichoguard-1.onrender.com";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: form
      })

      const data = await response.json()
      
      // Save data to session storage to pass to results page
      sessionStorage.setItem("predictionResults", JSON.stringify(data))
      sessionStorage.setItem("uploadedImage", image)
      
      // Redirect to results (using Next.js router)
      router.push("/results")

    } catch (error: any) {
      console.error(error)
      setErrorDetails(error.message || "Failed to connect to AI server")
      alert(`Backend connection failed: ${error.message || "Check your internet"}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 via-blue-100 to-teal-100 min-h-screen py-16 px-6 relative">
      
      {/* LOADING OVERLAY */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(20,184,166,0.3)]"></div>
          <h2 className="text-3xl font-bold mb-2">Analyzing Scalp...</h2>
          <p className="text-teal-300 animate-pulse text-lg">AI Vision Engine is identifying hair patterns</p>
          <p className="text-xs text-white/50 mt-10 max-w-xs text-center">Processing macroscopic follicle data. This may take up to 30 seconds on free-tier servers.</p>
        </div>
      )}

      {/* DYNAMIC HEADER */}
      <div className="text-center mb-12">
        {step === 1 ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800">
              Upload Your <span className="text-teal-600">Scalp Image</span>
            </h1>
            <p className="text-gray-600 mt-3 max-w-lg mx-auto">
              Take a clear, well-lit photo of the area you want to analyze. For best results, ensure good lighting and focus.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-800">
              Tell Us About Your <span className="text-teal-600">Lifestyle</span>
            </h1>
            <p className="text-gray-600 mt-3 max-w-lg mx-auto">
              Your lifestyle factors significantly impact hair health. Share some information to get personalized AI-powered insights.
            </p>
          </>
        )}
      </div>

      {/* QUICK STATUS INDICATOR */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-end">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-xs font-medium text-gray-500 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          AI Server Link: <span className="text-teal-600">Active</span>
        </div>
      </div>

      <div className={`max-w-6xl mx-auto flex flex-col items-center ${step === 2 ? "grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch" : ""}`}>
        
        {/* STEP 1: IMAGE UPLOAD / CAMERA */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center w-full max-w-3xl flex flex-col items-center justify-center min-h-[400px]">
            {!image && !showCamera ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl p-10 block hover:bg-gray-50 transition-all hover:border-teal-500 group">
                  <div className="mb-4 flex justify-center text-gray-400 group-hover:text-teal-500 transition-colors">
                    <RefreshCw size={48} className="animate-spin text-teal-500" />
                  </div>
                  <p className="text-gray-600 font-semibold mb-2">Upload From Device</p>
                  <p className="text-gray-400 text-xs text-center">Select an existing photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={startCamera}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-10 block hover:bg-gray-50 transition-all hover:border-teal-500 group"
                >
                  <div className="mb-4 flex justify-center text-gray-400 group-hover:text-teal-500 transition-colors">
                    <Camera size={48} />
                  </div>
                  <p className="text-gray-600 font-semibold mb-2">Take Live Photo</p>
                  <p className="text-gray-400 text-xs text-center">Use your phone camera</p>
                </button>
              </div>
            ) : showCamera ? (
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-black mb-6">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-2xl"></div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={stopCamera}
                    className="p-4 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition"
                  >
                    <X size={24} />
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="p-6 rounded-full bg-white border-8 border-teal-500 shadow-xl hover:scale-105 active:scale-95 transition"
                  >
                    <div className="w-6 h-6 bg-teal-500 rounded-full"></div>
                  </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
                <div className="relative flex justify-center w-64 h-64 border-4 border-teal-500/20 rounded-2xl p-2 mb-6">
                  <Image
                    src={image!}
                    alt="Uploaded"
                    fill
                    className="rounded-xl object-cover shadow-md"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-md hover:scale-110 transition z-10"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-medium flex items-center gap-2">
                  <Check size={18} /> High-Resolution Capture Ready
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROCEED TO FORM BUTTON */}
        {step === 1 && (
          <div className="mt-8">
            <button
               onClick={() => setStep(2)}
               disabled={!image}
               className={`px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg ${
                 image 
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:scale-105" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
               }`}
            >
              Continue to Lifestyle Form
            </button>
          </div>
        )}

        {/* STEP 2 COMPONENT A: SMALL IMAGE PREVIEW (Left side in grid) */}
        {step === 2 && (
           <div className="bg-white rounded-3xl shadow-xl p-8 text-center h-fit sticky top-10">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                 Uploaded Image
              </h2>
              <div className="relative flex justify-center w-full max-w-[300px] aspect-square mx-auto rounded-xl overflow-hidden shadow-md border border-gray-100">
                <Image
                  src={image!}
                  alt="Uploaded preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button 
                onClick={() => setStep(1)}
                className="mt-6 text-sm text-blue-600 hover:underline"
              >
                 Recapture / Change Image
              </button>
           </div>
        )}

        {/* FORM */}
        {step === 2 && (
          <div className="space-y-6">

            {/* PERSONAL INFO */}
            <div className="bg-white rounded-3xl shadow-xl p-6">

              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-sm text-gray-600">Age</label>

                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Gender</label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-white text-black focus:ring-2 focus:ring-teal-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

              </div>
            </div>

            {/* HEALTH */}
            <div className="bg-white rounded-3xl shadow-xl p-6">

              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Health & Wellness
              </h2>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Current Stress Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Relaxed", value: 2, color: "bg-green-100 text-green-700 border-green-200" },
                    { label: "Moderate", value: 5, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                    { label: "Intense", value: 9, color: "bg-red-100 text-red-700 border-red-200" }
                  ].map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, stress: level.value })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.stress === level.value 
                        ? `${level.color} border-teal-500 scale-105 shadow-md` 
                        : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                      } text-sm font-semibold`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Sleep Hours: {formData.sleep} hrs/night
                </label>

                <input
                  type="range"
                  min="3"
                  max="12"
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Daily Water Intake: <span className="text-teal-600 font-bold">{formData.water}L</span>
                </label>

                <input
                  type="range"
                  min="3.0"
                  max="6.0"
                  step="0.5"
                  name="water"
                  value={formData.water}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                  <span>3.0 Liters</span>
                  <span>4.5 Liters</span>
                  <span>6.0 Liters</span>
                </div>
              </div>

            </div>

            {/* LIFESTYLE */}
            <div className="bg-white rounded-3xl shadow-xl p-6">

              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Lifestyle Habits
              </h2>

              <div className="mb-4">
                <label className="text-sm text-gray-600">Diet Type</label>

                <select
                  name="diet"
                  value={formData.diet}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black"
                >
                  <option>Healthy - Balanced diet</option>
                  <option>Average - Mixed diet</option>
                  <option>Poor - Junk food heavy</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Exercise Frequency
                </label>

                <select
                  name="exercise"
                  value={formData.exercise}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black"
                >
                  <option>None</option>
                  <option>Light - 1-2 times/week</option>
                  <option>Moderate - 3-4 times/week</option>
                  <option>Heavy - Daily workout</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Hair Product Usage
                </label>

                <select
                  name="hairProduct"
                  value={formData.hairProduct}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black"
                >
                  <option>Minimal - Shampoo only</option>
                  <option>Moderate - Oil & conditioner</option>
                  <option>Heavy - Styling products</option>
                </select>
              </div>

            </div>

            {/* MEDICAL HISTORY */}
            <div className="bg-white rounded-3xl shadow-xl p-6">

              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Medical History
              </h2>

              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Smoking Status
                </label>

                <select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black"
                >
                  <option>Never smoked</option>
                  <option>Occasional smoker</option>
                  <option>Regular smoker</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Drinking Habit
                </label>

                <select
                  name="drinking"
                  value={formData.drinking}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black"
                >
                  <option>Non drinker</option>
                  <option>Occasional drinker</option>
                  <option>Frequent drinker</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Family Hair Loss History
                </label>

                <select
                  name="familyHistory"
                  value={formData.familyHistory}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white text-black"
                >
                  <option>No family history</option>
                  <option>Father side</option>
                  <option>Mother side</option>
                  <option>Both sides</option>
                </select>
              </div>

            </div>

            {/* ANALYZE BUTTON */}
            <button
              onClick={handleAnalyze}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:scale-105 transition shadow-lg"
            >
              Analyze My Hair Health
            </button>

          </div>
        )}

      </div>
    </div>
  )
}