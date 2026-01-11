from django.db import models
from django.contrib.auth.models import User

class Diagnostic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    customer_segment = models.CharField(max_length=200)
    problem = models.TextField()
    value_proposition = models.TextField()
    score = models.IntegerField()
    feedback = models.TextField()
    result = models.JSONField(null=True, blank=True) # Full structured analysis
    created_at = models.DateTimeField(auto_now_add=True)

    # --- NOVO: Campos para categorização futura (Data Tagging) ---
    # Isso permite filtrar "Todas as Fintechs" ou "Todos os Marketplaces" no futuro
    industry_tag = models.CharField(max_length=100, blank=True, null=True) 
    business_model_tag = models.CharField(max_length=50, blank=True, null=True) # Ex: B2B, B2C, SaaS

    # --- NOVO: VC MVP Layer (Fast Indexing) ---
    company_name = models.CharField(max_length=200, blank=True, null=True)
    recommendation = models.CharField(max_length=50, blank=True, null=True) # Ex: "Strong Interest", "Pass"

    def __str__(self):
        return f"Ideia {self.customer_segment} - Score {self.score}"

# --- NOVO MODELO: O Rastro de Realidade (Ground Truth) ---
class StartupOutcome(models.Model):
    diagnostic = models.OneToOneField(Diagnostic, on_delete=models.CASCADE, related_name='outcome')
    last_updated = models.DateTimeField(auto_now=True)
    
    # Marcos de Sucesso (O que vamos perguntar no e-mail daqui a 6 meses)
    is_active = models.BooleanField(default=True)
    received_investment = models.BooleanField(default=False)
    investment_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    accepted_in_accelerator = models.BooleanField(default=False)
    monthly_revenue = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Onde a IA acertou/errou?
    founder_feedback_score = models.IntegerField(null=True) # 1-10: "A análise foi útil?"
    pivot_occurred = models.BooleanField(default=False) # Se mudaram a ideia original
    
    def __str__(self):
        return f"Outcome for {self.diagnostic.id}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    credits = models.IntegerField(default=3) # Free tier starts with 3
    is_premium = models.BooleanField(default=False)
    
    # NOVOS CAMPOS PARA SETTINGS
    company = models.CharField(max_length=150, blank=True, null=True)
    role = models.CharField(max_length=150, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} Profile"

class WebhookConfig(models.Model):
    PLATFORM_CHOICES = [
        ('slack', 'Slack'),
        ('discord', 'Discord'),
        ('custom', 'Custom'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='webhooks')
    name = models.CharField(max_length=100)
    url = models.URLField()
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default='slack')
    is_active = models.BooleanField(default=True)
    events = models.JSONField(default=list) # List of event strings: ['price_change', 'risk_alert']
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.platform})"

class AnalysisFeedback(models.Model):
    diagnostic = models.ForeignKey(Diagnostic, on_delete=models.CASCADE, related_name='feedbacks')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    category = models.CharField(max_length=50, blank=True, null=True) # e.g., 'Score', 'Metrics', 'General'
    feedback_text = models.TextField(blank=True, null=True)
    corrected_value = models.JSONField(blank=True, null=True) # For structured corrections
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.diagnostic.id} - {self.rating} stars"
