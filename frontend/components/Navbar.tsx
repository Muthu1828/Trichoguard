"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity } from "lucide-react"
import { Stethoscope } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="flex justify-center mt-6 relative z-50">
      <div className="bg-white shadow-xl rounded-2xl px-10 py-4 flex items-center justify-between w-[90%] max-w-6xl border border-gray-100">

        <div className="flex items-center gap-3">
  <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-lg shadow-md">
    <Stethoscope className="text-white w-5 h-5" />
  </div>

  <div>
    <h1 className="text-2xl font-semibold text-gray-900">
      TrichoGuard
    </h1>
    <p className="text-xs text-teal-600 font-medium tracking-wide">
      AI Powered Hair Health Analysis
    </p>
  </div>
</div>

        {/* Navigation */}
        <div className="hidden md:flex gap-8 font-medium text-gray-500">
          <Link href="/" className={`${pathname === '/' ? 'text-teal-600 bg-teal-50 px-3 py-1 rounded-md' : 'hover:text-teal-600'} transition duration-300`}>
            Home
          </Link>
          <Link href="/predict" className={`${pathname === '/predict' ? 'text-teal-600 bg-teal-50 px-3 py-1 rounded-md' : 'hover:text-teal-600'} transition duration-300`}>
            Analyze
          </Link>
          <Link href="/results" className={`${pathname === '/results' ? 'text-teal-600 bg-teal-50 px-3 py-1 rounded-md' : 'hover:text-teal-600'} transition duration-300`}>
            Results
          </Link>
          <Link href="/prevention" className={`${pathname === '/prevention' ? 'text-teal-600 bg-teal-50 px-3 py-1 rounded-md' : 'hover:text-teal-600'} transition duration-300`}>
            Prevention
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/predict"
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          <Activity size={18} />
          Start Analysis
        </Link>
      </div>
    </div>
  )
}