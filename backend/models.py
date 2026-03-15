from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Stamp(Base):
    __tablename__ = "stamps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    year = Column(Integer, nullable=True)
    category = Column(String(100), nullable=True)
    condition = Column(String(50), nullable=True)  # Mint, Used, Fine, etc.
    estimated_value = Column(Float, nullable=True)
    purchase_price = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    acquisition_date = Column(String(20), nullable=True)
    image_filename = Column(String(300), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
