import React, { useState } from 'react';
import { Info, Cpu, BookOpen, Target, Code, Monitor, Layers, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const sections = [
  {
    title: 'Project Introduction',
    icon: BookOpen,
    content: `The "8086 Smart Student Performance Evaluation System" is an academic project developed for the Computer Organization and Architecture (COA) course. This system demonstrates the practical application of Intel 8086 microprocessor programming by implementing a student grade calculation system using 8086 Assembly Language.

The project integrates a modern web-based interface with a backend that processes student marks through an 8086 Assembly program. It accepts marks for three subjects — Mathematics, Computer Organization, and Programming — calculates the total and average, and determines the academic grade using assembly language instructions.`
  },
  {
    title: 'Problem Statement',
    icon: Target,
    content: `In traditional academic evaluation, manual calculation of student grades is time-consuming and error-prone. This project addresses the need for an automated system that:

• Demonstrates how low-level assembly programming can solve real-world problems
• Shows the working of the Intel 8086 microprocessor in data processing
• Provides a practical understanding of registers, arithmetic operations, and conditional branching in assembly language
• Bridges the gap between theoretical COA concepts and practical implementation`
  },
  {
    title: 'Objectives',
    icon: Lightbulb,
    content: `• To develop a student grade evaluation system using Intel 8086 Assembly Language
• To demonstrate the use of 8086 registers (AX, BX, CX, DX) for arithmetic operations
• To implement addition (ADD) and division (DIV) for calculating total and average marks
• To use comparison (CMP) and conditional jump instructions (JGE, JL) for grade classification
• To integrate assembly language execution with a modern web application
• To create a professional academic management interface with analytics and reporting`
  },
  {
    title: 'Intel 8086 Microprocessor Overview',
    icon: Cpu,
    content: `The Intel 8086 is a 16-bit microprocessor designed by Intel in 1978. It is the foundation of the x86 architecture that powers modern computers.

Key Features:
• 16-bit data bus and 20-bit address bus
• 1 MB addressable memory (2²⁰ bytes)
• 14 internal registers (4 general purpose, 4 segment, 4 index/pointer, 2 special)
• 5 MHz clock speed (original)
• Two units: Bus Interface Unit (BIU) and Execution Unit (EU)

General Purpose Registers:
• AX (Accumulator) — Used for arithmetic operations and I/O
• BX (Base Register) — Used as a base pointer for memory access
• CX (Count Register) — Used as a counter in loop operations
• DX (Data Register) — Used in I/O operations and multiplication/division`
  },
];

const instructions = [
  { inst: 'MOV', desc: 'Move data between registers or memory locations', example: 'MOV AX, 75' },
  { inst: 'ADD', desc: 'Add source operand to destination operand', example: 'ADD AX, BX' },
  { inst: 'DIV', desc: 'Unsigned division of AX (or DX:AX) by operand', example: 'DIV BX' },
  { inst: 'CMP', desc: 'Compare two operands by subtracting (sets flags)', example: 'CMP AX, 75' },
  { inst: 'JMP', desc: 'Unconditional jump to specified label', example: 'JMP GRADE_FAIL' },
  { inst: 'JGE', desc: 'Jump if greater than or equal (SF=OF)', example: 'JGE GRADE_DIST' },
  { inst: 'JL', desc: 'Jump if less than (SF≠OF)', example: 'JL GRADE_FAIL' },
  { inst: 'INT 21H', desc: 'DOS interrupt for I/O services', example: 'INT 21H (AH=09H: print string)' },
  { inst: 'XOR', desc: 'Logical exclusive OR operation', example: 'XOR DX, DX (clear DX)' },
  { inst: 'LEA', desc: 'Load effective address into register', example: 'LEA DX, msg_title' },
];

const techStack = [
  { name: 'React.js', desc: 'Frontend UI Framework', color: 'text-cyan-400' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS', color: 'text-electric-400' },
  { name: 'Python Flask', desc: 'Backend REST API', color: 'text-emerald-400' },
  { name: 'SQLite', desc: 'Database Engine', color: 'text-amber-400' },
  { name: '8086 Assembly', desc: 'Core Computation', color: 'text-purple-400' },
  { name: 'Recharts', desc: 'Data Visualization', color: 'text-pink-400' },
];

export default function AboutProject() {
  const [openSections, setOpenSections] = useState(new Set([0]));

  const toggle = (i) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-electric-400" /> About Project
        </h1>
        <p className="text-gray-500 text-sm mt-1">8086 Smart Student Performance Evaluation System</p>
      </div>

      {/* Accordion Sections */}
      {sections.map((section, i) => (
        <div key={i} className="glass overflow-hidden">
          <button onClick={() => toggle(i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition">
            <div className="flex items-center gap-3">
              <section.icon className="w-5 h-5 text-electric-400" />
              <h2 className="text-sm font-semibold text-white">{section.title}</h2>
            </div>
            {openSections.has(i) ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          {openSections.has(i) && (
            <div className="px-5 pb-5 animate-slide-up">
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          )}
        </div>
      ))}

      {/* Instructions Table */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-electric-400" />
          <h2 className="text-sm font-semibold text-white">8086 Instructions Used</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2.5 px-4 text-gray-500 text-xs uppercase">Instruction</th>
                <th className="text-left py-2.5 px-4 text-gray-500 text-xs uppercase">Description</th>
                <th className="text-left py-2.5 px-4 text-gray-500 text-xs uppercase">Example</th>
              </tr>
            </thead>
            <tbody>
              {instructions.map(({ inst, desc, example }) => (
                <tr key={inst} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2.5 px-4 font-mono text-electric-400 font-semibold">{inst}</td>
                  <td className="py-2.5 px-4 text-gray-400">{desc}</td>
                  <td className="py-2.5 px-4 font-mono text-gray-500 text-xs">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Requirements */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-electric-400" />
          <h2 className="text-sm font-semibold text-white">System Requirements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Hardware</h3>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>• x86-compatible processor</li>
              <li>• Minimum 4 GB RAM</li>
              <li>• 500 MB free disk space</li>
              <li>• Display: 1366×768 minimum</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Software</h3>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>• DOSBox / EMU8086 (8086 Emulator)</li>
              <li>• Python 3.x with Flask</li>
              <li>• Node.js 18+ with npm</li>
              <li>• Modern web browser (Chrome/Edge/Firefox)</li>
              <li>• MASM / TASM (Assembler)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-electric-400" />
          <h2 className="text-sm font-semibold text-white">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {techStack.map(t => (
            <div key={t.name} className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition">
              <p className={`font-semibold text-sm ${t.color}`}>{t.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Project Methodology</h2>
        <div className="flex flex-col gap-2">
          {[
            'User enters student marks via web interface',
            'React frontend sends data to Flask backend via REST API',
            'Backend invokes 8086 Assembly program with input marks',
            'Assembly program loads marks into registers (MOV AX, marks)',
            'ADD instruction calculates total, DIV computes average',
            'CMP and conditional jumps (JGE/JL) determine grade',
            'Results captured and returned to frontend',
            'Dashboard, analytics, and reports updated in real-time',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-electric-500/20 text-electric-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-gray-400">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Enhancements */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Future Enhancements</h2>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Direct integration with DOSBox/EMU8086 for real-time 8086 execution</li>
          <li>• Support for additional subjects and flexible grading criteria</li>
          <li>• Student authentication and role-based access control</li>
          <li>• Batch processing of multiple student records via CSV import</li>
          <li>• Email-based result notification system</li>
          <li>• Comparative analysis across multiple semesters</li>
          <li>• Mobile-responsive PWA (Progressive Web Application)</li>
        </ul>
      </div>

      {/* Credits */}
      <div className="glass p-5 text-center">
        <h2 className="text-sm font-semibold text-white mb-2">Project Credits</h2>
        <p className="text-gray-500 text-sm">B.Tech Computer Science & Engineering</p>
        <p className="text-gray-500 text-sm">Computer Organization and Architecture (COA)</p>
        <p className="text-gray-600 text-xs mt-3">© 2024 — Academic Project</p>
      </div>
    </div>
  );
}
