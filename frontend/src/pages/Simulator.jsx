import React, { useState, useEffect } from 'react';
import { Cpu, Play, AlertTriangle, CheckCircle, Clock, Circle, ArrowDown, Zap } from 'lucide-react';
import { runSimulator, getSimulatorStatus } from '../api/studentApi';
import { useToast } from '../components/Toast';

export default function Simulator() {
  const [marks, setMarks] = useState({ mathematics: '', coa: '', programming: '' });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    getSimulatorStatus().then(setStatus).catch(console.error);
  }, []);

  const validate = () => {
    const e = {};
    ['mathematics', 'coa', 'programming'].forEach(f => {
      const v = marks[f];
      if (v === '') e[f] = 'Required';
      else { const n = Number(v); if (isNaN(n) || n < 0 || n > 100) e[f] = '0-100'; }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleExecute = async () => {
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    setActiveStep(-1);
    try {
      const res = await runSimulator({
        mathematics: parseInt(marks.mathematics),
        coa: parseInt(marks.coa),
        programming: parseInt(marks.programming),
      });
      setResult(res);
      // Animate steps
      for (let i = 0; i < res.execution_steps.length; i++) {
        await new Promise(r => setTimeout(r, 200));
        setActiveStep(i);
      }
      toast('Execution completed', 'success');
    } catch (err) {
      toast(err.errors ? err.errors.join(', ') : 'Execution failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setMarks(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const RegisterBox = ({ name, value }) => (
    <div className="bg-navy-950 border border-white/10 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500 font-mono mb-1">{name}</p>
      <p className="text-lg font-bold font-mono text-electric-400">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-electric-400" /> 8086 Assembly Language Execution Engine
        </h1>
        <p className="text-gray-500 text-sm mt-1">Execute student grade calculation using Intel 8086 Assembly</p>
      </div>

      {/* Emulator Status */}
      <div className={`glass p-4 flex items-center gap-3 ${
        status?.status === 'CONNECTED' ? 'border-emerald-500/20' : 'border-amber-500/20'
      }`}>
        <div className={`w-3 h-3 rounded-full ${status?.status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
        <div>
          <p className="text-sm font-medium text-white">
            Emulator Status: <span className={status?.status === 'CONNECTED' ? 'text-emerald-400' : 'text-red-400'}>
              {status?.status === 'CONNECTED' ? 'Connected' : '8086 Emulator Not Connected'}
            </span>
          </p>
          <p className="text-xs text-gray-500">{status?.message}</p>
        </div>
      </div>

      {/* Workflow Diagram */}
      <div className="glass p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Execution Workflow</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          {['Website Input', 'Flask Backend', '8086 Assembly', '8086 Emulator', 'Capture Output', 'Display Results'].map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-3 py-1.5 rounded-lg bg-electric-500/10 text-electric-400 border border-electric-500/20 font-medium">{step}</span>
              {i < 5 && <ArrowDown className="w-4 h-4 text-gray-600 rotate-[-90deg]" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-electric-400" /> Input Marks
          </h2>
          <div className="space-y-3">
            {[
              { field: 'mathematics', label: 'Mathematics (MOV AX, marks)' },
              { field: 'coa', label: 'Computer Organization (MOV BX, marks)' },
              { field: 'programming', label: 'Programming (MOV CX, marks)' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-xs text-gray-500 mb-1 font-mono">{label}</label>
                <input type="number" min="0" max="100" value={marks[field]}
                  onChange={e => handleChange(field, e.target.value)}
                  className={`w-full bg-navy-950 border ${errors[field] ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-electric-500/50`}
                  placeholder="0 - 100" />
                {errors[field] && <p className="text-red-400 text-xs mt-0.5">{errors[field]}</p>}
              </div>
            ))}
            <button onClick={handleExecute} disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold rounded-lg hover:from-electric-600 hover:to-electric-700 transition disabled:opacity-50 shadow-lg shadow-electric-500/20 mt-2">
              <Play className="w-4 h-4" /> {loading ? 'Executing...' : 'Execute on 8086'}
            </button>
          </div>
        </div>

        {/* Register Display */}
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-4">8086 Register State</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <RegisterBox name="AX (Accumulator)" value={result?.registers?.AX || '0000'} />
            <RegisterBox name="BX (Base)" value={result?.registers?.BX || '0000'} />
            <RegisterBox name="CX (Count)" value={result?.registers?.CX || '0000'} />
            <RegisterBox name="DX (Data)" value={result?.registers?.DX || '0000'} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-navy-950 border border-white/10 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500">ALU</p>
              <p className="text-xs font-mono text-amber-400">{result ? 'ACTIVE' : 'IDLE'}</p>
            </div>
            <div className="bg-navy-950 border border-white/10 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500">BUS</p>
              <p className="text-xs font-mono text-emerald-400">16-BIT</p>
            </div>
            <div className="bg-navy-950 border border-white/10 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500">FLAGS</p>
              <p className="text-xs font-mono text-electric-400">{result ? 'ZF=0' : '----'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assembly Code */}
      {result?.assembly_code && (
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-3">8086 Assembly Source Code (MARKS.ASM)</h2>
          <div className="bg-navy-950 rounded-lg p-4 max-h-80 overflow-y-auto border border-white/5">
            <pre className="text-xs font-mono leading-relaxed">
              {result.assembly_code.split('\n').map((line, i) => {
                const isComment = line.trim().startsWith(';');
                const isLabel = line.trim().endsWith(':') && !line.trim().startsWith(';');
                const isDirective = /^\s*\.(MODEL|STACK|DATA|CODE)/.test(line);
                return (
                  <div key={i} className="flex">
                    <span className="text-gray-700 w-8 text-right mr-4 select-none">{i + 1}</span>
                    <span className={
                      isComment ? 'text-green-500' :
                      isLabel ? 'text-amber-400 font-semibold' :
                      isDirective ? 'text-purple-400' :
                      'text-gray-300'
                    }>{line}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      )}

      {/* Execution Steps */}
      {result?.execution_steps && (
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Execution Trace</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {result.execution_steps.map((step, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                i <= activeStep ? 'bg-white/5' : 'opacity-40'
              }`}>
                <div className="mt-0.5">
                  {i <= activeStep ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : i === activeStep + 1 && loading ? (
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono">Step {step.step}</span>
                    <code className="text-xs text-electric-400 font-mono bg-electric-500/10 px-2 py-0.5 rounded">{step.instruction}</code>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                  {i <= activeStep && step.registers && (
                    <div className="flex gap-3 mt-1">
                      {Object.entries(step.registers).map(([r, v]) => (
                        <span key={r} className="text-[10px] font-mono text-gray-600">{r}={v}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output Panel */}
      {result?.software_result && (
        <div className="space-y-4">
          <div className="glass p-5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-400">Software Engine Results</p>
                <p className="text-xs text-gray-500 mt-1">{result.message}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total', value: `${result.software_result.total}/300` },
              { label: 'Average', value: `${result.software_result.average}%` },
              { label: 'Grade', value: result.software_result.grade },
              { label: 'Result', value: result.software_result.result },
              { label: 'Remarks', value: result.software_result.remarks },
            ].map(item => (
              <div key={item.label} className="glass p-4 text-center">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`text-sm font-bold mt-1 ${
                  item.label === 'Result' ? (item.value === 'PASS' ? 'text-emerald-400' : 'text-red-400') : 'text-white'
                }`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
