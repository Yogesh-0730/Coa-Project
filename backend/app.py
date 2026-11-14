"""
8086 Smart Student Performance Evaluation System - Flask Backend
Main application with REST API endpoints and SQLite database.
"""

import os
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS

from grading_service import get_full_evaluation, calculate_total, calculate_average, determine_grade, determine_result
from assembly_code import get_assembly_code, get_execution_steps
from seed_data import SAMPLE_STUDENTS

app = Flask(__name__)
CORS(app)

DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'students.db')


# ========== Database Helpers ==========

def get_db():
    """Get database connection for current request."""
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA journal_mode=WAL")
    return g.db


@app.teardown_appcontext
def close_db(exception):
    """Close database connection at end of request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    """Initialize database schema and seed data."""
    conn = sqlite3.connect(DATABASE)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_number TEXT NOT NULL UNIQUE,
            mathematics INTEGER NOT NULL CHECK(mathematics >= 0 AND mathematics <= 100),
            coa INTEGER NOT NULL CHECK(coa >= 0 AND coa <= 100),
            programming INTEGER NOT NULL CHECK(programming >= 0 AND programming <= 100),
            total INTEGER NOT NULL,
            average REAL NOT NULL,
            grade TEXT NOT NULL,
            result TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Seed data if table is empty
    cursor = conn.execute("SELECT COUNT(*) FROM students")
    count = cursor.fetchone()[0]
    if count == 0:
        for s in SAMPLE_STUDENTS:
            ev = get_full_evaluation(s['mathematics'], s['coa'], s['programming'])
            conn.execute(
                """INSERT INTO students (name, roll_number, mathematics, coa, programming,
                   total, average, grade, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (s['name'], s['roll_number'], s['mathematics'], s['coa'], s['programming'],
                 ev['total'], ev['average'], ev['grade'], ev['result'])
            )
        conn.commit()
    conn.close()


def row_to_dict(row):
    """Convert a sqlite3.Row to a dictionary."""
    return dict(row)


# ========== Validation ==========

def validate_student_data(data, is_update=False, current_id=None):
    """Validate student input data. Returns (errors, cleaned_data)."""
    errors = []
    cleaned = {}

    name = (data.get('name') or '').strip()
    if not name:
        errors.append("Student name is required.")
    elif len(name) < 2:
        errors.append("Student name must be at least 2 characters.")
    cleaned['name'] = name

    roll = (data.get('roll_number') or '').strip()
    if not roll:
        errors.append("Roll number is required.")
    cleaned['roll_number'] = roll

    for field, label in [('mathematics', 'Mathematics'), ('coa', 'Computer Organization'), ('programming', 'Programming')]:
        val = data.get(field)
        if val is None or val == '':
            errors.append(f"{label} marks are required.")
        else:
            try:
                val = int(val)
                if val < 0 or val > 100:
                    errors.append(f"{label} marks must be between 0 and 100.")
                cleaned[field] = val
            except (ValueError, TypeError):
                errors.append(f"{label} marks must be a valid number.")

    # Check duplicate roll number
    if roll and not errors:
        db = get_db()
        query = "SELECT id FROM students WHERE roll_number = ?"
        params = [roll]
        if is_update and current_id:
            query += " AND id != ?"
            params.append(current_id)
        existing = db.execute(query, params).fetchone()
        if existing:
            errors.append(f"Roll number '{roll}' already exists.")

    return errors, cleaned


# ========== API Routes ==========

