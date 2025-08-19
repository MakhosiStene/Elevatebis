from django.urls import path
from .views import CreateAccountView



app_name="account"



urlpatterns = [
    
    path('create-account/', CreateAccountView.as_view(), name='create-account'),
    
]