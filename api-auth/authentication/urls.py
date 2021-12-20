from django.urls import path
from django.urls.conf import include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginApiView, BlacklistTokenUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginApiView.as_view(), name='login'),
    
    #== TOKENS ==#
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]
