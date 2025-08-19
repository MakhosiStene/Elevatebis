import re
from core import settings
from utilities.create_token import create_token
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives


def sent_activation_accout(email: str, frontend_url: str) -> bool:
    r"""this function sends email to user to activate their account after signing up."""

    token = create_token(data={"sub": email})
    confirm_url = f"{frontend_url}/confirm-account/{token}"

    subject = "ACTIVATE ACCOUNT"
    from_email = settings.DEFAULT_FROM_EMAIL
    to =  [email, ]

    text_content = f"Hello from Elevatebis!  Thank you for signing up with Elevatebis, we are thrilld to have you. click link to confirm or ignore if you didn't sign up.{confirm_url}."
    html_content = f"""
            <html>

                <body style="width: 100%;">

                    <div style="width: 90%;max-width: 500px;margin: auto;border-radius: 10px;box-shadow: 1px 1px 10px .7px gray;">

                        <h1 style="color: #007BFF;">Hello from Elevatebis!</h1>
                        <p style="color: orange;">Thank you for signing up with Elevatebis, we are thrilld to have you</p>
                        <div>
                            <a href="{confirm_url}" style="padding: 1rem 2rem;background-color: blue;border-radius: 10px;">Activate</button>
                        </div>

                        <p>if you didn't sign up for Elevatebis, you can ignore this email</p>

                    </div>
                    
                </body>

            </html>
            """

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return True



def send_forgotten_password(email: str, frontend_url: str) -> bool:
    R"""This function send email with token to reset password"""

    token = create_token(data={"sub": email})
    confirm_url = f"{frontend_url}/reset-password/{token}"

    subject = "RESET PASSWORD"
    from_email = settings.DEFAULT_FROM_EMAIL
    to =  [email, ]

    text_content = f"Hello from Elevatebis! Click link below and reset your password {confirm_url}."
    html_content = f"""
            <html>

                <body style="width: 100%;">

                    <div style="width: 90%;max-width: 500px;margin: auto;border-radius: 10px;box-shadow: 1px 1px 10px .7px gray;">

                        <h1 style="color: #007BFF;">Hello from Elevatebis!</h1>
                        <p style="color: orange;">Click button below and reset your password</p>
                        <div>
                            <a href="{confirm_url}" style="padding: 1rem 2rem;background-color: blue;border-radius: 10px;">Activate</button>
                        </div>

                        <p>if you didn't sign up for Elevatebis, you can ignore this email</p>

                    </div>
                    
                </body>

            </html>
            """
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return True




def check_v_pw(password: str, domain: str):
    r"""this function checks password in strong enough before been hashed"""

    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long.")

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValidationError("Password must contain at least one special character.")

    if not re.search(r"\d", password):
        raise ValidationError("Password must contain at least one number.")

    if domain and domain.lower() in password.lower():
        raise ValidationError("Password must not contain part of your email domain.")
        
    return password