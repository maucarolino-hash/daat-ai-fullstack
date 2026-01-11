
import os
import django
import json
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.contrib.auth.models import User
from diagnostic.models import Diagnostic

def seed_data():
    try:
        users = User.objects.all()
        print(f"Found {len(users)} users. Seeding for ALL of them.")

        for user in users:
            print(f"Seeding for: {user.username} (ID: {user.id})")
            
            # Comprehensive Mock Result (Matching AnalysisReport.tsx schema)
            mock_result = {
                "id": f"mock-uuid-{user.id}",
                "segment": "SaaS LegalTech para PMEs",
                "marketData": {
                    "tam": "R$ 1.5 Bilhões",
                    "growthRate": 15,
                    "trends": [
                        "Adoção massiva de AI em processos jurídicos",
                        "Automação de compliance para PMEs",
                        "Integração com tribunais digitais"
                    ]
                },
                "competitors": [
                    {"id": 1, "name": "LegalTech One", "revenue": "R$ 50M", "marketShare": 15, "growth": 12},
                    {"id": 2, "name": "JusBrasil", "revenue": "R$ 200M", "marketShare": 45, "growth": 8},
                    {"id": 3, "name": "SemProcesso", "revenue": "R$ 25M", "marketShare": 8, "growth": 25}
                ],
                "riskAssessment": {
                    "level": "medium",
                    "risks": [
                        {"title": "Dependência de APIs de terceiros", "severity": "medium", "description": "Alterações nos tribunais podem afetar o serviço"},
                        {"title": "Concorrência Consolidada", "severity": "high", "description": "JusBrasil domina SEO"}
                    ],
                    "strengths": [
                        {"title": "Modelo SaaS Escalável", "evidence": "Baixo custo marginal"},
                        {"title": "Tecnologia Proprietária", "evidence": "Algoritmo de previsão de sentenças"}
                    ]
                },
                "scoreBreakdown": {
                    "totalScore": 82,
                    "classification": "Alta Viabilidade",
                    "marketOpportunity": 25,
                    "competitivePosition": 20,
                    "executionViability": 22,
                    "riskAdjustment": -5
                },
                "strategicAdvice": {
                    "roadmap": [
                        {"month": 1, "priority": "high", "title": "MVP Focado", "description": "Lançar validador de contratos simples"},
                        {"month": 2, "priority": "medium", "title": "Parcerias", "description": "Integrar com escritórios locais"},
                        {"month": 3, "priority": "high", "title": "Growth", "description": "Inbound marketing para advogados juniores"}
                    ],
                    "priorityValidations": [
                        "Validar willingness to pay com 10 escritórios",
                        "Testar precisão da IA em 50 processos reais"
                    ],
                    "quickWins": [
                        "Criar calculadora de ROI em tempo",
                        "Listar nos marketplaces de advogados"
                    ]
                },
                "createdAt": timezone.now().isoformat()
            }

            # Create a completed diagnostic
            diag = Diagnostic.objects.create(
                user=user,
                customer_segment="SaaS LegalTech para PMEs (Universal Seed)",
                problem="Dificuldade de acesso a consultoria jurídica acessível e rápida.",
                value_proposition="Plataforma de AI que analisa contratos e riscos em segundos.",
                score=82,
                result=mock_result, # Injecting the JSON here
                feedback="Análise concluída com sucesso. Potencial alto de escalabilidade.",
                created_at=timezone.now()
            )
            print(f"✅ Created Full Mock Diagnostic ID: {diag.id} for {user.username}")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")

if __name__ == '__main__':
    seed_data()
