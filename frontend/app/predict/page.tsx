"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnalyzePage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [image, setImage] = useState<string | null>(null)

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

    try {
      const imgResponse = await fetch(image)
      const blob = await imgResponse.blob()
      form.append("image", blob, "scalp.jpg")
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
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

    } catch (error) {
      console.error(error)
      alert("Backend connection failed")
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 via-blue-100 to-teal-100 min-h-screen py-16 px-6">

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

      <div className={`max-w-6xl mx-auto flex flex-col items-center ${step === 2 ? "grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch" : ""}`}>
        
        {/* STEP 1: IMAGE UPLOAD */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center w-full max-w-3xl flex flex-col items-center justify-center min-h-[400px]">
            {!image ? (
              <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-16 block hover:bg-gray-50 transition w-full">
                <p className="text-gray-500">
                   Click to upload scalp image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="relative flex justify-center w-64 h-64 border-4 border-teal-500/20 rounded-2xl p-2 mb-6">
                  <Image
                    src={image}
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
                <p className="text-teal-600 font-medium flex items-center gap-2">
                  <span className="text-green-500">✓</span> Image Uploaded Successfully
                </p>
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

              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Stress Level: {formData.stress}/10
                </label>

                <input
                  type="range"
                  min="1"
                  max="10"
                  name="stress"
                  value={formData.stress}
                  onChange={handleChange}
                  className="w-full"
                />
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
                <label className="text-sm text-gray-600">
                  Water Intake: {formData.water} glasses/day
                </label>

                <input
                  type="range"
                  min="1"
                  max="12"
                  name="water"
                  value={formData.water}
                  onChange={handleChange}
                  className="w-full"
                />
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