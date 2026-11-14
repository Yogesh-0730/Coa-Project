const BASE = import.meta.env.VITE_API_URL || '/api';

// Initial sample data for fallback (when deployed on static hosts like GitHub Pages)
const DEFAULT_STUDENTS = [
  { id: 1, name: "Aarav Sharma", roll_number: "CSE2024001", mathematics: 92, coa: 88, programming: 95, total: 275, average: 91.67, grade: "DISTINCTION", result: "PASS", remarks: "Excellent Performance", highest_subject: "Programming", lowest_subject: "Computer Organization", created_at: "2026-11-14 12:00:00" },
  { id: 2, name: "Priya Patel", roll_number: "CSE2024002", mathematics: 85, coa: 78, programming: 80, total: 243, average: 81.0, grade: "DISTINCTION", result: "PASS", remarks: "Excellent Performance", highest_subject: "Mathematics", lowest_subject: "Computer Organization", created_at: "2026-11-14 12:01:00" },
  { id: 3, name: "Rahul Verma", roll_number: "CSE2024003", mathematics: 76, coa: 82, programming: 79, total: 237, average: 79.0, grade: "DISTINCTION", result: "PASS", remarks: "Excellent Performance", highest_subject: "Computer Organization", lowest_subject: "Mathematics", created_at: "2026-11-14 12:02:00" },
  { id: 4, name: "Sneha Gupta", roll_number: "CSE2024004", mathematics: 68, coa: 72, programming: 65, total: 205, average: 68.33, grade: "FIRST CLASS", result: "PASS", remarks: "Very Good Performance", highest_subject: "Computer Organization", lowest_subject: "Programming", created_at: "2026-11-14 12:03:00" },
  { id: 5, name: "Vikram Singh", roll_number: "CSE2024005", mathematics: 55, coa: 60, programming: 58, total: 173, average: 57.67, grade: "SECOND CLASS", result: "PASS", remarks: "Satisfactory Performance", highest_subject: "Computer Organization", lowest_subject: "Mathematics", created_at: "2026-11-14 12:04:00" },
  { id: 6, name: "Ananya Reddy", roll_number: "CSE2024006", mathematics: 62, coa: 65, programming: 70, total: 197, average: 65.67, grade: "FIRST CLASS", result: "PASS", remarks: "Very Good Performance", highest_subject: "Programming", lowest_subject: "Mathematics", created_at: "2026-11-14 12:05:00" },
  { id: 7, name: "Karan Mehta", roll_number: "CSE2024007", mathematics: 52, coa: 48, programming: 55, total: 155, average: 51.67, grade: "SECOND CLASS", result: "PASS", remarks: "Satisfactory Performance", highest_subject: "Programming", lowest_subject: "Computer Organization", created_at: "2026-11-14 12:06:00" },
  { id: 8, name: "Divya Nair", roll_number: "CSE2024008", mathematics: 45, coa: 38, programming: 42, total: 125, average: 41.67, grade: "FAIL", result: "FAIL", remarks: "Needs Improvement", highest_subject: "Mathematics", lowest_subject: "Computer Organization", created_at: "2026-11-14 12:07:00" },
  { id: 9, name: "Arjun Kumar", roll_number: "CSE2024009", mathematics: 35, coa: 28, programming: 40, total: 103, average: 34.33, grade: "FAIL", result: "FAIL", remarks: "Needs Improvement", highest_subject: "Programming", lowest_subject: "Computer Organization", created_at: "2026-11-14 12:08:00" },
  { id: 10, name: "Meera Joshi", roll_number: "CSE2024010", mathematics: 88, coa: 90, programming: 85, total: 263, average: 87.67, grade: "DISTINCTION", result: "PASS", remarks: "Excellent Performance", highest_subject: "Computer Organization", lowest_subject: "Programming", created_at: "2026-11-14 12:09:00" }
];

function getStoredStudents() {
  const data = localStorage.getItem('sspes_students');
  if (!data) {
    localStorage.setItem('sspes_students', JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_STUDENTS;
  }
}

function saveStoredStudents(list) {
  localStorage.setItem('sspes_students', JSON.stringify(list));
}

function evaluateStudent(m, c, p) {
  const total = m + c + p;
  const avg = Math.round((total / 3) * 100) / 100;
  let grade = 'FAIL';
  if (avg >= 75) grade = 'DISTINCTION';
  else if (avg >= 60) grade = 'FIRST CLASS';
  else if (avg >= 50) grade = 'SECOND CLASS';
  
  const result = avg >= 50 ? 'PASS' : 'FAIL';
  const remarks = {
    'DISTINCTION': 'Excellent Performance',
    'FIRST CLASS': 'Very Good Performance',
    'SECOND CLASS': 'Satisfactory Performance',
    'FAIL': 'Needs Improvement'
  }[grade];

  const subjs = { 'Mathematics': m, 'Computer Organization': c, 'Programming': p };
  const highest = Object.keys(subjs).reduce((a, b) => subjs[a] >= subjs[b] ? a : b);
  const lowest = Object.keys(subjs).reduce((a, b) => subjs[a] <= subjs[b] ? a : b);

  return { total, average: avg, grade, result, remarks, highest_subject: highest, lowest_subject: lowest };
}

async function request(url, options = {}) {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend API unreachable (e.g. running statically on GitHub Pages)
  }
  return null;
}

