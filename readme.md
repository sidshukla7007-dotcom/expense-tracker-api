# Expense Tracker API

A full-stack expense tracker backend built using FastAPI, PostgreSQL, and SQLAlchemy.

## Features

* User Registration
* User Login
* JWT Authentication
* Create Expenses
* Update Expenses
* Delete Expenses
* Expense Analytics
* Category-wise Summary
* Monthly Total Calculation

## Tech Stack

* FastAPI
* PostgreSQL
* SQLAlchemy
* Python
* JWT Authentication

## Project Structure

```txt
backend/
│
├── app.py
├── database.py
├── models.py
├── schemas.py
├── auth.py
├── jwt_handler.py
└── requirements.txt
```

## API Endpoints

### Authentication

* POST `/register`
* POST `/login`

### Expenses

* GET `/expenses`
* POST `/expenses`
* PUT `/expenses/{id}`
* DELETE `/expenses/{id}`

### Analytics

* GET `/total`
* GET `/monthly-total`
* GET `/category-summary`

## Run Locally

### Clone Project

```bash
git clone https://github.com/sidshukla7007-dotcom/expense-tracker-api.git
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Server

```bash
uvicorn app:app --reload
```

## Future Improvements

* React Frontend
* Charts Dashboard
* Gmail Expense Detection
* AI Expense Categorization
* Mobile Responsive UI

## Author

Sid
