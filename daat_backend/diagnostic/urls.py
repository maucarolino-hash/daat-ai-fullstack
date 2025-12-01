from django.urls import path
from . import views

urlpatterns = [
    path('analyze', views.process_diagnostic, name='process_diagnostic'),
    path('status/<str:task_id>/', views.check_status, name='check_status'),
    path('history', views.get_history, name='get_history'),
    path('create-admin/', views.create_admin_user, name='create_admin_user'), # Rota Secreta
]
