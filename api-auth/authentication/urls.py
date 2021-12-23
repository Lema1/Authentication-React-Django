from django.urls import path
from django.urls.conf import include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginApiView, BlacklistTokenUpdateView, VerifyEmail, PasswordResetEmail, PasswordTokenCheck, SetNewPassword

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginApiView.as_view(), name='login'),
    path('email-verify/', VerifyEmail.as_view(), name='email-verify'),
    path('reset-email/', PasswordResetEmail.as_view(), name='reset-email'),
    path('password-reset/<uidb64>/<token>/', PasswordTokenCheck.as_view(), name='password-reset-confirm'),
    path('reset-password-complete/', SetNewPassword.as_view(), name='reset-password-complete'),
    
    #== TOKENS ==#
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]

