"use client";

import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, TerminalSquare, Code2, CheckCircle2, Loader2, XCircle, Activity, AlertTriangle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BOILERPLATE_CODE = `def find_duplicates(arr):
    result = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                result.append(arr[i])
    return result
print(find_duplicates([1, 2, 3, 2, 4, 5, 5, 1]))`;

export default function FractureDashboard() {
  const [activeMode, setActiveMode] = useState<'console' | 'telemetry' | 'breaker' | 'optimize'>('console');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  const [output, setOutput] = useState<string>("");
  const [executionStats, setExecutionStats] = useState<{time: number | null, error: boolean}>({ time: null, error: false });
  
  const [telemetryData, setTelemetryData] = useState<{n: number, ms: number}[] | null>(null);
  const [complexityClass, setComplexityClass] = useState<string | null>(null);

  type BreakerCase = { name: string, input: string, reason: string, runResult?: string, isRunning?: boolean };
  const [breakerCases, setBreakerCases] = useState<BreakerCase[] | null>(null);

  type OptimizeResult = { optimizedCode: string, explanation: string, estimatedSpeedup: string };
  const [optimizationResult, setOptimizationResult] = useState<OptimizeResult | null>(null);

  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const getEditorCode = () => editorRef.current ? editorRef.current.getValue() : BOILERPLATE_CODE;

  const handleRunCode = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setActiveMode('console');
    setOutput("Initializing Judge0 execution container...\nExecuting code payload...\n");
    setExecutionStats({ time: null, error: false });
    
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: getEditorCode(), language: "python" })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setOutput((prev) => prev + `\n[ERROR] Execution failed:\n${data.error}\n${data.details || ""}`);
        setExecutionStats({ time: null, error: true });
        return;
      }
      
      let finalOutput = `\n[TRACE] Analysis complete.\n`;
      if (data.stderr) finalOutput += `\n[STDERR]:\n${data.stderr}\n`;
      finalOutput += `\n> Output:\n${data.output}`;
      setOutput((prev) => prev + finalOutput);
      setExecutionStats({ time: data.executionTime, error: !!data.stderr });
    } catch (err: any) {
      setOutput((prev) => prev + `\n[ERROR] Critical failure:\n${err.message}`);
      setExecutionStats({ time: null, error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeComplexity = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setActiveMode('console');
    setOutput("Initializing Telemetry Matrix...\nRunning iterative scaling constraints: [10...50000]\n");
    
    try {
      const res = await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: getEditorCode(), language: "python" })
      });
      const data = await res.json();
      if (!res.ok) {
        setOutput((prev) => prev + `\n[ERROR] Telemetry failed:\n${data.error}\n${data.details || ""}`);
        return;
      }
      setTelemetryData(data.dataPoints);
      setComplexityClass(data.complexityClass);
      setActiveMode('telemetry');
    } catch (err: any) {
      setOutput((prev) => prev + `\n[ERROR] Critical telemetry failure:\n${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreakIt = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setActiveMode('console');
    setOutput("Initializing Adversarial AI Engine...\nGenerating edge cases...\n");
    
    try {
      const res = await fetch("/api/breaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: getEditorCode() })
      });
      const data = await res.json();
      if (!res.ok) {
        setOutput((prev) => prev + `\n[ERROR] Breaker failed:\n${data.error}\n${data.details || ""}`);
        return;
      }
      setBreakerCases(data.cases);
      setActiveMode('breaker');
    } catch (err: any) {
      setOutput((prev) => prev + `\n[ERROR] Critical breaker failure:\n${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunEdgeCase = async (index: number) => {
    if (!breakerCases) return;
    
    const newCases = [...breakerCases];
    newCases[index].isRunning = true;
    newCases[index].runResult = undefined;
    setBreakerCases(newCases);

    try {
      const injectedCode = `${getEditorCode()}\n\n${newCases[index].input}`;

      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: injectedCode, language: "python" })
      });
      
      const data = await res.json();
      const finalCases = [...breakerCases];
      
      if (!res.ok) {
        finalCases[index].runResult = `Error: ${data.error}`;
      } else {
        const out = data.stderr ? `[STDERR]\n${data.stderr}` : data.output;
        finalCases[index].runResult = `${out.trim()}\n(Time: ${data.executionTime}ms)`;
      }
      finalCases[index].isRunning = false;
      setBreakerCases(finalCases);
    } catch (err: any) {
      const finalCases = [...breakerCases];
      finalCases[index].runResult = `Crash: ${err.message}`;
      finalCases[index].isRunning = false;
      setBreakerCases(finalCases);
    }
  };

  const handleOptimize = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setActiveMode('console');
    setOutput("Initializing AI Optimizer...\nTranslating algorithm to high-performance C++...\n");
    
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: getEditorCode() })
      });
      const data = await res.json();
      if (!res.ok) {
        setOutput((prev) => prev + `\n[ERROR] Optimization failed:\n${data.error}\n${data.details || ""}`);
        return;
      }
      setOptimizationResult({
         optimizedCode: data.optimizedCode,
         explanation: data.explanation,
         estimatedSpeedup: data.estimatedSpeedup
      });
      setActiveMode('optimize');
    } catch (err: any) {
      setOutput((prev) => prev + `\n[ERROR] Critical optimization failure:\n${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col lg:flex-row h-[750px] w-full bg-[#05090e]/80 backdrop-blur-3xl border border-[#3dffa0]/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 relative"
    >
      <div className="absolute top-5 left-6 flex gap-2 z-20">
        <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50 shadow-inner" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/50 shadow-inner" />
        <div className="w-3 h-3 rounded-full bg-[#3dffa0]/80 border border-[#3dffa0]/50 shadow-inner" />
      </div>

      <div className={`absolute inset-0 pointer-events-none rounded-3xl border-[2px] transition-colors duration-700 z-50 ${isEditorFocused ? "border-[#3dffa0]/30 shadow-[inset_0_0_30px_rgba(61,255,160,0.1)]" : "border-transparent"}`} />

      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col relative transition-all duration-500 ease-out z-10 pt-[52px] border-b lg:border-b-0 lg:border-r border-white/5">
        <div className="flex items-center justify-between px-6 pb-4 shrink-0 border-b border-white/5 bg-transparent">
          <div className="flex items-center gap-3 pl-14 lg:pl-16">
            <span className="flex items-center justify-center p-1.5 rounded-md border border-white/5 bg-white/5">
              <Code2 className="w-4 h-4 text-[#dce8f0]" />
            </span>
            <span className="font-mono text-[13px] tracking-wide text-[#dce8f0] font-medium">algorithm.py</span>
          </div>
          <div className="font-mono text-xs text-[#dce8f0]/60 bg-black/40 px-3 py-1.5 flex items-center justify-center rounded-lg border border-white/5 relative">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3dffa0] mr-2 shadow-[0_0_8px_rgba(61,255,160,0.5)]" />
            <span>Python 3.10 {activeMode === 'optimize' && "(Read-Only)"}</span>
          </div>
        </div>
        
        <div className="flex-1 relative bg-[#05090e]/50" onFocus={() => setIsEditorFocused(true)} onBlur={() => setIsEditorFocused(false)}>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            defaultValue={BOILERPLATE_CODE}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "var(--font-dm-mono)",
              scrollBeyondLastLine: false,
              roundedSelection: true,
              padding: { top: 24, bottom: 24 },
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
              lineHeight: 26,
              readOnly: activeMode === 'optimize'
            }}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[50%] flex flex-col bg-[#05090e] shrink-0 overflow-hidden pt-[52px] relative z-10">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-4 border-b border-white/5 shrink-0 bg-transparent gap-4">
          <div className="flex items-center gap-3">
             <span className="flex items-center justify-center p-1.5 rounded-md border border-white/5 bg-white/5">
               <TerminalSquare className="w-4 h-4 text-[#dce8f0]" />
             </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#dce8f0]/70">
              {activeMode === 'optimize' ? 'Optimization Result' : 'System Console'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 z-10">
            <motion.button onClick={handleBreakIt} disabled={isLoading} whileTap={{ scale: 0.97 }} whileHover={{ backgroundColor: "rgba(61,255,160,0.15)" }} className="flex items-center gap-1.5 font-sans font-semibold text-[11px] bg-[#0b1018] text-[#dce8f0] border border-[#1a2535] px-3 py-1.5 rounded-md disabled:opacity-50 hover:bg-[#1a2535] transition-colors">
              <AlertTriangle className="w-3 h-3 text-red-400" /> Break It
            </motion.button>
            <motion.button onClick={handleAnalyzeComplexity} disabled={isLoading} whileTap={{ scale: 0.97 }} whileHover={{ backgroundColor: "rgba(61,255,160,0.15)" }} className="flex items-center gap-1.5 font-sans font-semibold text-[11px] bg-[#0b1018] text-[#3dffa0] border border-[#1a2535] px-3 py-1.5 rounded-md disabled:opacity-50 hover:bg-[#1a2535] transition-colors">
              <Activity className="w-3 h-3" /> Analyze
            </motion.button>
            <motion.button onClick={handleOptimize} disabled={isLoading} whileTap={{ scale: 0.97 }} whileHover={{ backgroundColor: "rgba(61,255,160,0.15)" }} className="flex items-center gap-1.5 font-sans font-semibold text-[11px] bg-[#0b1018] text-yellow-400 border border-[#1a2535] px-3 py-1.5 rounded-md disabled:opacity-50 hover:bg-[#1a2535] transition-colors">
              <Zap className="w-3 h-3" /> Optimize → C++
            </motion.button>
            <motion.button onClick={handleRunCode} disabled={isLoading} whileTap={{ scale: 0.97 }} whileHover={{ backgroundColor: "rgba(61,255,160,0.15)" }} className="flex items-center gap-1.5 font-sans font-semibold text-[11px] bg-white text-[#05090e] px-4 py-1.5 rounded-md disabled:opacity-50 hover:bg-[#dce8f0] transition-colors shadow-md">
              <Play className="w-3 h-3 fill-[#05090e]" /> Run
            </motion.button>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto relative bg-[#05090e]/60 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
          {activeMode === 'console' && (
            <AnimatePresence>
              {!output && !isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center text-[#dce8f0]/40 font-mono text-sm gap-4">
                  <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center bg-black/40 shadow-inner">
                    <TerminalSquare className="w-6 h-6 opacity-40" />
                  </div>
                  <span className="tracking-wide">Awaiting execution payload.</span>
                </motion.div>
              )}
              {output && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.35 }} className="w-full font-mono text-[13.5px] whitespace-pre-wrap leading-loose text-[#dce8f0] relative z-10 overflow-hidden">
                  <div className="pl-5 border-l-[2px] border-[#3dffa0]/40 relative py-1">
                    <div className={`absolute -left-[3px] top-3 w-[4px] h-[4px] rounded-full ${executionStats.error ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#3dffa0] shadow-[0_0_8px_rgba(61,255,160,0.8)]'}`} />
                    {output}
                  </div>
                  
                  {!isLoading && output && (
                    <div className={`mt-8 flex items-center gap-2 inline-flex px-4 py-2 rounded-lg text-xs font-medium border shadow-[0_0_20px_rgba(0,0,0,0.2)] ${executionStats.error ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-[#3dffa0] bg-[#3dffa0]/10 border-[#3dffa0]/20'}`}>
                      {executionStats.error ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {executionStats.error ? 'Execution Error' : (executionStats.time !== null ? `Executed in ${executionStats.time}ms` : 'Process Exited')}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {activeMode === 'telemetry' && telemetryData && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col h-full z-10 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="text-[#dce8f0]/60 font-mono text-xs uppercase tracking-widest">Complexity Analysis</div>
                <div className="px-3 py-1 rounded-md bg-[#3dffa0]/10 border border-[#3dffa0]/30 text-[#3dffa0] font-mono text-sm font-bold shadow-[0_0_15px_rgba(61,255,160,0.2)]">
                  Detected: {complexityClass}
                </div>
              </div>
              <motion.div initial={{ opacity: 0, scaleX: 0.95 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.3 }} className="flex-1 min-h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="n" stroke="#dce8f040" tick={{ fill: '#dce8f080', fontSize: 11 }} tickFormatter={(val) => `${val >= 1000 ? val / 1000 + 'k' : val}`} />
                    <YAxis stroke="#dce8f040" tick={{ fill: '#dce8f080', fontSize: 11 }} tickFormatter={(val) => `${val}ms`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0b1018', border: '1px solid #1a2535', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#3dffa0' }} />
                    <Line type="monotone" dataKey="ms" stroke="#3dffa0" strokeWidth={2} dot={{ fill: '#05090e', stroke: '#3dffa0', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3dffa0' }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          )}

          {activeMode === 'breaker' && breakerCases && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 relative z-10">
              {breakerCases.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="bg-[#0b1018] border border-[#1a2535] rounded-xl p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[#3dffa0] font-mono text-[13px] font-bold">{c.name}</h3>
                    <button onClick={() => handleRunEdgeCase(i)} disabled={c.isRunning} className="bg-[#1a2535] text-[#dce8f0] px-4 py-1.5 rounded-md text-xs font-medium hover:bg-[#3dffa0] hover:text-[#05090e] transition-colors disabled:opacity-50">
                      {c.isRunning ? 'Executing...' : 'Run Case'}
                    </button>
                  </div>
                  <p className="text-[#7a95a8] text-[13px] leading-relaxed mb-4">{c.reason}</p>
                  <pre className="bg-[#05090e] p-4 rounded-lg font-mono text-[12px] text-[#dce8f0] overflow-x-auto border border-white/5">
                    {c.input}
                  </pre>
                  {c.runResult && (
                    <div className="mt-4 p-3 bg-black/60 rounded-lg border border-[#3dffa0]/20 font-mono text-[12px] text-[#3dffa0] whitespace-pre-wrap">
                      {c.runResult}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeMode === 'optimize' && optimizationResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full gap-4 relative z-10">
              <div className="flex gap-4">
                <div className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-widest shrink-0 flex items-center justify-center">
                  Speedup: {optimizationResult.estimatedSpeedup}
                </div>
                <div className="flex-1 bg-[#0b1018] border border-[#1a2535] p-3 rounded-lg text-[13px] text-[#dce8f0]/80 leading-relaxed">
                  {optimizationResult.explanation}
                </div>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden border border-[#1a2535] relative bg-[#05090e] shadow-inner mt-2">
                <Editor
                   height="100%"
                   language="cpp"
                   theme="vs-dark"
                   value={optimizationResult.optimizedCode}
                   options={{
                     minimap: { enabled: false },
                     fontSize: 13,
                     fontFamily: "var(--font-dm-mono)",
                     readOnly: true,
                     padding: { top: 16 }
                   }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
