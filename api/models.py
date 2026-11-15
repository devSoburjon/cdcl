from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from db import Base

class User(Base):
    __tablename__ = "users"

    id:         Mapped[int]      = mapped_column(primary_key=True)
    google_sub: Mapped[str]      = mapped_column(String(64), unique=True, index=True)
    email:      Mapped[str]      = mapped_column(String(255), unique=True)
    name:       Mapped[str]      = mapped_column(String(255))
    username:   Mapped[str]      = mapped_column(String(32), unique=True, index=True)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    role:       Mapped[str]      = mapped_column(String(16), default="user")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
