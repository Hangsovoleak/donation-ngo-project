from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models, schemas
from typing import List, Optional

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ========== NGO CRUD ==========

def get_ngos(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    city: Optional[str] = None,
    category_ids: Optional[List[int]] = None,
    beneficiary_ids: Optional[List[int]] = None
):
    """Get all NGOs with optional filtering"""
    query = db.query(models.NGO)
    
    # Search by name
    if search:
        query = query.filter(models.NGO.name.ilike(f"%{search}%"))
    
    # Filter by city
    if city and city != "All Province":
        query = query.filter(models.NGO.city == city)
    
    # Filter by categories
    if category_ids:
        query = query.filter(models.NGO.categories.any(models.Category.id.in_(category_ids)))
    
    # Filter by beneficiaries
    if beneficiary_ids:
        query = query.filter(models.NGO.beneficiaries.any(models.Beneficiary.id.in_(beneficiary_ids)))
    
    return query.offset(skip).limit(limit).all()

def get_ngo(db: Session, ngo_id: int):
    """Get single NGO by ID"""
    return db.query(models.NGO).filter(models.NGO.id == ngo_id).first()

def create_ngo(db: Session, ngo: schemas.NGOCreate):
    """Create new NGO"""
    # Create NGO
    db_ngo = models.NGO(
        name=ngo.name,
        short_description=ngo.short_description,
        description=ngo.description,
        city=ngo.city,
        phone=ngo.phone,
        website=ngo.website,
        qr_code=ngo.qr_code,
        verified=False
    )
    
    # Add categories
    if ngo.category_ids:
        categories = db.query(models.Category).filter(
            models.Category.id.in_(ngo.category_ids)
        ).all()
        db_ngo.categories = categories
    
    # Add beneficiaries
    if ngo.beneficiary_ids:
        beneficiaries = db.query(models.Beneficiary).filter(
            models.Beneficiary.id.in_(ngo.beneficiary_ids)
        ).all()
        db_ngo.beneficiaries = beneficiaries
    
    db.add(db_ngo)
    db.commit()
    db.refresh(db_ngo)
    
    # Add locations
    for location_data in ngo.locations:
        location = models.DonationLocation(
            ngo_id=db_ngo.id,
            address=location_data.address,
            city=location_data.city,
            latitude=location_data.latitude,
            longitude=location_data.longitude
        )
        db.add(location)
    
    db.commit()
    db.refresh(db_ngo)
    
    return db_ngo

def update_ngo(db: Session, ngo_id: int, ngo: schemas.NGOUpdate):
    """Update existing NGO"""
    db_ngo = get_ngo(db, ngo_id)
    if not db_ngo:
        return None
    
    # Update basic fields
    update_data = ngo.dict(exclude_unset=True, exclude={'category_ids', 'beneficiary_ids', 'locations'})
    for field, value in update_data.items():
        setattr(db_ngo, field, value)
    
    # Update categories
    if ngo.category_ids is not None:
        categories = db.query(models.Category).filter(
            models.Category.id.in_(ngo.category_ids)
        ).all()
        db_ngo.categories = categories
    
    # Update beneficiaries
    if ngo.beneficiary_ids is not None:
        beneficiaries = db.query(models.Beneficiary).filter(
            models.Beneficiary.id.in_(ngo.beneficiary_ids)
        ).all()
        db_ngo.beneficiaries = beneficiaries
    
    # Update locations (delete old, add new)
    if ngo.locations is not None:
        # Delete existing locations
        db.query(models.DonationLocation).filter(
            models.DonationLocation.ngo_id == ngo_id
        ).delete()
        
        # Add new locations
        for location_data in ngo.locations:
            location = models.DonationLocation(
                ngo_id=db_ngo.id,
                address=location_data.address,
                city=location_data.city,
                latitude=location_data.latitude,
                longitude=location_data.longitude
            )
            db.add(location)
    
    db.commit()
    db.refresh(db_ngo)
    return db_ngo

def delete_ngo(db: Session, ngo_id: int):
    """Delete NGO"""
    db_ngo = get_ngo(db, ngo_id)
    if db_ngo:
        db.delete(db_ngo)
        db.commit()
        return True
    return False

# ========== Category CRUD ==========

def get_categories(db: Session):
    """Get all categories"""
    return db.query(models.Category).all()

# ========== Beneficiary CRUD ==========

def get_beneficiaries(db: Session):
    """Get all beneficiaries"""
    return db.query(models.Beneficiary).all()

# ========== Admin CRUD ==========

def get_admin_by_email(db: Session, email: str):
    """Get admin by email"""
    return db.query(models.Admin).filter(models.Admin.email == email).first()

def create_admin(db: Session, email: str, password: str, name: str):
    """Create admin with hashed password"""
    hashed_password = pwd_context.hash(password)
    db_admin = models.Admin(
        email=email,
        password_hash=hashed_password,
        name=name
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def verify_admin_password(db: Session, email: str, password: str):
    """Verify admin password"""
    admin = get_admin_by_email(db, email)
    if not admin:
        return None
    if pwd_context.verify(password, admin.password_hash):
        return admin
    return None
