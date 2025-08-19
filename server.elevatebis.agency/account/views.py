from .models import Account
from rest_framework import status
from django.db import transaction
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import  GenericAPIView
from utilities.decode_token import get_email_from_token
from .utils import sent_activation_accout, send_forgotten_password
from .serializers import AccountSerializer, ForgottenPasswordSerializer, ResetPasswordSerializer, AccountConfirmationSerializer

class CreateAccountView(GenericAPIView):

    serializer_class = AccountSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        frontend_url = serializer.validated_data.get("frontend_url", "https://elevatebis.agency")

        try:
            with transaction.atomic():

                created_user = Account.objects.create_user(email=email, password=password)

                if not sent_activation_accout(email=email, frontend_url=frontend_url):
                    raise ValueError("Failed to send activation email.")
        except Exception as e:
            return Response(
                {"error": f"Failed to send confirmation email: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            {"message": f"Account created successfully. A confirmation email has been sent to {email}."},
            status=status.HTTP_201_CREATED
        )
        