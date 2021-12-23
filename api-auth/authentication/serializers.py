from rest_framework import serializers
from .models import User_Login
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.urls import reverse
from .utils import Util

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length = 68, min_length = 6, write_only=True)

    class Meta:
        model = User_Login
        fields = ['email', 'username', 'password']

    def validate(self, attrs):
        email = attrs.get('email', '')
        username = attrs.get('username', '')

        if not username.isalnum():
            raise serializers.ValidationError('username only alphanumeric')
        return attrs

    def create(self, validate_data):
        return User_Login.objects.create_user(**validate_data)

class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)
    
    class Meta:
        model = User_Login
        fields = ['token']

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=5)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    username = serializers.CharField(max_length=68, min_length=6, read_only=True)
    tokens = serializers.JSONField(read_only=True)

    class Meta:
        model = User_Login
        fields = ['id', 'email', 'password', 'username', 'is_verified', 'is_staff', 'tokens']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')

        # VERIFY IF THE ACCOUNT IS ACTIVE AND VERIFIED
        user = User_Login.objects.filter(email = email).first()
        if user:
            if not user.is_verified:
                raise AuthenticationFailed('Account not verified')
            if not user.is_active:
                raise AuthenticationFailed('Account not activated')
       
        authUser = auth.authenticate(email = email, password = password)
        if not authUser:
            raise AuthenticationFailed('Invalid credentials')

        return {
            'id': user.id,
            'email':user.email,
            'username': user.username,
            'is_verified': user.is_verified,
            'is_staff': user.is_staff,
            'tokens': user.tokens,
        }

class LoginDetailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=5)
    class Meta:
        model = User_Login
        fields = ['id', 'email']

class PasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length = 5)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email', '')
        if User_Login.objects.filter(email = email).exists():
            user = User_Login.objects.get(email = email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)

            relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            absurl = 'http://127.0.0.1:8000/'+relativeLink
            email_body = 'Hola ' + user.username+ '. Use the link below to reset your password \n' + absurl
            data = {'email_body': email_body,'to_email': user.email, 'email_subject': 'Reset your Password'}
            Util.send_email(data)

        return super().validate(attrs)

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length = 6, max_length = 68, write_only = True)
    token = serializers.CharField(min_length = 1, write_only = True)
    uidb64 = serializers.CharField(min_length = 1, write_only = True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):

        try:
            password = attrs.get('password', '')
            token = attrs.get('token', '')
            uidb64 = attrs.get('uidb64', '')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User_Login.objects.get(id = id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)
            user.set_password(password)
            user.save()
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)