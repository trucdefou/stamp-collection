import os
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json
import hmac
import base64

# Config - change these in production
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
TOKEN_EXPIRY_HOURS = 24

security = HTTPBearer()


def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _b64decode(s: str) -> bytes:
    padding = 4 - len(s) % 4
    if padding != 4:
        s += "=" * padding
    return base64.urlsafe_b64decode(s)


def create_token(username: str) -> str:
    header = _b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload_data = {
        "sub": username,
        "exp": (datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS)).timestamp(),
    }
    payload = _b64encode(json.dumps(payload_data).encode())
    signature = _b64encode(
        hmac.new(SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
    )
    return f"{header}.{payload}.{signature}"


def verify_token(token: str) -> Optional[str]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header, payload, signature = parts
        expected_sig = _b64encode(
            hmac.new(SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
        )
        if not hmac.compare_digest(signature, expected_sig):
            return None
        payload_data = json.loads(_b64decode(payload))
        if datetime.now(timezone.utc).timestamp() > payload_data.get("exp", 0):
            return None
        return payload_data.get("sub")
    except Exception:
        return None


def verify_credentials(username: str, password: str) -> bool:
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    username = verify_token(credentials.credentials)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )
    return username
