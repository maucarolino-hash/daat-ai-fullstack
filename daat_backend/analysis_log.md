INFO:diagnostic.services.market_research:\U0001f680 Iniciando Fase 1: Pesquisa de Mercado
INFO:diagnostic.services.market_research:\U0001f4dd Gerando queries de pesquisa...
INFO:diagnostic.services.market_research:\U0001f50d Executando pesquisas na web...
INFO:diagnostic.services.market_research:  Pesquisando competitors: 4 queries
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Pão artesanal de fermentação natural competitors Brazil 2024' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Pão artesanal de fermentação natural similar companies startups' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet Amantes de gastronomia solutions companies' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet startups funding 2024 Crunchbase' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.services.market_research:  Pesquisando market_size: 3 queries
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet market size Brazil 2024' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet TAM SAM SOM Brazil' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet industry statistics Brazil' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.services.market_research:  Pesquisando trends: 3 queries
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet trends 2024 2025' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet growth forecast' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.utils.tavily_client:\U0001f50d Pesquisando: 'Padaria Gourmet innovation emerging technologies' (tentativa 1/3)
INFO:diagnostic.utils.tavily_client:\u2705 Pesquisa concluída: 5 resultados
INFO:diagnostic.services.market_research:\U0001f916 Processando resultados com GPT...
ERROR:diagnostic.services.market_research:\u274c Erro na Fase 1: '\n  "competitors"'
WARNING:diagnostic.services.market_research:\u26a0\ufe0f Gerando relatório fallback devido a falha na pesquisa
--- Testing Phase 1 Market Research ---
Executing analysis (this may take 10-20 seconds)...
Traceback (most recent call last):
  File "C:\Users\mau-3\OneDrive\Desktop\project Daat\daat_backend\debug_analysis_flow.py", line 45, in test_analysis
    print("\u26a0\ufe0f Analysis returned fallback or empty.")
    ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\mau-3\AppData\Local\Programs\Python\Python314\Lib\encodings\cp1252.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_table)[0]
           ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
UnicodeEncodeError: 'charmap' codec can't encode characters in position 0-1: character maps to <undefined>

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "C:\Users\mau-3\OneDrive\Desktop\project Daat\daat_backend\debug_analysis_flow.py", line 55, in <module>
    test_analysis()
    ~~~~~~~~~~~~~^^
  File "C:\Users\mau-3\OneDrive\Desktop\project Daat\daat_backend\debug_analysis_flow.py", line 50, in test_analysis
    print(f"\u274c Analysis Failed with Error: {e}")
    ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\mau-3\AppData\Local\Programs\Python\Python314\Lib\encodings\cp1252.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_table)[0]
           ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
UnicodeEncodeError: 'charmap' codec can't encode character '\u274c' in position 0: character maps to <undefined>
