from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ========== Category Schemas ==========
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========== Beneficiary Schemas ==========
class BeneficiaryBase(BaseModel):
    name: str

class Beneficiary(BeneficiaryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========== Location Schemas ==========
class LocationBase(BaseModel):
    address: str
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: int
    ngo_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========== NGO Schemas ==========
class NGOBase(BaseModel):
    name: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    qr_code: Optional[str] = None

class NGOCreate(NGOBase):
    category_ids: List[int] = []
    beneficiary_ids: List[int] = []
    locations: List[LocationCreate] = []

class NGOUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    qr_code: Optional[str] = None
    category_ids: Optional[List[int]] = None
    beneficiary_ids: Optional[List[int]] = None
    locations: Optional[List[LocationCreate]] = None

class NGO(NGOBase):
    id: int
    verified: bool
    created_at: datetime
    updated_at: datetime
    categories: List[Category] = []
    beneficiaries: List[Beneficiary] = []
    locations: List[Location] = []
    
    class Config:
        from_attributes = True

# ========== Admin/Auth Schemas ==========
class AdminLogin(BaseModel):
    email: str
    password: str

class AdminCreate(BaseModel):
    email: str
    password: str
    name: str

class AdminResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True
