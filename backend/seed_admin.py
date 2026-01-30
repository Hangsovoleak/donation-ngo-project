from app.database import SessionLocal
from app import crud

db = SessionLocal()

# Admin credentials
admin_email = "panha@gmail.com"
admin_password = "panha123"
admin_name = "Panha"

# Check if admin exists
existing_admin = crud.get_admin_by_email(db, admin_email)

if existing_admin:
    print(f"❌ Admin already exists: {admin_email}")
else:
    # Create admin
    admin = crud.create_admin(
        db,
        email=admin_email,
        password=admin_password,
        name=admin_name
    )
    print(f"✅ Admin created successfully!")
    print(f"   Email: {admin_email}")
    print(f"   Password: {admin_password}")
    print(f"   Name: {admin_name}")

db.close()
