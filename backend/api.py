from fastapi import APIRouter
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Expense
from schemas import ExpenseCreate

router = APIRouter()

@router.post("/expenses")
def add_expense(expense: ExpenseCreate):

    db: Session = SessionLocal()

    new_expense = Expense(
        title=expense.title,
        amount=expense.amount
    )

    db.add(new_expense)
    db.commit()

    return {"message": "Expense Added Successfully"}

@router.get("/expenses")
def get_expenses():

    db: Session = SessionLocal()

    expenses = db.query(Expense).all()

    return expenses