@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students with optional search, filter, and sort."""
    db = get_db()
    query = "SELECT * FROM students WHERE 1=1"
    params = []

    search = request.args.get('search', '').strip()
    if search:
        query += " AND (name LIKE ? OR roll_number LIKE ?)"
        params.extend([f'%{search}%', f'%{search}%'])

    grade_filter = request.args.get('grade', '').strip()
    if grade_filter and grade_filter != 'All':
        query += " AND grade = ?"
        params.append(grade_filter)

    sort = request.args.get('sort', '').strip()
    if sort == 'asc':
        query += " ORDER BY average ASC"
    elif sort == 'desc':
        query += " ORDER BY average DESC"
    else:
        query += " ORDER BY created_at DESC"

    rows = db.execute(query, params).fetchall()
    students = [row_to_dict(r) for r in rows]
    return jsonify({"students": students, "count": len(students)})


@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Get a single student by ID."""
    db = get_db()
    row = db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not row:
        return jsonify({"error": "Student not found."}), 404

    student = row_to_dict(row)
    ev = get_full_evaluation(student['mathematics'], student['coa'], student['programming'])
    student['remarks'] = ev['remarks']
    student['highest_subject'] = ev['highest_subject']
    student['lowest_subject'] = ev['lowest_subject']
    return jsonify({"student": student})


@app.route('/api/students', methods=['POST'])
def add_student():
    """Add a new student."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided."}), 400

    errors, cleaned = validate_student_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    ev = get_full_evaluation(cleaned['mathematics'], cleaned['coa'], cleaned['programming'])
    db = get_db()
    cursor = db.execute(
        """INSERT INTO students (name, roll_number, mathematics, coa, programming,
           total, average, grade, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (cleaned['name'], cleaned['roll_number'], cleaned['mathematics'], cleaned['coa'],
         cleaned['programming'], ev['total'], ev['average'], ev['grade'], ev['result'])
    )
    db.commit()

    new_student = row_to_dict(
        db.execute("SELECT * FROM students WHERE id = ?", (cursor.lastrowid,)).fetchone()
    )
    new_student.update({
        'remarks': ev['remarks'],
        'highest_subject': ev['highest_subject'],
        'lowest_subject': ev['lowest_subject'],
    })
    return jsonify({"message": "Student added successfully.", "student": new_student}), 201


