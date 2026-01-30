from app.database import SessionLocal
from app import crud

db = SessionLocal()

email = "panha@gmail.com"
password = "panha123"

print(f"Testing login for {email}...")
admin = crud.verify_admin_password(db, email, password)

if admin:
    print(f"✅ Success! Admin found: {admin.name}")
else:
    print(f"❌ Failed! Invalid credentials.")
    
    # Check if admin even exists
    db_admin = crud.get_admin_by_email(db, email)
    if db_admin:
        print(f"   Admin exists in DB: {db_admin.email}")
        print(f"   Stored hash: {db_admin.password_hash}")
        
        # Try manual verify if possible or check current pwd_context
        # from app.crud import pwd_context
        # print(f"   Manual verify: {pwd_context.verify(password, db_admin.password_hash)}")
    else:
        print(f"   Admin NOT found in DB.")

db.close()
