import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Colors
    NAVY_DARK = RGBColor(10, 17, 40)       # #0a1128
    NAVY_CARD = RGBColor(22, 32, 78)       # #16204e
    ELECTRIC_BLUE = RGBColor(0, 128, 255)  # #0080ff
    ACCENT_CYAN = RGBColor(0, 212, 255)    # #00d4ff
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(180, 195, 220)
    BORDER_COLOR = RGBColor(49, 67, 118)
    GREEN = RGBColor(16, 185, 129)
    AMBER = RGBColor(245, 158, 11)

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = NAVY_DARK
        bg.line.fill.background()
        
        # Subtle top accent bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
        bar.fill.solid()
        bar.fill.fore_color.rgb = ELECTRIC_BLUE
        bar.line.fill.background()

    def add_header(slide, title_text, category="COA ACADEMIC PROJECT PRESENTATION"):
        # Category / Course
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT_CYAN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.7))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s1)

    # Title & Subtitle Card
    title_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.7), Inches(11.733), Inches(2.2))
    title_card.fill.solid()
    title_card.fill.fore_color.rgb = NAVY_CARD
    title_card.line.color.rgb = ELECTRIC_BLUE
    title_card.line.width = Pt(1.5)

    tf1 = title_card.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "COMPUTER ORGANIZATION & ARCHITECTURE (COA)"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = ACCENT_CYAN
    p1.alignment = PP_ALIGN.CENTER

    p2 = tf1.add_paragraph()
    p2.text = "8086 SMART STUDENT PERFORMANCE EVALUATION SYSTEM"
    p2.font.size = Pt(25)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE
    p2.alignment = PP_ALIGN.CENTER

    p3 = tf1.add_paragraph()
    p3.text = "An Intel 8086 Assembly Language Academic Evaluation & Hardware Simulation Engine"
    p3.font.size = Pt(13)
    p3.font.color.rgb = TEXT_MUTED
    p3.alignment = PP_ALIGN.CENTER

    # Left Card: Course Details
    c_left = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.2), Inches(5.6), Inches(3.6))
    c_left.fill.solid()
    c_left.fill.fore_color.rgb = NAVY_CARD
    c_left.line.color.rgb = BORDER_COLOR

    tf_cl = c_left.text_frame
    tf_cl.word_wrap = True
    p_cl_title = tf_cl.paragraphs[0]
    p_cl_title.text = "COURSE & ACADEMIC DETAILS"
    p_cl_title.font.size = Pt(15)
    p_cl_title.font.bold = True
    p_cl_title.font.color.rgb = ELECTRIC_BLUE

    details = [
        ("Course Name:", "Computer Organization & Architecture (Lab)"),
        ("Course Code:", "CSE211 / CSE211L"),
        ("Department:", "Computer Science & Engineering"),
        ("Degree & Year:", "B.Tech CSE - 2nd Year"),
        ("Semester:", "Semester III (Fall 2024-25)"),
        ("Microprocessor:", "Intel 8086 (16-bit Architecture)")
    ]

    for label, val in details:
        p_row = tf_cl.add_paragraph()
        p_row.text = f"{label} {val}"
        p_row.font.size = Pt(12)
        p_row.font.color.rgb = TEXT_MUTED
        p_row.space_before = Pt(6)

    # Right Card: Group Members
    c_right = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(3.2), Inches(5.6), Inches(3.6))
    c_right.fill.solid()
    c_right.fill.fore_color.rgb = NAVY_CARD
    c_right.line.color.rgb = BORDER_COLOR

    tf_cr = c_right.text_frame
    tf_cr.word_wrap = True
    p_cr_title = tf_cr.paragraphs[0]
    p_cr_title.text = "PROJECT GROUP MEMBERS"
    p_cr_title.font.size = Pt(15)
    p_cr_title.font.bold = True
    p_cr_title.font.color.rgb = ACCENT_CYAN

    members = [
        ("1. T Yogesh", "AP24110011371"),
        ("2. Dipankar Patnaik", "AP24110011393"),
        ("3. Shivansh Chouhan", "AP24110011394"),
        ("4. Dron Kapoor", "AP24110011533"),
    ]

    for name, reg in members:
        p_m = tf_cr.add_paragraph()
        p_m.text = f"{name}"
        p_m.font.size = Pt(13)
        p_m.font.bold = True
        p_m.font.color.rgb = TEXT_WHITE
        p_m.space_before = Pt(10)
        
        p_reg = tf_cr.add_paragraph()
        p_reg.text = f"   Registration No: {reg}"
        p_reg.font.size = Pt(12)
        p_reg.font.color.rgb = ELECTRIC_BLUE

    # -------------------------------------------------------------
    # SLIDE 2: INTRODUCTION & RELEVANCE
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s2)
    add_header(s2, "Introduction & Project Relevance")

    # Left Box: Project Objectives
    b2_left = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2))
    b2_left.fill.solid()
    b2_left.fill.fore_color.rgb = NAVY_CARD
    b2_left.line.color.rgb = BORDER_COLOR

    tf2_l = b2_left.text_frame
    tf2_l.word_wrap = True
    p = tf2_l.paragraphs[0]
    p.text = "PROJECT OBJECTIVES"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = ELECTRIC_BLUE

    objs = [
        "1. Academic Computation in 8086 ASM: Implement an end-to-end student grading system directly in Intel 8086 Assembly Language.",
        "2. Low-Level Register Manipulation: Utilize 8086 registers (AX, BX, CX, DX) for 16-bit multi-operand arithmetic.",
        "3. Algorithmic Grading Logic: Implement division (DIV) and comparison-based branching (CMP, JGE, JL) for accurate grade classification.",
        "4. Hardware Simulation & Verification: Trace assembly instruction execution and observe CPU flags (ZF, CF, SF) across boundary conditions.",
        "5. Architectural Integration: Bridge low-level assembly execution with a modern academic dashboard for presentation and evaluation."
    ]
    for o in objs:
        po = tf2_l.add_paragraph()
        po.text = o
        po.font.size = Pt(12)
        po.font.color.rgb = TEXT_MUTED
        po.space_before = Pt(10)

    # Right Box: Relevance & Motivation
    b2_right = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2))
    b2_right.fill.solid()
    b2_right.fill.fore_color.rgb = NAVY_CARD
    b2_right.line.color.rgb = BORDER_COLOR

    tf2_r = b2_right.text_frame
    tf2_r.word_wrap = True
    p = tf2_r.paragraphs[0]
    p.text = "RELEVANCE TO COA CURRICULUM"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    relevances = [
        "• Real-World ALU Application: Moves beyond simple single-step arithmetic to complex multi-step real-world evaluation.",
        "• Deep Understanding of 16-Bit Architecture: Demonstrates how byte-oriented ASCII inputs are parsed into 16-bit binary words and stored in memory.",
        "• Flags & Branching Analysis: Illustrates how the 8086 Status Register (Flag register) dictates program flow through Conditional Jump instructions.",
        "• Stack & Subroutines: Implements modular reusable procedures (READ_NUMBER, PRINT_NUMBER) using PUSH, POP, CALL, and RET.",
        "• Bridging Hardware & Modern UI: Demonstrates how modern computing systems interface with underlying microprocessor instruction sets."
    ]
    for r in relevances:
        pr = tf2_r.add_paragraph()
        pr.text = r
        pr.font.size = Pt(12)
        pr.font.color.rgb = TEXT_MUTED
        pr.space_before = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 3: METHODOLOGY
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s3)
    add_header(s3, "Project Methodology: I/O Variables & Workflow")

    # Card 1: Input Variables
    card_in = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(3.6), Inches(2.4))
    card_in.fill.solid()
    card_in.fill.fore_color.rgb = NAVY_CARD
    card_in.line.color.rgb = ELECTRIC_BLUE

    tf_in = card_in.text_frame
    tf_in.word_wrap = True
    p = tf_in.paragraphs[0]
    p.text = "INPUT VARIABLES"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ELECTRIC_BLUE

    inputs = [
        "• math_marks : DW (16-bit, 0-100)",
        "• coa_marks : DW (16-bit, 0-100)",
        "• prog_marks : DW (16-bit, 0-100)",
        "• Source: User keyboard input via DOS INT 21H, AH=01H"
    ]
    for i in inputs:
        pi = tf_in.add_paragraph()
        pi.text = i
        pi.font.size = Pt(11)
        pi.font.color.rgb = TEXT_MUTED
        pi.space_before = Pt(4)

    # Card 2: Output Variables
    card_out = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(1.6), Inches(3.6), Inches(2.4))
    card_out.fill.solid()
    card_out.fill.fore_color.rgb = NAVY_CARD
    card_out.line.color.rgb = ACCENT_CYAN

    tf_out = card_out.text_frame
    tf_out.word_wrap = True
    p = tf_out.paragraphs[0]
    p.text = "OUTPUT VARIABLES"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    outputs = [
        "• total : DW (Sum out of 300)",
        "• average : DW (Quotient: total / 3)",
        "• grade : String (DISTINCTION / FIRST / SECOND / FAIL)",
        "• result : String (PASS / FAIL)",
        "• Destination: Display via INT 21H, AH=09H"
    ]
    for o in outputs:
        po = tf_out.add_paragraph()
        po.text = o
        po.font.size = Pt(11)
        po.font.color.rgb = TEXT_MUTED
        po.space_before = Pt(4)

    # Card 3: Grade Classification Rules
    card_rules = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.6), Inches(3.7), Inches(2.4))
    card_rules.fill.solid()
    card_rules.fill.fore_color.rgb = NAVY_CARD
    card_rules.line.color.rgb = GREEN

    tf_rules = card_rules.text_frame
    tf_rules.word_wrap = True
    p = tf_rules.paragraphs[0]
    p.text = "GRADING BOUNDARIES"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = GREEN

    rules = [
        "• Average >= 75  →  DISTINCTION (Pass)",
        "• 60 <= Avg < 75 →  FIRST CLASS (Pass)",
        "• 50 <= Avg < 60 →  SECOND CLASS (Pass)",
        "• Average < 50   →  FAIL",
        "• Remarks: Generated automatically"
    ]
    for r in rules:
        pr = tf_rules.add_paragraph()
        pr.text = r
        pr.font.size = Pt(11)
        pr.font.color.rgb = TEXT_MUTED
        pr.space_before = Pt(4)

    # Bottom Banner: Steps involved
    banner = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(11.7), Inches(2.5))
    banner.fill.solid()
    banner.fill.fore_color.rgb = NAVY_CARD
    banner.line.color.rgb = BORDER_COLOR

    tf_b = banner.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    p.text = "EXECUTION WORKFLOW & STEPS INVOLVED"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    steps = [
        "Step 1: Input Acquisition & ASCII-to-Binary Conversion (Subroutine READ_NUMBER accumulates multi-digit decimal into AX).",
        "Step 2: Total Summation in AX register using successive ADD instructions (math + coa + programming).",
        "Step 3: Average Calculation using 16-bit division (DIV BX with BX=3; Quotient in AX, Remainder in DX).",
        "Step 4: Grade Evaluation via Sequential Comparison (CMP AX, 75 / 60 / 50) and Conditional Jump (JGE, JL).",
        "Step 5: Output Generation (Subroutine PRINT_NUMBER converts binary word back to ASCII characters via stack popping)."
    ]
    for s in steps:
        ps = tf_b.add_paragraph()
        ps.text = s
        ps.font.size = Pt(11.5)
        ps.font.color.rgb = TEXT_MUTED
        ps.space_before = Pt(5)

    # -------------------------------------------------------------
    # SLIDE 4: IMPLEMENTATION & TOOLS USED
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s4)
    add_header(s4, "Implementation: 8086 Instructions & Tool Stack")

    # Left: Instructions Table / Highlights
    b4_left = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(6.5), Inches(5.2))
    b4_left.fill.solid()
    b4_left.fill.fore_color.rgb = NAVY_CARD
    b4_left.line.color.rgb = BORDER_COLOR

    tf4_l = b4_left.text_frame
    tf4_l.word_wrap = True
    p = tf4_l.paragraphs[0]
    p.text = "KEY 8086 INSTRUCTIONS IMPLEMENTED"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = ELECTRIC_BLUE

    insts = [
        ("MOV AX, @DATA / MOV DS, AX", "Initializes Data Segment pointer to locate program variables."),
        ("ADD AX, coa_marks", "Performs 16-bit binary addition of subject marks in Accumulator."),
        ("XOR DX, DX / DIV BX", "Clears high-order word in DX; divides DX:AX by BX (3) for average."),
        ("CMP AX, 75", "Subtracts immediate value 75 from AX to update Zero, Carry & Sign flags."),
        ("JGE GRADE_DIST", "Jump if Greater or Equal (SF = OF) for grade classification branch."),
        ("INT 21H (AH=01H / 02H / 09H)", "DOS interrupt for character input, character display & string display."),
        ("PUSH / POP / LOOP", "Stack preservation and looping during multi-digit ASCII print routines.")
    ]
    for code, desc in insts:
        p_c = tf4_l.add_paragraph()
        p_c.text = f"• {code}"
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = ACCENT_CYAN
        p_c.space_before = Pt(4)

        p_d = tf4_l.add_paragraph()
        p_d.text = f"  {desc}"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED

    # Right: Architecture & Tools
    b4_right = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.7), Inches(1.6), Inches(4.8), Inches(5.2))
    b4_right.fill.solid()
    b4_right.fill.fore_color.rgb = NAVY_CARD
    b4_right.line.color.rgb = BORDER_COLOR

    tf4_r = b4_right.text_frame
    tf4_r.word_wrap = True
    p = tf4_r.paragraphs[0]
    p.text = "8086 REGISTERS & TOOLS STACK"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = GREEN

    items = [
        ("REGISTERS UTILIZATION:", [
            "• AX (Accumulator): I/O buffer, summation, division quotient",
            "• BX (Base Register): Divisors (3 for avg, 10 for ASCII)",
            "• CX (Count Register): Loop counter for digit reversal stack",
            "• DX (Data Register): Division remainder & string memory offsets"
        ]),
        ("SOFTWARE & EMULATION TOOLS:", [
            "• EMU8086: Microprocessor emulation and register step-tracing",
            "• DOSBox / MASM: 16-bit real-mode runtime verification",
            "• Python Flask Backend: REST API engine & evaluation service",
            "• React.js Frontend: Dashboard UI, Recharts analytics & reports"
        ])
    ]

    for header, subitems in items:
        p_h = tf4_r.add_paragraph()
        p_h.text = header
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_WHITE
        p_h.space_before = Pt(8)

        for s in subitems:
            ps = tf4_r.add_paragraph()
            ps.text = s
            ps.font.size = Pt(10)
            ps.font.color.rgb = TEXT_MUTED
            ps.space_before = Pt(2)

    # -------------------------------------------------------------
    # SLIDE 5: RESULTS & OUTPUT ANALYSIS
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s5)
    add_header(s5, "Results: Test Cases & Execution Verification")

    # Table of Test Cases
    table_shape = s5.shapes.add_table(5, 7, Inches(0.8), Inches(1.6), Inches(11.7), Inches(2.2))
    table = table_shape.table

    headers = ["Test Case", "Math (100)", "COA (100)", "Prog (100)", "Total (300)", "Average %", "Grade & Result"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = ELECTRIC_BLUE
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER

    test_data = [
        ("Case 1: Distinction", "92", "88", "95", "275", "91.67%", "DISTINCTION (Pass)"),
        ("Case 2: First Class", "68", "72", "65", "205", "68.33%", "FIRST CLASS (Pass)"),
        ("Case 3: Second Class", "55", "60", "58", "173", "57.67%", "SECOND CLASS (Pass)"),
        ("Case 4: Fail / Remedial", "35", "28", "40", "103", "34.33%", "FAIL (Needs Improvement)")
    ]

    for row_idx, row in enumerate(test_data, start=1):
        for col_idx, text in enumerate(row):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = NAVY_CARD
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.size = Pt(10.5)
            p.alignment = PP_ALIGN.CENTER
            if "Pass" in text:
                p.font.color.rgb = GREEN
            elif "Fail" in text or "FAIL" in text:
                p.font.color.rgb = AMBER
            else:
                p.font.color.rgb = TEXT_WHITE

    # Lower Half: Execution Details & Register States
    c_lower = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.2), Inches(11.7), Inches(2.6))
    c_lower.fill.solid()
    c_lower.fill.fore_color.rgb = NAVY_CARD
    c_lower.line.color.rgb = BORDER_COLOR

    tf_low = c_lower.text_frame
    tf_low.word_wrap = True
    p = tf_low.paragraphs[0]
    p.text = "OUTPUT VERIFICATION & 8086 REGISTER TRACE"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    traces = [
        "• Sample Execution Trace (Case 1: 92 + 88 + 95 = 275):",
        "   - After Summation: AX = 0113H (275 Decimal), BX = 0003H, DX = 0000H",
        "   - After DIV BX:    AX = 005BH (91 Decimal Quotient), DX = 0002H (Remainder 2)",
        "   - After CMP AX, 75: Flag Register ZF=0, CF=0, SF=0 (Result positive) → JGE branches to GRADE_DIST",
        "• Academic Dashboard Output: Verified in web interface with Recharts performance analytics, student database records, and printable academic grade cards.",
        "• Live Demonstration Link: Available on GitHub at https://yogesh-0730.github.io/Coa-Project/"
    ]
    for tr in traces:
        ptr = tf_low.add_paragraph()
        ptr.text = tr
        ptr.font.size = Pt(11)
        ptr.font.color.rgb = TEXT_MUTED
        ptr.space_before = Pt(3)

    # -------------------------------------------------------------
    # SLIDE 6: CONCLUSION & FUTURE SCOPE
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s6)
    add_header(s6, "Conclusion & Future Scope")

    # Left: Conclusion
    b6_left = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2))
    b6_left.fill.solid()
    b6_left.fill.fore_color.rgb = NAVY_CARD
    b6_left.line.color.rgb = BORDER_COLOR

    tf6_l = b6_left.text_frame
    tf6_l.word_wrap = True
    p = tf6_l.paragraphs[0]
    p.text = "PROJECT CONCLUSION"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = GREEN

    conclusions = [
        "1. Successful Assembly Implementation: Successfully designed and validated a modular Intel 8086 Assembly Program for student evaluation.",
        "2. Precise Architectural Operation: Validated 16-bit register manipulation, division algorithms, stack operations, and flag-based branching.",
        "3. Zero Edge-Case Failure: Tested across strict boundary limits (50, 60, 75 marks); all student categories evaluated correctly.",
        "4. Hardware-Software Synergy: Demonstrated how low-level microprocessor concepts integrate into full-stack modern engineering solutions.",
        "5. Educational Value: Provides deep insights into computer organization, machine cycles, instruction sets, and interrupt mechanisms."
    ]
    for c in conclusions:
        pc = tf6_l.add_paragraph()
        pc.text = c
        pc.font.size = Pt(12)
        pc.font.color.rgb = TEXT_MUTED
        pc.space_before = Pt(10)

    # Right: Future Scope
    b6_right = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2))
    b6_right.fill.solid()
    b6_right.fill.fore_color.rgb = NAVY_CARD
    b6_right.line.color.rgb = BORDER_COLOR

    tf6_r = b6_right.text_frame
    tf6_r.word_wrap = True
    p = tf6_r.paragraphs[0]
    p.text = "FUTURE ENHANCEMENTS"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    futures = [
        "• Direct Hardware Deployment: Flash the binary onto physical 8086 Microprocessor Trainer Kits with 7-segment display output.",
        "• Array-Based Multi-Subject Support: Use Base-Index Addressing (SI/DI registers) to handle dynamic subject counts (N subjects).",
        "• Floating-Point Arithmetic: Integrate with Intel 8087 Math Coprocessor instructions for precise decimal percentages.",
        "• DOSBox Live Pipe Integration: Direct real-time bidirectional pipe between web input forms and DOSBox emulator memory.",
        "• GPA / CGPA Credit Weighting: Add credit-based weighted average calculations into the assembly routine."
    ]
    for f in futures:
        pf = tf6_r.add_paragraph()
        pf.text = f
        pf.font.size = Pt(12)
        pf.font.color.rgb = TEXT_MUTED
        pf.space_before = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 7: REFERENCES
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s7)
    add_header(s7, "References & Technical Literature")

    ref_box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.2))
    ref_box.fill.solid()
    ref_box.fill.fore_color.rgb = NAVY_CARD
    ref_box.line.color.rgb = BORDER_COLOR

    tf7 = ref_box.text_frame
    tf7.word_wrap = True
    p = tf7.paragraphs[0]
    p.text = "ACADEMIC & TECHNICAL REFERENCES"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = ELECTRIC_BLUE

    refs = [
        "1. Hall, Douglas V. — 'Microprocessors and Interfacing: Programming and Hardware', 3rd Edition, Tata McGraw-Hill Education, 2012.",
        "2. Liu, Yu-Cheng and Gibson, Glenn A. — 'Microcomputer Systems: The 8086/8088 Family - Architecture, Programming, and Design', 2nd Edition, Prentice Hall, 2006.",
        "3. Barry B. Brey — 'The Intel Microprocessors: 8086/8088, 80186/80188, 80286, 80386, 80486, Pentium, Pentium Pro Processor, Pentium II, Pentium III, Pentium 4, and Core2 with 64-bit Extensions', 8th Edition, Pearson Education.",
        "4. Intel Corporation — 'Intel 8086 Family User's Manual and Instruction Set Reference', Intel Order No. 9800722.",
        "5. Ralf Brown's Interrupt List (RBIL) — 'DOS Interrupt 21H Services and BIOS Interrupt Reference', Comprehensive Interrupt Listing.",
        "6. EMU8086 Documentation — '8086 Microprocessor Emulator and Integrated Assembler Tutorial & Manual'.",
        "7. Project Source Code & Live Deployment — GitHub Repository: https://github.com/Yogesh-0730/Coa-Project"
    ]
    for r in refs:
        pr = tf7.add_paragraph()
        pr.text = r
        pr.font.size = Pt(12)
        pr.font.color.rgb = TEXT_MUTED
        pr.space_before = Pt(10)

    # Save
    output_path = os.path.join(os.path.dirname(__file__), "8086_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation generated successfully at: {output_path}")

if __name__ == "__main__":
    create_presentation()
