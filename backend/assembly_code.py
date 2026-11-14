"""
8086 Assembly Code Module
Contains the actual 8086 assembly program for student grade calculation.
"""

ASSEMBLY_SOURCE = """; ==============================================
; 8086 Assembly Program: Student Grade Calculator
; File: MARKS.ASM
; Description: Accept marks for 3 subjects,
;              calculate total, average, and grade
; Processor: Intel 8086
; Assembler: MASM / TASM compatible
; ==============================================

.MODEL SMALL
.STACK 100H

.DATA
    ; Input prompts
    msg_title   DB  '=== Student Grade Calculator ===', 0DH, 0AH, '$'
    msg_math    DB  'Enter Mathematics marks (0-100): ', '$'
    msg_coa     DB  'Enter COA marks (0-100): ', '$'
    msg_prog    DB  'Enter Programming marks (0-100): ', '$'
    msg_newline DB  0DH, 0AH, '$'

    ; Output labels
    msg_total   DB  0DH, 0AH, 'Total Marks: ', '$'
    msg_avg     DB  0DH, 0AH, 'Average: ', '$'
    msg_grade   DB  0DH, 0AH, 'Grade: ', '$'
    msg_result  DB  0DH, 0AH, 'Result: ', '$'

    ; Grade strings
    str_dist    DB  'DISTINCTION', '$'
    str_first   DB  'FIRST CLASS', '$'
    str_second  DB  'SECOND CLASS', '$'
    str_fail    DB  'FAIL', '$'
    str_pass    DB  'PASS', '$'

    ; Variables
    math_marks  DW  0       ; Mathematics marks
    coa_marks   DW  0       ; COA marks
    prog_marks  DW  0       ; Programming marks
    total       DW  0       ; Total marks
    average     DW  0       ; Average marks
    buffer      DB  4, ?, 4 DUP(0)  ; Input buffer

.CODE
MAIN PROC
    ; Initialize Data Segment
    MOV AX, @DATA           ; Load data segment address
    MOV DS, AX              ; Set DS register

    ; Display title
    LEA DX, msg_title       ; Load address of title
    MOV AH, 09H             ; DOS print string function
    INT 21H                 ; Call DOS interrupt

    ; --- Input Mathematics Marks ---
    LEA DX, msg_math        ; Display prompt
    MOV AH, 09H
    INT 21H

    CALL READ_NUMBER        ; Read number into AX
    MOV math_marks, AX      ; Store mathematics marks

    ; --- Input COA Marks ---
    LEA DX, msg_coa         ; Display prompt
    MOV AH, 09H
    INT 21H

    CALL READ_NUMBER        ; Read number into AX
    MOV coa_marks, AX       ; Store COA marks

    ; --- Input Programming Marks ---
    LEA DX, msg_prog        ; Display prompt
    MOV AH, 09H
    INT 21H

    CALL READ_NUMBER        ; Read number into AX
    MOV prog_marks, AX      ; Store programming marks

    ; === CALCULATION SECTION ===

    ; Calculate Total = math + coa + programming
    MOV AX, math_marks      ; AX = mathematics marks
    ADD AX, coa_marks        ; AX = AX + COA marks
    ADD AX, prog_marks       ; AX = AX + programming marks
    MOV total, AX            ; Store total

    ; Calculate Average = Total / 3
    MOV AX, total            ; AX = total
    MOV BX, 3                ; BX = divisor (3 subjects)
    XOR DX, DX               ; Clear DX for division
    DIV BX                   ; AX = AX / BX (quotient)
    MOV average, AX          ; Store average (integer part)

    ; === DISPLAY RESULTS ===

    ; Display Total
    LEA DX, msg_total
    MOV AH, 09H
    INT 21H
    MOV AX, total
    CALL PRINT_NUMBER

    ; Display Average
    LEA DX, msg_avg
    MOV AH, 09H
    INT 21H
    MOV AX, average
    CALL PRINT_NUMBER

    ; === GRADE DETERMINATION ===
    ; Compare average with grade boundaries

    LEA DX, msg_grade
    MOV AH, 09H
    INT 21H

    MOV AX, average

    CMP AX, 75              ; Compare with 75
    JGE GRADE_DIST           ; If avg >= 75, DISTINCTION

    CMP AX, 60              ; Compare with 60
    JGE GRADE_FIRST          ; If avg >= 60, FIRST CLASS

    CMP AX, 50              ; Compare with 50
    JGE GRADE_SECOND         ; If avg >= 50, SECOND CLASS

    JMP GRADE_FAIL           ; Otherwise, FAIL

GRADE_DIST:
    LEA DX, str_dist         ; Load "DISTINCTION"
    MOV AH, 09H
    INT 21H
    JMP SHOW_RESULT

GRADE_FIRST:
    LEA DX, str_first        ; Load "FIRST CLASS"
    MOV AH, 09H
    INT 21H
    JMP SHOW_RESULT

GRADE_SECOND:
    LEA DX, str_second       ; Load "SECOND CLASS"
    MOV AH, 09H
    INT 21H
    JMP SHOW_RESULT

GRADE_FAIL:
    LEA DX, str_fail         ; Load "FAIL"
    MOV AH, 09H
    INT 21H

SHOW_RESULT:
    ; Display Result (PASS/FAIL)
    LEA DX, msg_result
    MOV AH, 09H
    INT 21H

    MOV AX, average
    CMP AX, 50              ; Compare with pass mark
    JGE RESULT_PASS          ; If avg >= 50, PASS
    LEA DX, str_fail
    JMP PRINT_RESULT

RESULT_PASS:
    LEA DX, str_pass

PRINT_RESULT:
    MOV AH, 09H
    INT 21H

    ; Exit program
    MOV AH, 4CH             ; DOS terminate function
    INT 21H                 ; Call DOS interrupt

MAIN ENDP

; ====================================
; Procedure: READ_NUMBER
; Reads a multi-digit number from keyboard
; Returns: AX = number read
; ====================================
READ_NUMBER PROC
    PUSH BX
    PUSH CX
    PUSH DX

    XOR BX, BX              ; BX = accumulated number = 0

READ_LOOP:
    MOV AH, 01H             ; DOS read character function
    INT 21H                 ; AL = character read

    CMP AL, 0DH             ; Check for Enter key
    JE READ_DONE             ; If Enter, done reading

    SUB AL, '0'              ; Convert ASCII to digit
    XOR AH, AH              ; Clear AH

    ; BX = BX * 10 + digit
    PUSH AX                  ; Save digit
    MOV AX, BX
    MOV CX, 10
    MUL CX                   ; AX = BX * 10
    MOV BX, AX
    POP AX                   ; Restore digit
    ADD BX, AX               ; BX = BX * 10 + digit

    JMP READ_LOOP

READ_DONE:
    MOV AX, BX               ; Return result in AX

    ; Print newline
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

; ====================================
; Procedure: PRINT_NUMBER
; Prints a number in AX to screen
; ====================================
PRINT_NUMBER PROC
    PUSH AX
    PUSH BX
    PUSH CX
    PUSH DX

    MOV BX, 10               ; Divisor
    XOR CX, CX               ; Digit counter = 0

DIVIDE_LOOP:
    XOR DX, DX               ; Clear DX
    DIV BX                    ; AX = quotient, DX = remainder
    PUSH DX                   ; Push remainder (digit)
    INC CX                    ; Increment counter
    CMP AX, 0
    JNE DIVIDE_LOOP           ; Continue if quotient != 0

PRINT_LOOP:
    POP DX                    ; Pop digit
    ADD DL, '0'               ; Convert to ASCII
    MOV AH, 02H              ; DOS print character
    INT 21H
    LOOP PRINT_LOOP           ; Repeat for all digits

    POP DX
    POP CX
    POP BX
    POP AX
    RET
PRINT_NUMBER ENDP

END MAIN
"""


