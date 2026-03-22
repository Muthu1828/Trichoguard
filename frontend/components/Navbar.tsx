"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity } from "lucide-react"
import { Stethoscope } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="flex justify-center mt-2 md:mt-6 relative z-50">
      <div className="bg-white shadow-xl rounded-2xl px-4 md:px-10 py-3 md:py-4 flex items-center justify-between w-[95%] md:w-[90%] max-w-6xl border border-gray-100">

        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-1.5 md:p-2 rounded-lg shadow-md shrink-0">
            <Stethoscope className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>

          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-900 leading-tight">
              TrichoGuard
            </h1>
            <p className="hidden xs:block text-[10px] md:text-xs text-teal-600 font-medium tracking-wide">
              AI Powered Hair Analysis
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex gap-8 font-medium text-gray-500 text-sm md:text-base">
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
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-3 md:px-6 py-2 rounded-lg md:rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition text-xs md:text-sm font-bold"
        >
          <Activity size={14} className="md:w-4 md:h-4" />
          <span className="md:inline">{pathname === '/predict' ? 'Scanning' : 'Start'}</span>
          <span className="hidden sm:inline ml-1">Analysis</span>
        </Link>
      </div>
    </div>
  )
}