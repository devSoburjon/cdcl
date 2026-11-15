import os, secrets, time
import httpx, jwt
from fastapi import APIRouter, Request, Response, HTTPException, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db import get_db
from models import User

router = APIRouter(prefix="/api/auth")

GOOGLE_AUTH  = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN = "https://oauth2.googleapis.com/token"
GOOGLE_USER  = "https://openidconnect.googleapis.com/v1/userinfo"

CLIENT_ID     = os.getenv("GOOGLE_CLIENT_ID", "")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
REDIRECT_URI  = os.getenv("GOOGLE_REDIRECT_URI", "")
WEB_ORIGIN    = os.getenv("WEB_ORIGIN", "http://localhost:5173")
JWT_SECRET    = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG       = "HS256"
JWT_TTL       = 7 * 24 * 3600

ADMIN_SUBS = set(filter(None, os.getenv("ADMIN_GOOGLE_SUBS", "").split(",")))

# Render'da majburiy True, chunki SameSite=None faqat Secure bilan ishlaydi
COOKIE_SECURE = True


def make_username(db: Session, email: str) -> str:
    base = (email.split("@")[0] or "user").lower()
    base = "".join(ch for ch in base if ch.isalnum() or ch in "_-")[:20] or "user"
    uname, i = base, 1
    while db.query(User).filter_by(username=uname).first():
        i += 1
        uname = f"{base}{i}"
    return uname


@router.get("/google/start")
def google_start():
    state = secrets.token_urlsafe(24)
    resp = RedirectResponse(
        f"{GOOGLE_AUTH}?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code&scope=openid%20email%20profile"
        f"&state={state}&access_type=online&prompt=select_account"
    )
    # OAuth state cookie ham cross-site bo'lgani uchun SameSite=None
    resp.set_cookie("oauth_state", state, max_age=600,
                    httponly=True, secure=COOKIE_SECURE, samesite="none")
    return resp


@router.get("/google/callback")
async def google_callback(code: str, state: str, request: Request,
                          db: Session = Depends(get_db)):
    saved = request.cookies.get("oauth_state")
    if not saved or saved != state:
        raise HTTPException(400, "state mismatch")

    async with httpx.AsyncClient(timeout=10) as c:
        tok = await c.post(GOOGLE_TOKEN, data={
            "code": code, "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET, "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        })
        if tok.status_code != 200:
            raise HTTPException(400, "token exchange failed")
        access = tok.json()["access_token"]
        info = (await c.get(GOOGLE_USER,
                headers={"Authorization": f"Bearer {access}"})).json()

    sub   = info["sub"]
    email = info.get("email", "")
    name  = info.get("name", email.split("@")[0])
    pic   = info.get("picture")

    user = db.query(User).filter_by(google_sub=sub).first()
    if not user:
        user = User(
            google_sub=sub, email=email, name=name, avatar_url=pic,
            username=make_username(db, email),
            role="admin" if sub in ADMIN_SUBS else "user",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = jwt.encode({"sub": str(user.id), "exp": int(time.time()) + JWT_TTL},
                       JWT_SECRET, algorithm=JWT_ALG)
    
    # Frontend'ga yo'naltirish
    resp = RedirectResponse(WEB_ORIGIN)
    
    # Session cookie'ni cross-site (frontend va backend har xil domenda) o'rnatish
    resp.set_cookie("session", token, max_age=JWT_TTL,
                    httponly=True, secure=COOKIE_SECURE, samesite="none")
    resp.delete_cookie("oauth_state")
    return resp


@router.post("/logout")
def logout():
    resp = Response(status_code=204)
    resp.delete_cookie("session", samesite="none", secure=COOKIE_SECURE)
    return resp


def current_user(request: Request, db: Session) -> User:
    tok = request.cookies.get("session")
    if not tok:
        raise HTTPException(401, "no session")
    try:
        data = jwt.decode(tok, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.PyJWTError:
        raise HTTPException(401, "bad token")
    user = db.get(User, int(data["sub"]))
    if not user:
        raise HTTPException(401, "no user")
    return user


def require_admin(user: User) -> None:
    if user.role != "admin":
        raise HTTPException(403, "admin only")


@router.get("/me")
def me(request: Request, db: Session = Depends(get_db)):
    user = current_user(request, db)
    return {"id": user.id, "username": user.username, "name": user.name,
            "email": user.email, "avatar_url": user.avatar_url, "role": user.role}