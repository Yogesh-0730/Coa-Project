"""
Grading Service Module
Modular service for grade calculation - can be swapped with 8086 execution engine.
"""


def calculate_total(mathematics, coa, programming):
    """Calculate total marks from three subjects."""
    return mathematics + coa + programming


def calculate_average(total):
    """Calculate average percentage (rounded to 2 decimal places)."""
    return round(total / 3, 2)


def determine_grade(average):
    """Determine grade based on average percentage."""
    if average >= 75:
        return "DISTINCTION"
    elif average >= 60:
        return "FIRST CLASS"
    elif average >= 50:
        return "SECOND CLASS"
    else:
        return "FAIL"


def determine_result(average):
    """Determine pass/fail status."""
    return "PASS" if average >= 50 else "FAIL"


def get_remarks(grade):
    """Get performance remarks based on grade."""
    remarks_map = {
        "DISTINCTION": "Excellent Performance",
        "FIRST CLASS": "Very Good Performance",
        "SECOND CLASS": "Satisfactory Performance",
        "FAIL": "Needs Improvement",
    }
    return remarks_map.get(grade, "N/A")


def get_highest_subject(mathematics, coa, programming):
    """Return the name of the highest scoring subject."""
    subjects = {
        "Mathematics": mathematics,
        "Computer Organization": coa,
        "Programming": programming,
    }
    return max(subjects, key=subjects.get)


def get_lowest_subject(mathematics, coa, programming):
    """Return the name of the lowest scoring subject."""
    subjects = {
        "Mathematics": mathematics,
        "Computer Organization": coa,
        "Programming": programming,
    }
    return min(subjects, key=subjects.get)


def get_full_evaluation(mathematics, coa, programming):
    """
    Perform complete evaluation and return all calculated fields.
    This is the primary entry point that can be replaced with 8086 execution.
    """
    total = calculate_total(mathematics, coa, programming)
    average = calculate_average(total)
    grade = determine_grade(average)
    result = determine_result(average)
    remarks = get_remarks(grade)
    highest = get_highest_subject(mathematics, coa, programming)
    lowest = get_lowest_subject(mathematics, coa, programming)

    return {
        "total": total,
        "average": average,
        "grade": grade,
        "result": result,
        "remarks": remarks,
        "highest_subject": highest,
        "lowest_subject": lowest,
    }
