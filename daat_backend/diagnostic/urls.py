from django.urls import path
from django.urls import path, include
from . import views
from . import views_pdf
from . import views
from . import views_pdf
from . import views_sse
from . import views_generator
from . import views_thesis
from . import views_memo
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'diagnostics', views.DiagnosticViewSet, basename='diagnostic')
router.register(r'webhooks', views.WebhookViewSet, basename='webhook')

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    
    # History Endpoints
    path('history/', views.get_history, name='get_history'),
    path('history/<int:pk>/', views.delete_history, name='delete_history'),
    path('history/<int:pk>/rename/', views.rename_history, name='rename_history'),
    
    path('', include(router.urls)),
    path('analyze-public/', views.process_diagnostic, name='process_diagnostic'),
    path('analyze-startup/', views.analyze_startup, name='analyze_startup'),
    path('status/<str:task_id>/', views.check_status, name='check_status'),
    path('status/<str:report_id>/pdf/', views_pdf.generate_pdf_report, name='generate_pdf_report'),
    path('stream/<str:task_id>/', views_sse.stream_analysis, name='stream_analysis'),
    path('feedback/', views.submit_feedback, name='submit_feedback'),
    path('generate-deck/', views_generator.generate_pitch_deck, name='generate_pitch_deck'),
    path('generate-improved-deck/<int:pk>/', views_generator.generate_improved_pitch_deck, name='generate_improved_pitch_deck'),
    path('configure-thesis/', views_thesis.configure_thesis, name='configure_thesis'),
    path('generate-memo/<int:pk>/', views_memo.generate_investment_memo, name='generate_investment_memo'),
]
