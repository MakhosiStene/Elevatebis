from .utils import check_v_pw
from django.conf import settings
from .services import get_account_by_email
from utilities.decode_token import get_email_from_token, decode_token
from rest_framework.serializers import Serializer, CharField, EmailField, ValidationError



class AccountSerializer(Serializer):
    r"""create user schema and validations."""

    email           = EmailField()
    password        = CharField(write_only=True, min_length=8)
    frontend_url    = CharField(write_only=True, required=False)

    def validate_email(self, value):

        normalized_email = value.strip().lower()

        if get_account_by_email(normalized_email):
            raise ValidationError(f"An account with this email: {normalized_email} already exists.")

        return normalized_email
    
    def validate_password(self, value):

        email = self.initial_data.get("email", "").strip().lower()
        domain = email.split("@")[-1].split(".")[0] if "@" in email else ""

        if not check_v_pw(value, domain):
            raise ValidationError("password not strong enough.")

        return value
    
    def validate_frontend_url(self, value):

        if not value in settings.CORS_ALLOWED_ORIGINS:
            raise ValidationError(f"App URL is unknown.")
        
        return value



class ResetPasswordSerializer(Serializer):

    token           = CharField()
    new_password    = CharField(min_length=8, write_only=True)
    frontend_url    = CharField(write_only=True, required=False)

    def validate_token(self, value):

        if not decode_token(value):
            raise ValidationError(f"invalid or token has expired.")
        
        return value
    
    def validate_new_password(self, value):

        token = self.initial_data.get("token")
        email = get_email_from_token(token)

        if not email:
            raise ValidationError("Invalid or expired token.")

        domain = email.split("@")[-1].split(".")[0] if "@" in email else ""

        check_v_pw(value, domain)

        return value

    
    def validate_frontend_url(self, value):

        if not value in settings.CORS_ALLOWED_ORIGINS:
            raise ValidationError(f"App URL is unknown.")
        
        return value

    

class ForgottenPasswordSerializer(Serializer):

    email           = EmailField()
    frontend_url    = CharField(write_only=True, required=False)

    def validate_email(self, value):

        normalized_email = value.strip().lower()

        if not get_account_by_email(normalized_email):
            raise ValidationError(f"An account is not found.")

        return normalized_email

    def validate_frontend_url(self, value):

        if not value in settings.CORS_ALLOWED_ORIGINS:
            raise ValidationError(f"App URL is unknown.")
        
        return value



class AccountConfirmationSerializer(Serializer):

    token = CharField()

    def validate_token(self, value):

        if not decode_token(value):
            raise ValidationError(f"invalid or token has expired.")
        
        return value