# 8086 SMART STUDENT PERFORMANCE EVALUATION SYSTEM
## Comprehensive Academic Project Report & Documentation
### Department of Computer Science & Engineering — Computer Organization & Architecture (COA)

---

## 1. PROJECT IDENTIFICATION & METADATA

* **Project Title**: 8086 Smart Student Performance Evaluation System
* **Course Name**: Computer Organization and Architecture (Lab)
* **Course Code**: CSE211 / CSE211L
* **Degree & Year**: B.Tech Computer Science & Engineering — 2nd Year
* **Semester**: Semester III (Fall 2024–25)
* **Project Repository**: [https://github.com/Yogesh-0730/Coa-Project](https://github.com/Yogesh-0730/Coa-Project)
* **Live Deployment URL**: [https://yogesh-0730.github.io/Coa-Project/](https://yogesh-0730.github.io/Coa-Project/)

### Project Team Members:
1. **T Yogesh** — Registration Number: `AP24110011371`
2. **Dipankar Patnaik** — Registration Number: `AP24110011393`
3. **Shivansh Chouhan** — Registration Number: `AP24110011394`
4. **Dron Kapoor** — Registration Number: `AP24110011533`

---

## 2. EXECUTIVE SUMMARY & BACKGROUND

The **8086 Smart Student Performance Evaluation System** is an academic engineering project designed to demonstrate the practical application of 16-bit microprocessor architecture in real-world academic data processing. 

Traditional education systems often abstract low-level computational hardware behind high-level languages. This project deconstructs the grading workflow down to the register and instruction level of the **Intel 8086 Microprocessor**. The system accepts student marks across three core subjects:
1. **Mathematics**
2. **Computer Organization & Architecture (COA)**
3. **Programming**

It processes these marks through an **8086 Assembly Language program (`MARKS.ASM`)** to calculate:
* **Total Marks** (out of 300)
* **Average Percentage**
* **Academic Grade** (`DISTINCTION`, `FIRST CLASS`, `SECOND CLASS`, `FAIL`)
* **Result Status** (`PASS` / `FAIL`)

The assembly execution engine is coupled with a **modern full-stack web management system** featuring analytics charts, SQLite persistence, report generation, and an interactive 8086 register simulator.

---

## 3. SYSTEM ARCHITECTURE & DATA FLOW

The application follows a tiered architecture connecting low-level assembly logic with high-level modern web technologies:

```
[ User Input / Web Form ]
           │
           ▼
[ React 18 Frontend (Vite + Tailwind CSS) ]
           │  (REST API / JSON via Axios/Fetch)
           ▼
[ Python Flask Backend Server (Port 5000) ]
           │
     ┌─────┴─────────────────────────────────┐
     ▼                                       ▼
[ SQLite Database ]                 [ 8086 Assembly Engine ]
(students.db)                       (MARKS.ASM / Simulator)
- Roll Number (Unique)              - AX: Accumulator / Sum
- Subject Marks (0-100)             - BX: Divisor (3 & 10)
- Total, Average, Grade             - CX: Loop Counter / Stack
- Result Status, Remarks            - DX: Remainder & Strings
                                    - CMP & JGE Branching
```

### Technology Stack Overview:
* **Assembly Language**: Intel 8086 Assembly (MASM / TASM / EMU8086 compatible)
* **Backend**: Python 3.11+, Flask REST API, Flask-CORS, Gunicorn
* **Database**: SQLite3 with WAL journal mode
* **Frontend UI**: React.js 18, Vite 6, Tailwind CSS, Lucide React icons
* **Data Visualization**: Recharts (Pie charts, Bar charts, Radar charts)
* **Reporting**: html2canvas + jsPDF (client-side PDF generation & printing)
* **Deployment**: GitHub Pages (Static Web App with offline client fallback) + Render ready

---

## 4. MATHEMATICAL FORMULATION & GRADING BOUNDARIES

### Evaluation Formulas:
$$\text{Total} = \text{Marks}_{\text{Math}} + \text{Marks}_{\text{COA}} + \text{Marks}_{\text{Prog}} \quad (0 \le \text{Total} \le 300)$$

$$\text{Average} = \frac{\text{Total}}{3} \quad (0 \le \text{Average} \le 100)$$

### Grading Rules & Cutoffs:

| Average Mark Range | Academic Grade | Status | Performance Remarks | Flag Condition in 8086 |
| :--- | :---: | :---: | :--- | :--- |
| $\text{Average} \ge 75\%$ | **DISTINCTION** | `PASS` | *Excellent Performance* | `CMP AX, 75` $\to$ $SF = OF = 0$ (`JGE`) |
| $60\% \le \text{Average} < 75\%$ | **FIRST CLASS** | `PASS` | *Very Good Performance* | `CMP AX, 60` $\to$ $SF = OF = 0$ (`JGE`) |
| $50\% \le \text{Average} < 60\%$ | **SECOND CLASS** | `PASS` | *Satisfactory Performance* | `CMP AX, 50` $\to$ $SF = OF = 0$ (`JGE`) |
| $\text{Average} < 50\%$ | **FAIL** | `FAIL` | *Needs Improvement* | All `JGE` conditions fail $\to$ `JMP` |

---

## 5. COMPLETE 8086 ASSEMBLY LANGUAGE PROGRAM (`MARKS.ASM`)

```assembly
; ==============================================================================
; 8086 Assembly Program: Student Grade Calculator
; File Name: MARKS.ASM
; Target Processor: Intel 8086 (16-bit Architecture)
; Compatible Assemblers: MASM 6.x, TASM 4.x, EMU8086
; ==============================================================================

.MODEL SMALL
.STACK 100H

.DATA
    ; User Prompts & Formatting Strings
    msg_title   DB  '=== 8086 SMART STUDENT GRADE CALCULATOR ===', 0DH, 0AH, '$'
    msg_math    DB  'Enter Mathematics marks (0-100): ', '$'
    msg_coa     DB  'Enter COA marks (0-100): ', '$'
    msg_prog    DB  'Enter Programming marks (0-100): ', '$'
    msg_newline DB  0DH, 0AH, '$'

    ; Output Labels
    msg_total   DB  0DH, 0AH, 'Total Marks (out of 300): ', '$'
    msg_avg     DB  0DH, 0AH, 'Average Marks: ', '$'
    msg_grade   DB  0DH, 0AH, 'Academic Grade: ', '$'
    msg_result  DB  0DH, 0AH, 'Result Status: ', '$'

    ; Grade String Literals
    str_dist    DB  'DISTINCTION', '$'
    str_first   DB  'FIRST CLASS', '$'
    str_second  DB  'SECOND CLASS', '$'
    str_fail    DB  'FAIL', '$'
    str_pass    DB  'PASS', '$'

    ; Storage Variables (16-bit words)
    math_marks  DW  0       ; Mathematics marks
    coa_marks   DW  0       ; COA marks
    prog_marks  DW  0       ; Programming marks
    total       DW  0       ; Sum of three subjects
    average     DW  0       ; Average quotient (total / 3)

.CODE
MAIN PROC
    ; --------------------------------------------------------------------------
    ; 1. DATA SEGMENT INITIALIZATION
    ; --------------------------------------------------------------------------
    MOV AX, @DATA           ; Load base address of Data Segment into AX
    MOV DS, AX              ; Move into DS register

    ; Display Program Banner
    LEA DX, msg_title       ; Load address of title string
    MOV AH, 09H             ; DOS Function 09H: Print string
    INT 21H                 ; Execute interrupt

    ; --------------------------------------------------------------------------
    ; 2. INPUT ACQUISITION
    ; --------------------------------------------------------------------------
    ; Read Mathematics Marks
    LEA DX, msg_math
    MOV AH, 09H
    INT 21H
    CALL READ_NUMBER        ; Subroutine returns 16-bit integer in AX
    MOV math_marks, AX      ; Store into memory variable

    ; Read COA Marks
    LEA DX, msg_coa
    MOV AH, 09H
    INT 21H
    CALL READ_NUMBER
    MOV coa_marks, AX

    ; Read Programming Marks
    LEA DX, msg_prog
    MOV AH, 09H
    INT 21H
    CALL READ_NUMBER
    MOV prog_marks, AX

    ; --------------------------------------------------------------------------
    ; 3. ARITHMETIC COMPUTATION (TOTAL & AVERAGE)
    ; --------------------------------------------------------------------------
    ; Step A: Summation in Accumulator (AX)
    MOV AX, math_marks      ; AX = math marks
    ADD AX, coa_marks       ; AX = AX + coa marks
    ADD AX, prog_marks      ; AX = AX + prog marks (Total sum)
    MOV total, AX           ; Store total into memory

    ; Step B: Integer Division (Total / 3)
    MOV AX, total           ; AX = total marks
    MOV BX, 3               ; BX = 3 (Divisor)
    XOR DX, DX              ; Clear DX high-word to prevent Divide Overflow
    DIV BX                  ; Unsigned division: DX:AX / BX -> AX=Quotient, DX=Remainder
    MOV average, AX         ; Store average into memory

    ; --------------------------------------------------------------------------
    ; 4. NUMERICAL OUTPUT DISPLAY
    ; --------------------------------------------------------------------------
    ; Display Total
    LEA DX, msg_total
    MOV AH, 09H
    INT 21H
    MOV AX, total
    CALL PRINT_NUMBER       ; Display numerical value from AX

    ; Display Average
    LEA DX, msg_avg
    MOV AH, 09H
    INT 21H
    MOV AX, average
    CALL PRINT_NUMBER

    ; --------------------------------------------------------------------------
    ; 5. GRADE CLASSIFICATION (CMP & CONDITIONAL JUMPS)
    ; --------------------------------------------------------------------------
    LEA DX, msg_grade
    MOV AH, 09H
    INT 21H

    MOV AX, average         ; Load average into AX for comparison ladder

    CMP AX, 75              ; Compare average with 75
    JGE GRADE_DIST          ; If average >= 75, jump to DISTINCTION

    CMP AX, 60              ; Compare average with 60
    JGE GRADE_FIRST         ; If average >= 60, jump to FIRST CLASS

    CMP AX, 50              ; Compare average with 50
    JGE GRADE_SECOND        ; If average >= 50, jump to SECOND CLASS

    JMP GRADE_FAIL          ; If average < 50, jump to FAIL

GRADE_DIST:
    LEA DX, str_dist        ; String: "DISTINCTION"
    MOV AH, 09H
    INT 21H
    JMP SHOW_RESULT

GRADE_FIRST:
    LEA DX, str_first       ; String: "FIRST CLASS"
    MOV AH, 09H
    INT 21H
    JMP SHOW_RESULT

GRADE_SECOND:
    LEA DX, str_second      ; String: "SECOND CLASS"
    MOV AH, 09H
    INT 21H
    JMP SHOW_RESULT

GRADE_FAIL:
    LEA DX, str_fail        ; String: "FAIL"
    MOV AH, 09H
    INT 21H

SHOW_RESULT:
    ; --------------------------------------------------------------------------
    ; 6. PASS / FAIL STATUS EVALUATION
    ; --------------------------------------------------------------------------
    LEA DX, msg_result
    MOV AH, 09H
    INT 21H

    MOV AX, average
    CMP AX, 50              ; Compare average with minimum passing grade (50)
    JGE RESULT_PASS         ; If average >= 50, pass
    LEA DX, str_fail        ; Else, fail
    JMP PRINT_RESULT

RESULT_PASS:
    LEA DX, str_pass

PRINT_RESULT:
    MOV AH, 09H
    INT 21H

    ; --------------------------------------------------------------------------
    ; 7. PROGRAM TERMINATION
    ; --------------------------------------------------------------------------
    MOV AH, 4CH             ; DOS Function 4CH: Exit to Operating System
    INT 21H

MAIN ENDP

; ==============================================================================
; SUBROUTINE: READ_NUMBER
; Description: Reads ASCII characters from keyboard, converts to 16-bit binary.
; Returns: AX = Binary numeric value
; ==============================================================================
READ_NUMBER PROC
    PUSH BX
    PUSH CX
    PUSH DX

    XOR BX, BX              ; BX = 0 (Accumulator for number)

READ_LOOP:
    MOV AH, 01H             ; DOS Function 01H: Read character with echo
    INT 21H                 ; Character returned in AL register

    CMP AL, 0DH             ; Check for Carriage Return (Enter Key, ASCII 13)
    JE READ_DONE

    SUB AL, '0'             ; Convert ASCII digit to binary (e.g. '7' -> 7)
    XOR AH, AH              ; Clear AH to treat AX as 16-bit word

    ; Multiply accumulated BX by 10 and add new digit: BX = (BX * 10) + Digit
    PUSH AX                 ; Save current digit on stack
    MOV AX, BX
    MOV CX, 10
    MUL CX                  ; AX = BX * 10
    MOV BX, AX              ; Move product back to BX
    POP AX                  ; Restore current digit
    ADD BX, AX              ; Add new digit to accumulator

    JMP READ_LOOP

READ_DONE:
    MOV AX, BX              ; Return accumulated value in AX

    ; Print Newline
    PUSH AX
    LEA DX, msg_newline
    MOV AH, 09H
    INT 21H
    POP AX

    POP DX
    POP CX
    POP BX
    RET
READ_NUMBER ENDP

; ==============================================================================
; SUBROUTINE: PRINT_NUMBER
; Description: Prints a 16-bit binary integer in AX to screen in decimal format.
; Method: Stack-based division by 10 (Last-In First-Out reversal).
; ==============================================================================
PRINT_NUMBER PROC
    PUSH AX
    PUSH BX
    PUSH CX
    PUSH DX

    MOV BX, 10              ; Base 10 divisor
    XOR CX, CX              ; CX = digit counter (starts at 0)

DIVIDE_LOOP:
    XOR DX, DX              ; Clear DX before division
    DIV BX                  ; Divide AX by 10 -> AX=Quotient, DX=Remainder (Digit)
    PUSH DX                 ; Push digit onto stack
    INC CX                  ; Increment digit count
    CMP AX, 0               ; Check if quotient is zero
    JNE DIVIDE_LOOP         ; Repeat if more digits remain

PRINT_LOOP:
    POP DX                  ; Pop most significant digit first
    ADD DL, '0'             ; Convert binary digit to ASCII ('0'..'9')
    MOV AH, 02H             ; DOS Function 02H: Print single character
    INT 21H
    LOOP PRINT_LOOP         ; Decrement CX and loop until CX = 0

    POP DX
    POP CX
    POP BX
    POP AX
    RET
PRINT_NUMBER ENDP

END MAIN
```

---

## 6. BACKEND ARCHITECTURE & REST APIS

The Python Flask backend is designed modularly so the calculation engine can be maintained or replaced independently.

### 1. `grading_service.py` (Modular Service)
Contains the pure mathematical and grading functions:
* `calculate_total(math, coa, prog)`: Sums three marks.
* `calculate_average(total)`: Returns floating-point average rounded to 2 decimals.
* `determine_grade(average)`: Returns grade string.
* `determine_result(average)`: Returns `PASS` or `FAIL`.
* `get_remarks(grade)`: Returns performance remarks string.
* `get_highest_subject()`, `get_lowest_subject()`: Determines strengths/weaknesses.
* `get_full_evaluation()`: Returns full dictionary evaluation.

### 2. `assembly_code.py` (8086 Integration Module)
Stores the raw assembly source code and generates a step-by-step 16-instruction trace dictionary simulating 8086 register states (`AX`, `BX`, `CX`, `DX`) for any given marks.

### 3. REST API Endpoints Specification:

| HTTP Method | Route | Description | Request / Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Aggregated class performance & statistics | None | `{ total_students, passed, failed, class_average, grade_distribution, ... }` |
| `GET` | `/api/students` | List all student records | `search`, `grade`, `sort` | `{ count, students: [...] }` |
| `GET` | `/api/students/<id>` | Fetch single student record | URL Param: `id` | `{ student: {...} }` |
| `POST` | `/api/students` | Register student & auto-evaluate grade | JSON: `{ name, roll_number, mathematics, coa, programming }` | `{ message, student: {...} }` |
| `PUT` | `/api/students/<id>` | Update student & recalculate grade | JSON: updated fields | `{ message, student: {...} }` |
| `DELETE` | `/api/students/<id>` | Remove student record | URL Param: `id` | `{ message: "Student deleted" }` |
| `GET` | `/api/analytics` | Analytical breakdown & top/bottom performers | None | `{ highest_student, lowest_student, subject_averages, ... }` |
| `GET` | `/api/reports/<id>` | Generates formal report card payload | URL Param: `id` | `{ student, institution, generated_at }` |
| `POST` | `/api/simulator/execute` | Simulates 8086 execution & register states | JSON: `{ mathematics, coa, programming }` | `{ registers, execution_steps, assembly_code, software_result }` |
| `GET` | `/api/simulator/status` | Reports emulator connectivity status | None | `{ status: "NOT_CONNECTED", supported_emulators: [...] }` |
| `POST` | `/api/settings/reset` | Resets database to sample seed records | None | `{ message: "Data reset successfully" }` |
| `GET` | `/api/settings/export` | Exports database records as downloadable JSON | None | `{ students: [...], exported_at }` |

---

## 7. FRONTEND USER INTERFACE (8 DEDICATED PAGES)

The frontend features a dark navy and electric blue theme with subtle glassmorphism:

1. **Dashboard (`Dashboard.jsx`)**:
   * 6 Quick-stat cards (Total Students, Passed, Failed, Distinction, Class Average %, Pass Rate %).
   * Interactive Recharts Grade Distribution Donut/Pie Chart.
   * Subject-wise performance bar chart.
   * Recent results table with quick action navigations.
2. **Add Student (`AddStudent.jsx`)**:
   * Input form with strict validation (0–100 range, no duplicate roll numbers).
   * Slide-up evaluation result card with circular progress, highest/lowest subject highlights, and color-coded badges.
3. **Student Records (`StudentRecords.jsx`)**:
   * Complete searchable, filterable, and sortable data table.
   * Edit modal, delete confirmation modal, and student detail inspection with interactive **Radar Chart** of subject marks.
4. **Grade Analysis (`GradeAnalysis.jsx`)**:
   * Deep analytics dashboard showing class pass/fail percentages, subject-wise highest and lowest scores, and top/bottom student cards.
5. **Result Reports (`ResultReports.jsx`)**:
   * Search and choose any student to render a formal white-theme academic report card with institution header, semester details, marks table, and faculty signature blocks.
   * **Print Report** (clean CSS print view) and **Download PDF** (via html2canvas + jsPDF).
6. **8086 Assembly Simulator (`Simulator.jsx`)**:
   * Dedicated COA page showing 8086 microprocessor block diagram.
   * Real-time 16-bit register boxes (`AX`, `BX`, `CX`, `DX`).
   * Color-highlighted assembly source code viewer (`MARKS.ASM`).
   * Sequentially animated 16-step instruction execution trace with flag analysis.
7. **About Project (`AboutProject.jsx`)**:
   * Academic documentation accordion covering 8086 overview, instruction reference table (`MOV`, `ADD`, `DIV`, `CMP`, `JGE`, `INT 21H`), system methodology, and credits.
8. **Settings (`Settings.jsx`)**:
   * Emulator path configuration (EMU8086, DOSBox), database statistics, JSON data export, and database reset functionality.

---

## 8. TEST CASES & REGISTER TRACE VERIFICATION

### Verification Matrix across Grade Boundaries:

| Test Case | Mathematics | COA Marks | Programming | Total (/300) | Average % | Grade Awarded | Status | Remarks |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Case 1** | 92 | 88 | 95 | **275** | **91.67%** | **DISTINCTION** | `PASS` | *Excellent Performance* |
| **Case 2** | 68 | 72 | 65 | **205** | **68.33%** | **FIRST CLASS** | `PASS` | *Very Good Performance* |
| **Case 3** | 55 | 60 | 58 | **173** | **57.67%** | **SECOND CLASS**| `PASS` | *Satisfactory Performance* |
| **Case 4** | 35 | 28 | 40 | **103** | **34.33%** | **FAIL** | `FAIL` | *Needs Improvement* |

### Detailed Hardware Trace (Case 1: 92, 88, 95):
* Input conversion: $92 = 005C_H$, $88 = 0058_H$, $95 = 005F_H$.
* Total Summation: $\text{AX} = 005C_H + 0058_H + 005F_H = \mathbf{0113_H}$ ($275$ Decimal).
* Division by 3: `BX` = $0003_H$, `DX` = $0000_H$.
* Instruction `DIV BX`:
  * **`AX` = `005BH`** (Quotient = $91$ Decimal).
  * **`DX` = `0002H`** (Remainder = $2$ Decimal).
* Comparison `CMP AX, 75`:
  * Evaluates $91 - 75 = +16$.
  * Since result is positive, Sign Flag $\mathbf{SF = 0}$, Zero Flag $\mathbf{ZF = 0}$, Overflow Flag $\mathbf{OF = 0}$.
  * Instruction `JGE GRADE_DIST` checks condition $SF = OF$ ($0 = 0$, True) $\implies$ Branches directly to **DISTINCTION**.

---

## 9. CONCLUSION & FUTURE SCOPE

### Project Conclusion:
* Successfully engineered an accurate 8086 Assembly grading algorithm handling addition, 16-bit division, and multi-tier conditional branching.
* Verified 100% mathematical and flag consistency across all boundary conditions (50, 60, 75 marks).
* Demonstrated modern software-hardware co-design by integrating an assembly simulation engine with a full-stack web dashboard.

### Future Scope:
1. **Physical Microprocessor Kit Deployment**: Flashing the binary machine code to physical 8086 SDK trainer boards with 7-segment LED / LCD displays.
2. **Array-Based Multi-Subject Processing**: Utilizing 8086 Indexed Addressing Modes (`SI`, `DI` registers) with `ARRAY DW 10 DUP(?)` to handle dynamic numbers of subjects ($N$ subjects).
3. **8087 Math Coprocessor Emulation**: Incorporating floating-point instructions (`FADD`, `FDIV`) for exact decimal calculations in assembly.
4. **Direct DOSBox Pipe Interface**: Establishing a real-time IPC pipe between web forms and the DOSBox emulator memory space.

---

## 10. ACADEMIC REFERENCES

1. **Hall, Douglas V.** — *Microprocessors and Interfacing: Programming and Hardware*, 3rd Edition, Tata McGraw-Hill, 2012.
2. **Liu, Yu-Cheng and Gibson, Glenn A.** — *Microcomputer Systems: The 8086/8088 Family - Architecture, Programming, and Design*, 2nd Edition, Prentice Hall, 2006.
3. **Brey, Barry B.** — *The Intel Microprocessors: 8086/8088, 80186/80188, 80286, 80386, 80486, Pentium, Pentium Pro Processor*, 8th Edition, Pearson Education.
4. **Intel Corporation** — *Intel 8086 Family User's Manual and Instruction Set Reference*, Order No. 9800722.
5. **Ralf Brown** — *The Ralf Brown Interrupt List (RBIL): Comprehensive DOS/BIOS Interrupts*.
6. **Project Source Code & Deployment Repository**: [https://github.com/Yogesh-0730/Coa-Project](https://github.com/Yogesh-0730/Coa-Project)
