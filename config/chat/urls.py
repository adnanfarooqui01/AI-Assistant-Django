from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_ui),
    path('ask/', views.chat_with_ai),
    path('history/', views.get_chat_history),
]