export const getAllStudents = async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  const remote = await request(`/students${q ? '?' + q : ''}`);
  if (remote) return remote;

  let list = getStoredStudents();
  if (params.search) {
    const s = params.search.toLowerCase();
    list = list.filter(item => item.name.toLowerCase().includes(s) || item.roll_number.toLowerCase().includes(s));
  }
  if (params.grade && params.grade !== 'All') {
    list = list.filter(item => item.grade === params.grade);
  }
  if (params.sort === 'asc') {
    list = [...list].sort((a, b) => a.average - b.average);
  } else if (params.sort === 'desc') {
    list = [...list].sort((a, b) => b.average - a.average);
  }
  return { students: list, count: list.length };
};

export const getStudent = async (id) => {
  const remote = await request(`/students/${id}`);
  if (remote) return remote;

  const list = getStoredStudents();
  const student = list.find(s => s.id === Number(id));
  if (!student) throw { error: 'Student not found.' };
  return { student };
};

export const addStudent = async (data) => {
  const remote = await request('/students', { method: 'POST', body: JSON.stringify(data) });
  if (remote) return remote;

  const list = getStoredStudents();
  if (list.some(s => s.roll_number.toLowerCase() === data.roll_number.toLowerCase())) {
    throw { errors: [`Roll number '${data.roll_number}' already exists.`] };
  }

  const ev = evaluateStudent(Number(data.mathematics), Number(data.coa), Number(data.programming));
  const newStudent = {
    id: Date.now(),
    name: data.name,
    roll_number: data.roll_number,
    mathematics: Number(data.mathematics),
    coa: Number(data.coa),
    programming: Number(data.programming),
    ...ev,
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };

  list.unshift(newStudent);
  saveStoredStudents(list);
  return { message: "Student added successfully.", student: newStudent };
};

export const updateStudent = async (id, data) => {
  const remote = await request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  if (remote) return remote;

  const list = getStoredStudents();
  const idx = list.findIndex(s => s.id === Number(id));
  if (idx === -1) throw { error: "Student not found." };

  const ev = evaluateStudent(Number(data.mathematics), Number(data.coa), Number(data.programming));
  list[idx] = {
    ...list[idx],
    name: data.name,
    roll_number: data.roll_number,
    mathematics: Number(data.mathematics),
    coa: Number(data.coa),
    programming: Number(data.programming),
    ...ev
  };
  saveStoredStudents(list);
  return { message: "Student updated successfully.", student: list[idx] };
};

export const deleteStudent = async (id) => {
  const remote = await request(`/students/${id}`, { method: 'DELETE' });
  if (remote) return remote;

  let list = getStoredStudents();
  list = list.filter(s => s.id !== Number(id));
  saveStoredStudents(list);
  return { message: "Student deleted successfully." };
};

export const getDashboard = async () => {
  const remote = await request('/dashboard');
  if (remote) return remote;

  const list = getStoredStudents();
  const total = list.length;
  const passed = list.filter(s => s.result === 'PASS').length;
  const failed = total - passed;
  const distinction = list.filter(s => s.grade === 'DISTINCTION').length;
  const avgSum = list.reduce((acc, s) => acc + s.average, 0);
  const classAvg = total > 0 ? Math.round((avgSum / total) * 100) / 100 : 0;
  const passPct = total > 0 ? Math.round((passed / total) * 100) : 0;

  const gradeCounts = {};
  list.forEach(s => { gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1; });
  const grade_distribution = Object.entries(gradeCounts).map(([name, value]) => ({ name, value }));

  const mathAvg = total > 0 ? Math.round((list.reduce((acc, s) => acc + s.mathematics, 0) / total) * 10) / 10 : 0;
  const coaAvg = total > 0 ? Math.round((list.reduce((acc, s) => acc + s.coa, 0) / total) * 10) / 10 : 0;
  const progAvg = total > 0 ? Math.round((list.reduce((acc, s) => acc + s.programming, 0) / total) * 10) / 10 : 0;

  return {
    total_students: total,
    passed,
    failed,
    distinction_count: distinction,
    class_average: classAvg,
    pass_percentage: passPct,
    grade_distribution,
    subject_averages: [
      { subject: "Mathematics", average: mathAvg },
      { subject: "Computer Organization", average: coaAvg },
      { subject: "Programming", average: progAvg }
    ],
    recent_students: list.slice(0, 5)
  };
};

