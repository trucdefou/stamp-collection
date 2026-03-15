from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StampBase(BaseModel):
    name: str
    country: str
    year: Optional[int] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    estimated_value: Optional[float] = None
    purchase_price: Optional[float] = None
    notes: Optional[str] = None
    acquisition_date: Optional[str] = None


class StampCreate(StampBase):
    pass


class StampUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    year: Optional[int] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    estimated_value: Optional[float] = None
    purchase_price: Optional[float] = None
    notes: Optional[str] = None
    acquisition_date: Optional[str] = None


class StampResponse(StampBase):
    id: int
    image_filename: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StampListResponse(BaseModel):
    stamps: list[StampResponse]
    total: int
    page: int
    page_size: int


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
