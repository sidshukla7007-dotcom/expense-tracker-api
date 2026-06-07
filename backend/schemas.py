from pydantic import BaseModel

class ExpenseCreate(BaseModel):
    title: str
    amount: int
    category: str
class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: int
    category: str
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str