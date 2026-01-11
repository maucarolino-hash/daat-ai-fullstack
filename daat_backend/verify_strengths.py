import requests
import json
import time

URL_ANALYZE = "http://127.0.0.1:8000/api/analyze-public/"
URL_STATUS = "http://127.0.0.1:8000/api/status/"

PITCH_DECK = """
PayFlow is a B2B Fintech SaaS that automates accounts receivable for SMEs in Brazil.
Problem: SMEs lose 20% of revenue due to manual billing errors and late payments.
Solution: Automated invoice generation, payment reconciliation, and WhatsApp reminders.
Business Model: SaaS subscription ($50/mo) + 1% fee on processed payments.
Traction: $10k MRR, 50 active clients, growing 30% MoM.
Team: CEO ex-Nubank, CTO ex-Stone.
Ask: $500k for product expansion.
"""

def test_analysis():
    print(f"🚀 Enviando Pitch Deck para análise (Fintech)...")
    payload = {
        "customerSegment": "SMEs",
        "problem": "Billing errors",
        "valueProposition": "Automated AR",
        "pitch_deck": "" # Will handle file if needed, but text is processed from fields?? 
        # Wait, views.py looks for request.FILES['pitch_deck'] for PDF, else??
        # It seems process_diagnostic uses `extract_text_from_pdf` if file exists.
        # But wait, does it accept raw text? 
        # Looking at views.py line 81: It calls analyze_idea with segment, problem, prop, deck_text.
        # If no file, deck_text is None.
    }
    
    # HACK: I need to simulate a file upload or likely the view should handle text input too?
    # View line 59: pitch_deck_text = None.
    # It seems currently it ONLY extracts from PDF. 
    # Logic: if 'pitch_deck' in request.FILES: ...
    # Error: If I send text, it won't be read?
    # Let me check analyze_idea in services.
    
    # Actually, looking at views.py, line 88 calls analyze_idea with deck_text.
    # If deck_text is None, prompt 6.2 and 7.1 might return None or skip?
    # analyze_sector_adjustment checks `if not pitch_deck_text: return None`.
    
    # So I MUST send a PDF or modify view to accept text?
    # Or maybe I can send a dummy PDF with text?
    # Or... create a temp PDF in the script.
    
    from fpdf import FPDF
    import io

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    # FPDF has issues with special chars sometimes, simplify text
    clean_text = PITCH_DECK.replace("ç", "c").replace("ã", "a").encode("latin-1", "replace").decode("latin-1")
    pdf.multi_cell(0, 10, txt=clean_text)
    
    pdf_bytes = pdf.output(dest='S').encode('latin-1') # Output as string then encode
    
    files = {'pitch_deck': ('deck.pdf', pdf_bytes, 'application/pdf')}
    data = {"customerSegment": "SMEs", "problem": "Billing", "valueProposition": "Auto"}

    try:
        start_time = time.time()
        print("📤 Uploading PDF simulation...")
        response = requests.post(URL_ANALYZE, data=data, files=files, timeout=30)
        
        if response.status_code == 200:
            task_id = response.json().get('task_id')
            print(f"✅ Tarefa iniciada: {task_id}")
            
            # POLL
            print("⏳ Aguardando processamento...")
            while True:
                time.sleep(2)
                status_res = requests.get(f"{URL_STATUS}{task_id}/")
                if status_res.status_code != 200:
                    print(f"❌ Erro no status: {status_res.status_code}")
                    break
                
                status_data = status_res.json()
                status = status_data.get('status')
                
                if status == 'completed':
                    end_time = time.time()
                    print(f"✅ Concluído em {end_time - start_time:.2f}s!")
                    result_data = status_data.get('data', {}).get('result', {})
                    if isinstance(result_data, str):
                        print(f"DEBUG: result_data is str, parsing...")
                        try:
                            result_data = json.loads(result_data)
                        except Exception as e:
                            print(f"DEBUG: Parse error {e}")
                            
                    if isinstance(result_data, str): 
                        # Double parse check
                         try:
                            result_data = json.loads(result_data)
                         except:
                            pass
                            
                    if not isinstance(result_data, dict):
                        print(f"CRITICAL: result_data is {type(result_data)}: {result_data[:100]}...")
                        break
                            
                    # VERIFY
                    sector_adj = result_data.get('sector_adjustment')
                    if sector_adj:
                        print("\n[🎯 AJUSTE SETORIAL]")
                        print(f"Setor Detectado: {sector_adj.get('sector_detected')}")
                        print(f"Score: {sector_adj.get('original_score')} -> {sector_adj.get('adjusted_score')}")
                        for adj in sector_adj.get('adjustments', []):
                            print(f" - {adj.get('criteria')}: {adj.get('impact')} pts")
                    else:
                        print("❌ 'sector_adjustment' missing.")

                    strengths = result_data.get('strengths_synthesis')
                    if strengths:
                        print("\n[💪 TOP PONTOS FORTES]")
                        print(f"Síntese: {strengths.get('synthesis_summary')}")
                        for s in strengths.get('strengths', []):
                            print(f" - {s.get('strength')} ({s.get('score_contribution')})")
                    else:
                        print("❌ 'strengths_synthesis' missing.")

                    weaknesses = result_data.get('weaknesses_synthesis')
                    if weaknesses:
                        print("\n[⚠️ TOP PONTOS FRACOS]")
                        for w in weaknesses.get('weaknesses', []):
                            print(f" - {w.get('weakness')} ({w.get('severity')}): {w.get('score_impact')} pts")
                        if weaknesses.get('next_steps'):
                             print(f"Próximos Passos: {weaknesses.get('next_steps')}")
                    else:
                        print("❌ 'weaknesses_synthesis' missing.")

                    benchmarks = result_data.get('benchmarking_analysis')
                    if benchmarks:
                        print("\n[📊 BENCHMARKING COMPARATIVO]")
                        print(f"Positioning: {benchmarks.get('positioning_statement')}")
                        for b in benchmarks.get('benchmarks', []):
                            print(f" - {b.get('metric')}: {b.get('pitch_value')} vs {b.get('benchmark_value')} ({b.get('status')})")
                    else:
                         print("❌ 'benchmarking_analysis' missing.")

                    exec_sum = result_data.get('executive_summary')
                    if exec_sum:
                        print("\n[📑 EXECUTIVE SUMMARY]")
                        print(f"Company: {exec_sum.get('company_name')} ({exec_sum.get('sector_stage')})")
                        print(f"Thesis: {exec_sum.get('thesis')}")
                        print(f"Rec: {exec_sum.get('recommendation')} ({exec_sum.get('reasoning')})")
                    else:
                        print("❌ 'executive_summary' missing.")

                    struct_rep = result_data.get('structured_report')
                    if struct_rep:
                        print("\n[📚 STRUCTURED REPORT]")
                        print(f"Thesis: {struct_rep.get('investment_thesis')[:100]}...")
                        print(f"Next Steps: {struct_rep.get('next_steps')}")
                    else:
                         print("❌ 'structured_report' missing.")
                    break
                    
                elif status == 'failed':
                    print("❌ Falha na análise.")
                    break
                else:
                    print(".", end="", flush=True)

        else:
            print(f"❌ Erro no POST: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Exceção: {e}")

if __name__ == "__main__":
    test_analysis()
