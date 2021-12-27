from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import DjangoUnicodeDecodeError, smart_str
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from .serializers import RegisterSerializer, EmailVerificationSerializer, LoginSerializer, PasswordResetEmailSerializer, SetNewPasswordSerializer
from .models import User_Login
from .utils import Util
import jwt

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User_Login.objects.get(email=user_data['email'])

        token = RefreshToken.for_user(user).access_token

        absurl = "http://localhost:3000/accounts/activate-account/?token="+str(token)
        email_body = 'Hola' +user.username+ ' \n Usa el siguiente enlace para activar tu cuenta \n' + absurl
        data = {'email_body': email_body,'to_email': user.email, 'email_subject': 'Verificacion de Email'}
        Util.send_email(data)

        return Response(user_data, status=status.HTTP_201_CREATED)

class VerifyEmail(views.APIView):
    serializer_class = EmailVerificationSerializer

    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY,algorithms=["HS256"])
            user = User_Login.objects.get(id = payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.is_active = True
                user.save()
                return Response({'email': 'success'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Account is activated'}, status=status.HTTP_200_OK)
            
        except jwt.ExpiredSignatureError as identifier:
            payloadExpired = jwt.decode(token, settings.SECRET_KEY,algorithms=["HS256"],options={"verify_signature": False})
            userExpired = User_Login.objects.get(id = payloadExpired['user_id'])

            if(userExpired.is_verified):
                return Response({'error': 'Account is activated'}, status=status.HTTP_200_OK)
            else:
                # IF TOKEN IS EXPIRED SEND A NEW EMAIL WITH A NEW TOKEN
                token = RefreshToken.for_user(userExpired).access_token
                absurl = "http://localhost:3000/accounts/activate-account/?token="+str(token)
                email_body = 'Hola' +userExpired.username+ ' \n Usa el siguiente enlace para activar tu cuenta \n' + absurl
                data = {'email_body': email_body,'to_email': userExpired.email, 'email_subject': 'Nueva Verificacion de Email'}
                Util.send_email(data)
                
                return Response({'error': 'Expired'}, status=status.HTTP_401_UNAUTHORIZED)

        except jwt.exceptions.DecodeError as identifier:
            return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)

class LoginApiView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PasswordResetEmail(generics.GenericAPIView):
    serializer_class = PasswordResetEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': 'We have sent a lint to reset your password'}, status=status.HTTP_200_OK)

class PasswordTokenCheck(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User_Login.objects.get(id = id)
            
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Token is not valid, pleas request a new one'}, status = status.HTTP_401_UNAUTHORIZED)
            return Response({'success': 'true', 'message': 'Credentials valid', 'uidb64': uidb64, 'token': token}, status= status.HTTP_200_OK)      

        except DjangoUnicodeDecodeError as identifier:
            return Response({'error': 'Token is not valid, pleas request a new one'}, status = status.HTTP_401_UNAUTHORIZED)

class SetNewPassword(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data = request.data)

        serializer.is_valid(raise_exception=True)
        return Response({'succes': 'true', 'message': 'Password reset succes'}, status = status.HTTP_200_OK)

class BlacklistTokenUpdateView(generics.GenericAPIView):
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