def get_assembly_code():
    """Return the 8086 assembly source code."""
    return ASSEMBLY_SOURCE


def get_execution_steps(mathematics, coa, programming):
    """
    Return a list of execution step descriptions showing how the
    8086 assembly program would process the given marks.
    """
    total = mathematics + coa + programming
    average = total // 3

    if average >= 75:
        grade = "DISTINCTION"
    elif average >= 60:
        grade = "FIRST CLASS"
    elif average >= 50:
        grade = "SECOND CLASS"
    else:
        grade = "FAIL"

    steps = [
        {
            "step": 1,
            "instruction": "MOV AX, @DATA",
            "description": "Initialize data segment register",
            "registers": {"AX": "DATA_SEG", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 2,
            "instruction": f"MOV math_marks, {mathematics}",
            "description": f"Load Mathematics marks ({mathematics}) into memory via keyboard input",
            "registers": {"AX": f"{mathematics:04X}", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 3,
            "instruction": f"MOV coa_marks, {coa}",
            "description": f"Load COA marks ({coa}) into memory via keyboard input",
            "registers": {"AX": f"{coa:04X}", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 4,
            "instruction": f"MOV prog_marks, {programming}",
            "description": f"Load Programming marks ({programming}) into memory via keyboard input",
            "registers": {"AX": f"{programming:04X}", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 5,
            "instruction": f"MOV AX, {mathematics}",
            "description": f"Load Mathematics marks into AX register",
            "registers": {"AX": f"{mathematics:04X}", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 6,
            "instruction": f"ADD AX, {coa}",
            "description": f"Add COA marks to AX: {mathematics} + {coa} = {mathematics + coa}",
            "registers": {"AX": f"{mathematics + coa:04X}", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 7,
            "instruction": f"ADD AX, {programming}",
            "description": f"Add Programming marks to AX: {mathematics + coa} + {programming} = {total}",
            "registers": {"AX": f"{total:04X}", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 8,
            "instruction": "MOV total, AX",
            "description": f"Store total ({total}) in memory",
            "registers": {"AX": f"{total:04X}", "BX": "0000", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 9,
            "instruction": "MOV BX, 3",
            "description": "Load divisor (3 subjects) into BX register",
            "registers": {"AX": f"{total:04X}", "BX": "0003", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 10,
            "instruction": "XOR DX, DX",
            "description": "Clear DX register for division",
            "registers": {"AX": f"{total:04X}", "BX": "0003", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
        {
            "step": 11,
            "instruction": "DIV BX",
            "description": f"Divide AX by BX: {total} / 3 = {average} (remainder {total % 3})",
            "registers": {"AX": f"{average:04X}", "BX": "0003", "CX": "0000", "DX": f"{total % 3:04X}"},
            "status": "completed",
        },
        {
            "step": 12,
            "instruction": "MOV average, AX",
            "description": f"Store average ({average}) in memory",
            "registers": {"AX": f"{average:04X}", "BX": "0003", "CX": "0000", "DX": f"{total % 3:04X}"},
            "status": "completed",
        },
        {
            "step": 13,
            "instruction": "CMP AX, 75",
            "description": f"Compare average ({average}) with 75 for DISTINCTION check",
            "registers": {"AX": f"{average:04X}", "BX": "0003", "CX": "0000", "DX": f"{total % 3:04X}"},
            "status": "completed",
        },
        {
            "step": 14,
            "instruction": f"JGE/JL → {grade}",
            "description": f"Conditional jump: Average = {average}, Grade determined as {grade}",
            "registers": {"AX": f"{average:04X}", "BX": "0003", "CX": "0000", "DX": f"{total % 3:04X}"},
            "status": "completed",
        },
        {
            "step": 15,
            "instruction": "INT 21H (AH=09H)",
            "description": f"Display result: Grade = {grade}, Result = {'PASS' if average >= 50 else 'FAIL'}",
            "registers": {"AX": "0900", "BX": "0003", "CX": "0000", "DX": "OFFSET"},
            "status": "completed",
        },
        {
            "step": 16,
            "instruction": "INT 21H (AH=4CH)",
            "description": "Terminate program and return to DOS",
            "registers": {"AX": "4C00", "BX": "0003", "CX": "0000", "DX": "0000"},
            "status": "completed",
        },
    ]

    return steps