@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """Update an existing student."""
    db = get_db()
    existing = db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not existing:
        return jsonify({"error": "Student not found."}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided."}), 400

    errors, cleaned = validate_student_data(data, is_update=True, current_id=student_id)
    if errors:
        return jsonify({"errors": errors}), 400

    ev = get_full_evaluation(cleaned['mathematics'], cleaned['coa'], cleaned['programming'])
    db.execute(
        """UPDATE students SET name=?, roll_number=?, mathematics=?, coa=?, programming=?,
           total=?, average=?, grade=?, result=? WHERE id=?""",
        (cleaned['name'], cleaned['roll_number'], cleaned['mathematics'], cleaned['coa'],
         cleaned['programming'], ev['total'], ev['average'], ev['grade'], ev['result'], student_id)
    )
    db.commit()

    updated = row_to_dict(db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone())
    updated.update({
        'remarks': ev['remarks'],
        'highest_subject': ev['highest_subject'],
        'lowest_subject': ev['lowest_subject'],
    })
    return jsonify({"message": "Student updated successfully.", "student": updated})


@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete a student."""
    db = get_db()
    existing = db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not existing:
        return jsonify({"error": "Student not found."}), 404

    db.execute("DELETE FROM students WHERE id = ?", (student_id,))
    db.commit()
    return jsonify({"message": "Student deleted successfully."})


@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    """Get dashboard statistics."""
    db = get_db()

    total_students = db.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    passed = db.execute("SELECT COUNT(*) FROM students WHERE result = 'PASS'").fetchone()[0]
    failed = db.execute("SELECT COUNT(*) FROM students WHERE result = 'FAIL'").fetchone()[0]
    distinction = db.execute("SELECT COUNT(*) FROM students WHERE grade = 'DISTINCTION'").fetchone()[0]

    avg_row = db.execute("SELECT AVG(average) FROM students").fetchone()
    class_average = round(avg_row[0], 2) if avg_row[0] else 0

    pass_pct = round((passed / total_students * 100), 2) if total_students > 0 else 0

    # Grade distribution
    grades = db.execute(
        "SELECT grade, COUNT(*) as count FROM students GROUP BY grade"
    ).fetchall()
    grade_distribution = [{"name": r['grade'], "value": r['count']} for r in grades]

    # Subject averages
    subj = db.execute(
        "SELECT AVG(mathematics) as math_avg, AVG(coa) as coa_avg, AVG(programming) as prog_avg FROM students"
    ).fetchone()
    subject_averages = [
        {"subject": "Mathematics", "average": round(subj['math_avg'], 2) if subj['math_avg'] else 0},
        {"subject": "Computer Organization", "average": round(subj['coa_avg'], 2) if subj['coa_avg'] else 0},
        {"subject": "Programming", "average": round(subj['prog_avg'], 2) if subj['prog_avg'] else 0},
    ]

    # Recent students
    recent = db.execute("SELECT * FROM students ORDER BY created_at DESC LIMIT 5").fetchall()
    recent_students = [row_to_dict(r) for r in recent]

    return jsonify({
        "total_students": total_students,
        "passed": passed,
        "failed": failed,
        "distinction_count": distinction,
        "class_average": class_average,
        "pass_percentage": pass_pct,
        "grade_distribution": grade_distribution,
        "subject_averages": subject_averages,
        "recent_students": recent_students,
    })


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data."""
    db = get_db()

    total = db.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    passed = db.execute("SELECT COUNT(*) FROM students WHERE result = 'PASS'").fetchone()[0]
    failed = total - passed

    avg_row = db.execute("SELECT AVG(average) FROM students").fetchone()
    class_average = round(avg_row[0], 2) if avg_row[0] else 0
    pass_pct = round((passed / total * 100), 2) if total > 0 else 0
    fail_pct = round((failed / total * 100), 2) if total > 0 else 0

    grades = db.execute(
        "SELECT grade, COUNT(*) as count FROM students GROUP BY grade"
    ).fetchall()
    grade_distribution = [{"name": r['grade'], "value": r['count']} for r in grades]

    subj = db.execute(
        """SELECT AVG(mathematics) as math_avg, AVG(coa) as coa_avg, AVG(programming) as prog_avg,
           MAX(mathematics) as math_max, MIN(mathematics) as math_min,
           MAX(coa) as coa_max, MIN(coa) as coa_min,
           MAX(programming) as prog_max, MIN(programming) as prog_min
           FROM students"""
    ).fetchone()

    subject_averages = [
        {"subject": "Mathematics", "average": round(subj['math_avg'] or 0, 2),
         "highest": subj['math_max'] or 0, "lowest": subj['math_min'] or 0},
        {"subject": "Computer Organization", "average": round(subj['coa_avg'] or 0, 2),
         "highest": subj['coa_max'] or 0, "lowest": subj['coa_min'] or 0},
        {"subject": "Programming", "average": round(subj['prog_avg'] or 0, 2),
         "highest": subj['prog_max'] or 0, "lowest": subj['prog_min'] or 0},
    ]

    highest_student = db.execute(
        "SELECT * FROM students ORDER BY average DESC LIMIT 1"
    ).fetchone()
    lowest_student = db.execute(
        "SELECT * FROM students ORDER BY average ASC LIMIT 1"
    ).fetchone()

    return jsonify({
        "total_students": total,
        "class_average": class_average,
        "pass_percentage": pass_pct,
        "fail_percentage": fail_pct,
        "grade_distribution": grade_distribution,
        "subject_averages": subject_averages,
        "highest_avg_student": row_to_dict(highest_student) if highest_student else None,
        "lowest_avg_student": row_to_dict(lowest_student) if lowest_student else None,
    })


@app.route('/api/reports/<int:student_id>', methods=['GET'])
def get_report(student_id):
    """Get full report data for a student."""
    db = get_db()
    row = db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not row:
        return jsonify({"error": "Student not found."}), 404

    student = row_to_dict(row)
    ev = get_full_evaluation(student['mathematics'], student['coa'], student['programming'])
    student.update({
        'remarks': ev['remarks'],
        'highest_subject': ev['highest_subject'],
        'lowest_subject': ev['lowest_subject'],
    })

    return jsonify({
        "student": student,
        "institution": {
            "name": "Institute of Technology",
            "address": "Department of Computer Science & Engineering",
            "exam": "Semester Examination 2024",
        },
        "generated_at": datetime.now().strftime("%B %d, %Y at %I:%M %p"),
    })


@app.route('/api/simulator/execute', methods=['POST'])
def simulator_execute():
    """Execute 8086 simulation (software-based calculation with assembly display)."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided."}), 400

    errors = []
    for field, label in [('mathematics', 'Mathematics'), ('coa', 'COA'), ('programming', 'Programming')]:
        val = data.get(field)
        if val is None or val == '':
            errors.append(f"{label} marks are required.")
        else:
            try:
                val = int(val)
                if val < 0 or val > 100:
                    errors.append(f"{label} marks must be between 0 and 100.")
            except (ValueError, TypeError):
                errors.append(f"{label} marks must be a valid number.")

    if errors:
        return jsonify({"errors": errors}), 400

    mathematics = int(data['mathematics'])
    coa_marks = int(data['coa'])
    programming = int(data['programming'])

    ev = get_full_evaluation(mathematics, coa_marks, programming)
    steps = get_execution_steps(mathematics, coa_marks, programming)
    asm_code = get_assembly_code()

    return jsonify({
        "emulator_status": "NOT_CONNECTED",
        "message": "8086 Emulator is not connected. Results are calculated using the software engine. "
                   "Connect DOSBox or EMU8086 for actual assembly execution.",
        "assembly_code": asm_code,
        "registers": {
            "AX": f"{ev['average']:04X}" if isinstance(ev['average'], int) else f"{int(ev['average']):04X}",
            "BX": "0003",
            "CX": "0000",
            "DX": f"{ev['total'] % 3:04X}",
        },
        "execution_steps": steps,
        "software_result": {
            "total": ev['total'],
            "average": ev['average'],
            "grade": ev['grade'],
            "result": ev['result'],
            "remarks": ev['remarks'],
        },
    })


@app.route('/api/simulator/status', methods=['GET'])
def simulator_status():
    """Get emulator connection status."""
    return jsonify({
        "status": "NOT_CONNECTED",
        "message": "8086 Emulator is not connected. Configure DOSBox or EMU8086 path in Settings.",
        "supported_emulators": ["DOSBox", "EMU8086", "TASM", "MASM"],
    })


@app.route('/api/settings/reset', methods=['POST'])
def reset_data():
    """Reset all student data and reseed."""
    db = get_db()
    db.execute("DELETE FROM students")
    db.commit()

    for s in SAMPLE_STUDENTS:
        ev = get_full_evaluation(s['mathematics'], s['coa'], s['programming'])
        db.execute(
            """INSERT INTO students (name, roll_number, mathematics, coa, programming,
               total, average, grade, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (s['name'], s['roll_number'], s['mathematics'], s['coa'], s['programming'],
             ev['total'], ev['average'], ev['grade'], ev['result'])
        )
    db.commit()
    return jsonify({"message": "Data reset successfully. Sample records restored."})


@app.route('/api/settings/export', methods=['GET'])
def export_data():
    """Export all student data as JSON."""
    db = get_db()
    rows = db.execute("SELECT * FROM students ORDER BY id").fetchall()
    students = [row_to_dict(r) for r in rows]
    return jsonify({"students": students, "exported_at": datetime.now().isoformat()})


# ========== Static Frontend Serving (for Unified Full-Stack Cloud Deployment) ==========

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve built React frontend if available; fallback for SPA routing."""
    if path.startswith('api'):
        return jsonify({"error": "Endpoint not found"}), 404
    if path != "" and os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return jsonify({
        "message": "8086 SSPES Backend API is live. Build frontend/dist to serve the UI here, or run the React dev server."
    })


# Ensure database is initialized on startup (works with both python app.py and gunicorn)
init_db()

# ========== Main ==========

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
