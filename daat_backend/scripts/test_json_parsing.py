# scripts/test_json_parsing.py

import sys
import os
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from diagnostic.services.market_research import MarketResearchService

# Teste de parsing com JSON malformado
service = MarketResearchService()

test_cases = [
    # JSON válido
    '{"test": "valid"}',
    # JSON com markdown
    '```json\n{"test": "markdown"}\n```',
    # JSON com whitespace
    '\n\n  {"test": "whitespace"}  \n',
    # JSON com texto antes
    'Aqui está o JSON: {"test": "prefix"}',
    # JSON inválido (deve retornar estrutura vazia)
    'isto não é json',
]

print("🧪 Testando parsing de JSON...\n")

for i, test in enumerate(test_cases, 1):
    print(f"Teste {i}: {test[:50]}...")
    try:
        result = service._parse_json_response(test)
        print(f"✅ Sucesso: {result}\n")
    except Exception as e:
        print(f"❌ Erro: {e}\n")