export const getAnalytics = async () => {
  const remote = await request('/analytics');
  if (remote) return remote;

  const dash = await getDashboard();
  const list = getStoredStudents();

  const math = list.map(s => s.mathematics);
  const coa = list.map(s => s.coa);
  const prog = list.map(s => s.programming);

  const highest_student = [...list].sort((a, b) => b.average - a.average)[0] || null;
  const lowest_student = [...list].sort((a, b) => a.average - b.average)[0] || null;

  return {
    ...dash,
    fail_percentage: 100 - dash.pass_percentage,
    highest_avg_student: highest_student,
    lowest_avg_student: lowest_student,
    subject_averages: [
      { subject: "Mathematics", average: dash.subject_averages[0].average, highest: Math.max(...math, 0), lowest: Math.min(...math, 0) },
      { subject: "Computer Organization", average: dash.subject_averages[1].average, highest: Math.max(...coa, 0), lowest: Math.min(...coa, 0) },
      { subject: "Programming", average: dash.subject_averages[2].average, highest: Math.max(...prog, 0), lowest: Math.min(...prog, 0) }
    ]
  };
};

export const getReport = async (id) => {
  const remote = await request(`/reports/${id}`);
  if (remote) return remote;

  const { student } = await getStudent(id);
  return {
    student,
    institution: {
      name: "Institute of Technology",
      address: "Department of Computer Science & Engineering",
      exam: "Semester Examination 2024"
    },
    generated_at: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };
};

