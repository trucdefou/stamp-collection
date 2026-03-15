import os
import uuid
import shutil
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import engine, get_db, Base, UPLOAD_DIR
from models import Stamp
from schemas import (
    StampCreate,
    StampUpdate,
    StampResponse,
    StampListResponse,
    LoginRequest,
    TokenResponse,
)
from auth import verify_credentials, create_token, get_current_admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Stamp Collection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


def save_image(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Formato no permitido. Use: {', '.join(ALLOWED_EXTENSIONS)}")
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return filename


# ── Auth ──────────────────────────────────────────────────────

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    if not verify_credentials(data.username, data.password):
        raise HTTPException(401, "Credenciales incorrectas")
    return TokenResponse(access_token=create_token(data.username))


@app.get("/api/auth/me")
async def me(username: str = Depends(get_current_admin)):
    return {"username": username}


# ── Public endpoints ──────────────────────────────────────────

@app.get("/api/stamps", response_model=StampListResponse)
async def list_stamps(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    country: Optional[str] = None,
    category: Optional[str] = None,
    condition: Optional[str] = None,
    year_from: Optional[int] = None,
    year_to: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Stamp)
    if search:
        query = query.filter(
            or_(
                Stamp.name.ilike(f"%{search}%"),
                Stamp.country.ilike(f"%{search}%"),
                Stamp.notes.ilike(f"%{search}%"),
            )
        )
    if country:
        query = query.filter(Stamp.country.ilike(f"%{country}%"))
    if category:
        query = query.filter(Stamp.category == category)
    if condition:
        query = query.filter(Stamp.condition == condition)
    if year_from:
        query = query.filter(Stamp.year >= year_from)
    if year_to:
        query = query.filter(Stamp.year <= year_to)

    total = query.count()
    stamps = query.order_by(Stamp.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return StampListResponse(stamps=stamps, total=total, page=page, page_size=page_size)


@app.get("/api/stamps/{stamp_id}", response_model=StampResponse)
async def get_stamp(stamp_id: int, db: Session = Depends(get_db)):
    stamp = db.query(Stamp).filter(Stamp.id == stamp_id).first()
    if not stamp:
        raise HTTPException(404, "Estampilla no encontrada")
    return stamp


@app.get("/api/filters")
async def get_filters(db: Session = Depends(get_db)):
    countries = [r[0] for r in db.query(Stamp.country).distinct().order_by(Stamp.country).all() if r[0]]
    categories = [r[0] for r in db.query(Stamp.category).distinct().order_by(Stamp.category).all() if r[0]]
    conditions = [r[0] for r in db.query(Stamp.condition).distinct().order_by(Stamp.condition).all() if r[0]]
    return {"countries": countries, "categories": categories, "conditions": conditions}


# ── Admin endpoints ───────────────────────────────────────────

@app.post("/api/admin/stamps", response_model=StampResponse)
async def create_stamp(
    name: str = Form(...),
    country: str = Form(...),
    year: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    condition: Optional[str] = Form(None),
    estimated_value: Optional[float] = Form(None),
    purchase_price: Optional[float] = Form(None),
    notes: Optional[str] = Form(None),
    acquisition_date: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    _admin: str = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    image_filename = save_image(image) if image else None
    stamp = Stamp(
        name=name,
        country=country,
        year=year,
        category=category or None,
        condition=condition or None,
        estimated_value=estimated_value,
        purchase_price=purchase_price,
        notes=notes or None,
        acquisition_date=acquisition_date or None,
        image_filename=image_filename,
    )
    db.add(stamp)
    db.commit()
    db.refresh(stamp)
    return stamp


@app.put("/api/admin/stamps/{stamp_id}", response_model=StampResponse)
async def update_stamp(
    stamp_id: int,
    name: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    condition: Optional[str] = Form(None),
    estimated_value: Optional[float] = Form(None),
    purchase_price: Optional[float] = Form(None),
    notes: Optional[str] = Form(None),
    acquisition_date: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    _admin: str = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    stamp = db.query(Stamp).filter(Stamp.id == stamp_id).first()
    if not stamp:
        raise HTTPException(404, "Estampilla no encontrada")

    if name is not None:
        stamp.name = name
    if country is not None:
        stamp.country = country
    if year is not None:
        stamp.year = year
    if category is not None:
        stamp.category = category or None
    if condition is not None:
        stamp.condition = condition or None
    if estimated_value is not None:
        stamp.estimated_value = estimated_value
    if purchase_price is not None:
        stamp.purchase_price = purchase_price
    if notes is not None:
        stamp.notes = notes or None
    if acquisition_date is not None:
        stamp.acquisition_date = acquisition_date or None
    if image:
        if stamp.image_filename:
            old_path = os.path.join(UPLOAD_DIR, stamp.image_filename)
            if os.path.exists(old_path):
                os.remove(old_path)
        stamp.image_filename = save_image(image)

    db.commit()
    db.refresh(stamp)
    return stamp


@app.delete("/api/admin/stamps/{stamp_id}")
async def delete_stamp(
    stamp_id: int,
    _admin: str = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    stamp = db.query(Stamp).filter(Stamp.id == stamp_id).first()
    if not stamp:
        raise HTTPException(404, "Estampilla no encontrada")
    if stamp.image_filename:
        filepath = os.path.join(UPLOAD_DIR, stamp.image_filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    db.delete(stamp)
    db.commit()
    return {"detail": "Estampilla eliminada"}


@app.get("/api/stats")
async def stats(db: Session = Depends(get_db)):
    total = db.query(Stamp).count()
    countries = db.query(Stamp.country).distinct().count()
    from sqlalchemy import func

    total_value = db.query(func.sum(Stamp.estimated_value)).scalar() or 0
    total_invested = db.query(func.sum(Stamp.purchase_price)).scalar() or 0
    return {
        "total_stamps": total,
        "total_countries": countries,
        "total_estimated_value": round(total_value, 2),
        "total_invested": round(total_invested, 2),
    }
