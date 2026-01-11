from celery import shared_task
from django.contrib.auth.models import User
from .models import Diagnostic
from .services import analyze_idea  # Importar a nova lógica

@shared_task
def analyze_startup_task(segment, problem, proposition, user_id, pitch_deck_text=None):
    try:
        # Chamar a engine centralizada em services.py
        result = analyze_idea(segment, problem, proposition, pitch_deck_text)
        
        # Salvar no Banco de Dados (Histórico) se tiver usuário
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                Diagnostic.objects.create(
                    user=user,
                    customer_segment=segment,
                    problem=problem,
                    value_proposition=proposition,
                    score=result.get('score', 0),
                    feedback=result.get('feedback', '')
                )
            except Exception as db_err:
                print(f"Erro ao salvar histórico: {db_err}")

        return result

    except Exception as e:
        return {
            "score": 0,
            "feedback": f"Erro crítico na task: {str(e)}"
        }
