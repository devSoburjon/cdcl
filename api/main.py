import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from db import Base, engine
import models  # noqa: F401 — User jadvali ro'yxatdan o'tsin
from auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CDCL API", version="0.1.0")

# Aniq WEB_ORIGIN ga ruxsat beramiz. allow_credentials=True bilan "*" ishlamaydi.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEB_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/api/health")
def health():
    return {"status": "ok"}