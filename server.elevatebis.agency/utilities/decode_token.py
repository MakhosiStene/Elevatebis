import jwt
from django.conf import settings
from jwt import ExpiredSignatureError, InvalidTokenError

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise ValueError("Token has expired")
    except InvalidTokenError:
        raise ValueError("Invalid token")
    
def get_email_from_token(token: str) -> str:
    """
    Extracts the email from the 'sub' field of the token.
    """
    payload = decode_token(token)
    email = payload.get("sub")
    if not email:
        raise ValueError("No email found in token 'sub' field")
    return email