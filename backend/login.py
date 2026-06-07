@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

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