#backend\utils\helpers.py
from datetime import date

def calculate_fine(due_date, return_date, rate_per_day=5):
    if return_date <= due_date:
        return 0
    days_late = (return_date - due_date).days
    return days_late * rate_per_day


def is_overdue(due_date):
    return date.today() > due_date
