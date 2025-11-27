from django.urls import path
from . import views

urlpatterns = [
    path('api/analyze', views.process_diagnostic, name='process_diagnostic'),
    path('api/history', views.get_history, name='get_history'),
]
