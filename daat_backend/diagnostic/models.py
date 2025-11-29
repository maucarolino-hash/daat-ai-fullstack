from django.db import models
from django.contrib.auth.models import User

class Diagnostic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    customer_segment = models.CharField(max_length=200)
    problem = models.TextField()
    value_proposition = models.TextField()
    score = models.IntegerField()
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ideia {self.customer_segment} - Score {self.score}"
