from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=schemas.AdminResponse)
def login(credentials: schemas.AdminLogin, db: Session = Depends(get_db)):
    """
    Admin login with email and password
    Returns admin info if successful
    """
    admin = crud.verify_admin_password(
        db,
        email=credentials.email,
        password=credentials.password
    )
    
    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    return admin
