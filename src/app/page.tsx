"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f3ef] font-sans selection:bg-[#e84b2a]/30">
      
      {/* Noise overlay for texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-screen z-50" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundRepeat: 'repeat'
           }} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <h1 className="font-serif text-2xl flex items-center gap-3">
          <div className="w-4 h-4 bg-[#e84b2a] rounded-[3px]" />
          Fracture
        </h1>
        <Link href="/sandbox" className="font-mono text-xs tracking-widest uppercase hover:text-[#e84b2a] transition-colors">
          Enter Sandbox
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="flex flex-col items-center">
          <span className="text-[#e84b2a] font-mono text-sm tracking-widest uppercase mb-6 border border-[#e84b2a]/20 bg-[#e84b2a]/10 px-4 py-1.5 rounded-full">
            Initial Release
          </span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Break it here.<br />
            <span className="italic text-[#e84b2a]">Not in production.</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl text-white/60 leading-relaxed font-light">
            Enterprise-grade algorithmic stress testing. Identify bottlenecks, force extreme constraints, and trace memory leaks before they reach your users.
          </p>
          <Link href="/sandbox" className="mt-10 px-8 py-4 bg-[#e84b2a] hover:bg-[#b33a1f] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#e84b2a]/20 flex items-center gap-2 group">
            Open Sandbox
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* The Problem Grid */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto mb-32"
      >
        <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-xl hover:border-[#444] transition-colors">
          <div className="font-mono text-xs text-[#e84b2a] mb-4 tracking-widest">01</div>
          <h3 className="font-serif text-2xl mb-4">The Illusion of Correctness</h3>
          <p className="text-[#f5f3ef]/60 text-sm leading-relaxed">Passing standard test cases does not guarantee safety. True application stress involves adversarial inputs and memory threshold breaking.</p>
        </motion.div>
        <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-xl hover:border-[#444] transition-colors">
          <div className="font-mono text-xs text-[#e84b2a] mb-4 tracking-widest">02</div>
          <h3 className="font-serif text-2xl mb-4">The Limits of AI</h3>
          <p className="text-[#f5f3ef]/60 text-sm leading-relaxed">LLMs write convincing code, but cannot benchmark the latency of their algorithms under load. You need runtime telemetry.</p>
        </motion.div>
        <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-xl hover:border-[#444] transition-colors">
          <div className="font-mono text-xs text-[#e84b2a] mb-4 tracking-widest">03</div>
          <h3 className="font-serif text-2xl mb-4">The Optimization Wall</h3>
          <p className="text-[#f5f3ef]/60 text-sm leading-relaxed">When an O(N^2) solution hits production, user experience halts. Finding the bottleneck retroactively is expensive.</p>
        </motion.div>
      </motion.section>

      {/* Decorative Fracture Divider */}
      <div className="my-24 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e84b2a]/50 to-transparent relative flex items-center justify-center opacity-50">
        <div className="absolute w-[200px] h-8 bg-[#e84b2a]/10 blur-xl rounded-full" />
      </div>

      {/* Features Stack */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
        className="max-w-4xl mx-auto px-6 flex flex-col gap-8 mb-32"
      >
        <div className="flex flex-col md:flex-row gap-8 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-xl items-start">
           <div className="flex-1">
             <span className="font-mono text-[10px] text-[#e84b2a] bg-[#e84b2a]/10 px-2 py-1 rounded border border-[#e84b2a]/20 mb-3 inline-block tracking-widest uppercase">
               Telemetry
             </span>
             <h3 className="font-serif text-3xl mb-3">Live Execution Telemetry</h3>
             <p className="text-[#f5f3ef]/60 leading-relaxed">Watch your code's memory allocation and CPU cycles drop in real time. We visualize the exact line where execution stalls.</p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-xl items-start">
           <div className="flex-1">
             <span className="font-mono text-[10px] text-[#e84b2a] bg-[#e84b2a]/10 px-2 py-1 rounded border border-[#e84b2a]/20 mb-3 inline-block tracking-widest uppercase">
               Engine
             </span>
             <h3 className="font-serif text-3xl mb-3">The Breaker Engine</h3>
             <p className="text-[#f5f3ef]/60 leading-relaxed">Generate aggressive, randomized edge cases targeted specifically at your algorithm's weak points. If it can be broken, we will break it.</p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-xl items-start">
           <div className="flex-1">
             <span className="font-mono text-[10px] text-[#e84b2a] bg-[#e84b2a]/10 px-2 py-1 rounded border border-[#e84b2a]/20 mb-3 inline-block tracking-widest uppercase">
               Optimization
             </span>
             <h3 className="font-serif text-3xl mb-3">Cross-Language Optimizer</h3>
             <p className="text-[#f5f3ef]/60 leading-relaxed">Compare your Python algorithm's runtime directly against Rust, Go, or C++ implementations side-by-side.</p>
           </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-12 text-center text-[#f5f3ef]/40 text-sm max-w-6xl mx-auto w-full">
        <p>Fracture System © 2026. Built for stress testing.</p>
      </footer>
    </main>
  );
}
