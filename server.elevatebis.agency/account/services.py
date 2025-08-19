from .models import Account

def get_account_by_email(email: str) -> Account:
    try:
        return Account.objects.get(email=email)
    except Account.DoesNotExist:
        return None
    