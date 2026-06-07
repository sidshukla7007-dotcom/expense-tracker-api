@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

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