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
