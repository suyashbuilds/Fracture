"use client";

import FractureDashboard from "@/components/FractureDashboard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SandboxPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050505] selection:bg-[var(--accent)] selection:text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center z-[0]">
        <div className="w-[120vw] h-[120vw] max-w-[1000px] max-h-[1000px] absolute -top-[300px] bg-[var(--accent)]/5 blur-[130px] rounded-full" />
      </div>

      {/* Header */}
      <header className="h-[80px] flex items-center px-6 md:px-10 shrink-0 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="font-mono text-lg md:text-xl font-medium tracking-widest text-zinc-200 flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="w-5 h-5 rounded-[4px] bg-gradient-to-br from-[var(--accent)] to-orange-400 shadow-[0_0_15px_rgba(232,75,42,0.4)]" />
          FRACTURE 
        </Link>
        <div className="ml-auto hidden md:flex items-center gap-6">
           <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-sans font-medium tracking-wide uppercase transition-colors">
              <ArrowLeft className="w-4 h-4" /> Return Home
           </Link>
           <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase opacity-60 ml-4 border-l border-white/10 pl-6">
             // sandbox environment
           </span>
        </div>
      </header>
      
      {/* Main Dashboard Layout */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12 relative z-10">
        <FractureDashboard />
      </main>
    </div>
  );
}
