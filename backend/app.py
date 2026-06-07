from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from database import SessionLocal, engine, Base
from models import Expense, User
from schemas import ExpenseCreate, UserCreate, UserLogin
from auth import hash_password, verify_password
from jwt_handler import create_access_token, verify_token

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme)):

    username = verify_token(token)

    if username is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    db = SessionLocal()

    user = db.query(User).filter(
        User.username == username
    ).first()

    return user


@app.get("/")
def home():
    return {"message": "Expense Tracker API"}


@app.post("/expenses")
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):

    new_expense = Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense


@app.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db)
):

    return db.query(Expense).all()


@app.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):

    existing_expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not existing_expense:
        return {"error": "Expense not found"}

    existing_expense.title = expense.title
    existing_expense.amount = expense.amount
    existing_expense.category = expense.category

    db.commit()
    db.refresh(existing_expense)

    return existing_expense


@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        return {"error": "Expense not found"}

    db.delete(expense)
    db.commit()

    return {"message": "Expense deleted"}


@app.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_user:
        return {"error": "Username already exists"}

    hashed_password = hash_password(user.password)

    new_user = User(
        username=user.username,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created successfully"}


@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if not db_user:
        return {"error": "Invalid username"}

    if not verify_password(
        user.password,
        db_user.password
    ):
        return {"error": "Invalid password"}

    token = create_access_token(
        data={"sub": db_user.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/total")
def total_expense(
    db: Session = Depends(get_db)
):

    expenses = db.query(Expense).all()

    total = sum(
        expense.amount for expense in expenses
    )

    return {
        "total_expense": total
    }


@app.get("/category-summary")
def category_summary(
    db: Session = Depends(get_db)
):

    expenses = db.query(Expense).all()

    summary = {}

    for expense in expenses:

        category = expense.category

        if category in summary:
            summary[category] += expense.amount
        else:
            summary[category] = expense.amount

    return summary


@app.get("/monthly-total")
def monthly_total(
    db: Session = Depends(get_db)
):

    expenses = db.query(Expense).all()

    total = sum(
        expense.amount for expense in expenses
    )

    return {
        "monthly_total": total
    }