export const runSimulator = async (data) => {
  const remote = await request('/simulator/execute', { method: 'POST', body: JSON.stringify(data) });
  if (remote) return remote;

  const m = Number(data.mathematics);
  const c = Number(data.coa);
  const p = Number(data.programming);
  const total = m + c + p;
  const avg = Math.floor(total / 3);

  let grade = 'FAIL';
  if (avg >= 75) grade = 'DISTINCTION';
  else if (avg >= 60) grade = 'FIRST CLASS';
  else if (avg >= 50) grade = 'SECOND CLASS';

  const hex = (num) => num.toString(16).toUpperCase().padStart(4, '0');

  const steps = [
    { step: 1, instruction: "MOV AX, @DATA", description: "Initialize data segment register", registers: { AX: "DATA_SEG", BX: "0000", CX: "0000", DX: "0000" } },
    { step: 2, instruction: `MOV math_marks, ${m}`, description: `Load Mathematics marks (${m}) into memory`, registers: { AX: hex(m), BX: "0000", CX: "0000", DX: "0000" } },
    { step: 3, instruction: `MOV coa_marks, ${c}`, description: `Load COA marks (${c}) into memory`, registers: { AX: hex(c), BX: "0000", CX: "0000", DX: "0000" } },
    { step: 4, instruction: `MOV prog_marks, ${p}`, description: `Load Programming marks (${p}) into memory`, registers: { AX: hex(p), BX: "0000", CX: "0000", DX: "0000" } },
    { step: 5, instruction: `MOV AX, ${m}`, description: `Load Mathematics marks into AX register`, registers: { AX: hex(m), BX: "0000", CX: "0000", DX: "0000" } },
    { step: 6, instruction: `ADD AX, ${c}`, description: `Add COA marks: ${m} + ${c} = ${m + c}`, registers: { AX: hex(m + c), BX: "0000", CX: "0000", DX: "0000" } },
    { step: 7, instruction: `ADD AX, ${p}`, description: `Add Programming marks: ${m + c} + ${p} = ${total}`, registers: { AX: hex(total), BX: "0000", CX: "0000", DX: "0000" } },
    { step: 8, instruction: "MOV total, AX", description: `Store total (${total}) in memory`, registers: { AX: hex(total), BX: "0000", CX: "0000", DX: "0000" } },
    { step: 9, instruction: "MOV BX, 3", description: "Load divisor (3 subjects) into BX register", registers: { AX: hex(total), BX: "0003", CX: "0000", DX: "0000" } },
    { step: 10, instruction: "XOR DX, DX", description: "Clear DX register for 16-bit division", registers: { AX: hex(total), BX: "0003", CX: "0000", DX: "0000" } },
    { step: 11, instruction: "DIV BX", description: `Divide AX by BX: ${total} / 3 = ${avg} (rem ${total % 3})`, registers: { AX: hex(avg), BX: "0003", CX: "0000", DX: hex(total % 3) } },
    { step: 12, instruction: "MOV average, AX", description: `Store average (${avg}) in memory`, registers: { AX: hex(avg), BX: "0003", CX: "0000", DX: hex(total % 3) } },
    { step: 13, instruction: "CMP AX, 75", description: `Compare average (${avg}) with 75 for DISTINCTION`, registers: { AX: hex(avg), BX: "0003", CX: "0000", DX: hex(total % 3) } },
    { step: 14, instruction: `JGE/JL → ${grade}`, description: `Conditional jump: Grade determined as ${grade}`, registers: { AX: hex(avg), BX: "0003", CX: "0000", DX: hex(total % 3) } },
    { step: 15, instruction: "INT 21H (AH=09H)", description: `Display output: ${grade}`, registers: { AX: "0900", BX: "0003", CX: "0000", DX: "OFFSET" } },
    { step: 16, instruction: "INT 21H (AH=4CH)", description: "Terminate program and return to DOS", registers: { AX: "4C00", BX: "0003", CX: "0000", DX: "0000" } }
  ];

  const asmCode = `; ==============================================
; 8086 Assembly Program: Student Grade Calculator
; File: MARKS.ASM
; Processor: Intel 8086 | Assembler: MASM / TASM
; ==============================================

.MODEL SMALL
.STACK 100H

.DATA
    msg_title   DB '=== 8086 Student Grade Calculator ===', 0DH, 0AH, '$'
    msg_total   DB 0DH, 0AH, 'Total Marks: ', '$'
    msg_avg     DB 0DH, 0AH, 'Average: ', '$'
    msg_grade   DB 0DH, 0AH, 'Grade: ', '$'
    
    math_marks  DW ${m}
    coa_marks   DW ${c}
    prog_marks  DW ${p}
    total       DW 0
    average     DW 0

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX

    ; Calculate Total
    MOV AX, math_marks
    ADD AX, coa_marks
    ADD AX, prog_marks
    MOV total, AX

    ; Calculate Average
    MOV AX, total
    MOV BX, 3
    XOR DX, DX
    DIV BX
    MOV average, AX

    ; Determine Grade
    CMP AX, 75
    JGE GRADE_DIST
    CMP AX, 60
    JGE GRADE_FIRST
    CMP AX, 50
    JGE GRADE_SECOND
    JMP GRADE_FAIL

GRADE_DIST:
    ; DISTINCTION
    JMP TERMINATE

GRADE_FIRST:
    ; FIRST CLASS
    JMP TERMINATE

GRADE_SECOND:
    ; SECOND CLASS
    JMP TERMINATE

GRADE_FAIL:
    ; FAIL

TERMINATE:
    MOV AH, 4CH
    INT 21H
MAIN ENDP
END MAIN`;

  return {
    emulator_status: "NOT_CONNECTED",
    message: "8086 Emulator is not connected. Results are calculated using the software engine. Connect DOSBox or EMU8086 for actual assembly execution.",
    assembly_code: asmCode,
    registers: { AX: hex(avg), BX: "0003", CX: "0000", DX: hex(total % 3) },
    execution_steps: steps,
    software_result: {
      total,
      average: Math.round((total / 3) * 100) / 100,
      grade,
      result: avg >= 50 ? 'PASS' : 'FAIL',
      remarks: { 'DISTINCTION': 'Excellent Performance', 'FIRST CLASS': 'Very Good Performance', 'SECOND CLASS': 'Satisfactory Performance', 'FAIL': 'Needs Improvement' }[grade]
    }
  };
};

export const getSimulatorStatus = async () => {
  const remote = await request('/simulator/status');
  if (remote) return remote;
  return {
    status: "NOT_CONNECTED",
    message: "8086 Emulator is not connected. Configure DOSBox or EMU8086 path in Settings.",
    supported_emulators: ["DOSBox", "EMU8086", "TASM", "MASM"]
  };
};

export const resetData = async () => {
  const remote = await request('/settings/reset', { method: 'POST' });
  if (remote) return remote;
  localStorage.setItem('sspes_students', JSON.stringify(DEFAULT_STUDENTS));
  return { message: "Data reset successfully. Sample records restored." };
};

export const exportData = async () => {
  const remote = await request('/settings/export');
  if (remote) return remote;
  return { students: getStoredStudents(), exported_at: new Date().toISOString() };
};
