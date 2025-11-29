from django.urls import path
from . import views

urlpatterns = [
    path('analyze', views.process_diagnostic, name='process_diagnostic'),
    path('history', views.get_history, name='get_history'),
]
