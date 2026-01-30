from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/ngos",
    tags=["NGOs"]
)

@router.get("/", response_model=List[schemas.NGO])
def read_ngos(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    city: Optional[str] = None,
    category_ids: Optional[List[int]] = Query(None),
    beneficiary_ids: Optional[List[int]] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all NGOs with optional filtering:
    - **search**: Search by name
    - **city**: Filter by city
    - **category_ids**: Filter by category IDs
    - **beneficiary_ids**: Filter by beneficiary IDs
    """
    ngos = crud.get_ngos(
        db,
        skip=skip,
        limit=limit,
        search=search,
        city=city,
        category_ids=category_ids,
        beneficiary_ids=beneficiary_ids
    )
    return ngos

@router.get("/{ngo_id}", response_model=schemas.NGO)
def read_ngo(ngo_id: int, db: Session = Depends(get_db)):
    """Get single NGO by ID"""
    ngo = crud.get_ngo(db, ngo_id=ngo_id)
    if ngo is None:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo

@router.post("/", response_model=schemas.NGO, status_code=201)
def create_ngo(ngo: schemas.NGOCreate, db: Session = Depends(get_db)):
    """Create new NGO"""
    return crud.create_ngo(db=db, ngo=ngo)

@router.put("/{ngo_id}", response_model=schemas.NGO)
def update_ngo(
    ngo_id: int,
    ngo: schemas.NGOUpdate,
    db: Session = Depends(get_db)
):
    """Update existing NGO"""
    updated_ngo = crud.update_ngo(db, ngo_id=ngo_id, ngo=ngo)
    if updated_ngo is None:
        raise HTTPException(status_code=404, detail="NGO not found")
    return updated_ngo

@router.delete("/{ngo_id}")
def delete_ngo(ngo_id: int, db: Session = Depends(get_db)):
    """Delete NGO"""
    success = crud.delete_ngo(db, ngo_id=ngo_id)
    if not success:
        raise HTTPException(status_code=404, detail="NGO not found")
    return {"message": "NGO deleted successfully"}

@router.get("/categories/all", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    """Get all categories"""
    return crud.get_categories(db)

@router.get("/beneficiaries/all", response_model=List[schemas.Beneficiary])
def read_beneficiaries(db: Session = Depends(get_db)):
    """Get all beneficiaries"""
    return crud.get_beneficiaries(db)
