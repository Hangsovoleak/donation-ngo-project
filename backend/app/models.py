from sqlalchemy import Column, Integer, String, Boolean, Text, Table, ForeignKey, TIMESTAMP, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Junction table for NGO categories
ngo_categories = Table(
    'ngo_categories',
    Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('ngo_id', Integer, ForeignKey('ngos.id', ondelete='CASCADE')),
    Column('category_id', Integer, ForeignKey('categories.id', ondelete='CASCADE')),
    Column('created_at', TIMESTAMP, server_default=func.current_timestamp())
)

# Junction table for NGO beneficiaries
ngo_beneficiaries = Table(
    'ngo_beneficiaries',
    Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('ngo_id', Integer, ForeignKey('ngos.id', ondelete='CASCADE')),
    Column('beneficiary_id', Integer, ForeignKey('beneficiaries.id', ondelete='CASCADE')),
    Column('created_at', TIMESTAMP, server_default=func.current_timestamp())
)

class NGO(Base):
    __tablename__ = "ngos"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    short_description = Column(Text)
    description = Column(Text)
    city = Column(String(100))
    phone = Column(String(20))
    website = Column(String(255))
    qr_code = Column(String(255))
    verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relationships
    categories = relationship("Category", secondary=ngo_categories, back_populates="ngos")
    beneficiaries = relationship("Beneficiary", secondary=ngo_beneficiaries, back_populates="ngos")
    locations = relationship("DonationLocation", back_populates="ngo", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    
    ngos = relationship("NGO", secondary=ngo_categories, back_populates="categories")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    
    ngos = relationship("NGO", secondary=ngo_beneficiaries, back_populates="beneficiaries")

class DonationLocation(Base):
    __tablename__ = "donation_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id", ondelete='CASCADE'), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100))
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    
    ngo = relationship("NGO", back_populates="locations")

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
