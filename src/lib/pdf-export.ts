import jsPDF from "jspdf";
import { AnalysisResult } from "./daat-engine/types";

export async function exportReportToPdf(result: AnalysisResult): Promise<void> {
  const { marketData, competitors, riskAssessment, scoreBreakdown, strategicAdvice } = result;
  
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  const reportId = `DAAT-${result.id.slice(0, 8).toUpperCase()}`;
  const formattedDate = result.createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Helper function to add new page if needed
  const checkPageBreak = (additionalHeight: number) => {
    if (yPos + additionalHeight > pageHeight - 25) {
      pdf.addPage();
      yPos = 25;
    }
  };

  // ==================== HEADER ====================
  pdf.setFillColor(30, 30, 40);
  pdf.rect(0, 0, pageWidth, 45, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("DAAT IA", margin, 25);
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Laudo de Análise Competitiva", margin, 35);
  
  pdf.setFontSize(9);
  pdf.setTextColor(180, 180, 180);
  pdf.text(`${reportId} • ${formattedDate}`, margin, 42);

  yPos = 55;

  // ==================== SUBJECT ====================
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.text("OBJETO DE ANÁLISE", margin, yPos);
  yPos += 7;
  
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(result.segment, margin, yPos);
  yPos += 15;

  // ==================== SCORE SECTION ====================
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("PONTUAÇÃO FINAL", margin, yPos);
  yPos += 10;

  pdf.setFontSize(28);
  pdf.setTextColor(99, 102, 241);
  pdf.text(`${scoreBreakdown.totalScore}/100`, margin, yPos);
  
  pdf.setFontSize(14);
  pdf.setTextColor(40, 40, 40);
  pdf.text(scoreBreakdown.classification, margin + 45, yPos);
  yPos += 15;

  // Score breakdown
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Oportunidade de Mercado: ${scoreBreakdown.marketOpportunity}/30`, margin, yPos);
  pdf.text(`Posição Competitiva: ${scoreBreakdown.competitivePosition}/30`, margin + 60, yPos);
  yPos += 6;
  pdf.text(`Viabilidade de Execução: ${scoreBreakdown.executionViability}/25`, margin, yPos);
  pdf.text(`Ajuste de Risco: ${scoreBreakdown.riskAdjustment}`, margin + 60, yPos);
  yPos += 15;

  // ==================== SECTION 1: MARKET DATA ====================
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("1. DADOS DE MERCADO", margin, yPos);
  yPos += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`TAM: ${marketData.tam}`, margin, yPos);
  pdf.text(`Crescimento: ${marketData.growthRate}%`, margin + 60, yPos);
  pdf.text(`Concorrentes: ${competitors.length}`, margin + 110, yPos);
  yPos += 10;

  // Competitors list
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Principais Concorrentes:", margin, yPos);
  yPos += 6;

  competitors.slice(0, 5).forEach((comp) => {
    checkPageBreak(8);
    pdf.setTextColor(40, 40, 40);
    pdf.text(`• ${comp.name} - ${comp.revenue} (${comp.marketShare}% market share)`, margin + 4, yPos);
    yPos += 5;
  });
  yPos += 10;

  // ==================== SECTION 2: RISK ANALYSIS ====================
  checkPageBreak(40);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("2. ANÁLISE DE RISCO", margin, yPos);
  yPos += 10;

  // Strengths
  pdf.setFontSize(10);
  pdf.setTextColor(34, 197, 94);
  pdf.text("Forças:", margin, yPos);
  yPos += 6;

  pdf.setFontSize(9);
  pdf.setTextColor(40, 40, 40);
  riskAssessment.strengths.forEach((strength) => {
    checkPageBreak(8);
    pdf.text(`✓ ${strength.title}`, margin + 4, yPos);
    yPos += 5;
  });
  yPos += 8;

  // Risks
  checkPageBreak(30);
  pdf.setFontSize(10);
  pdf.setTextColor(239, 68, 68);
  pdf.text("Riscos:", margin, yPos);
  yPos += 6;

  pdf.setFontSize(9);
  riskAssessment.risks.forEach((risk) => {
    checkPageBreak(12);
    const severityLabel = risk.severity === 'high' ? '[ALTO]' : 
                          risk.severity === 'medium' ? '[MÉDIO]' : '[BAIXO]';
    pdf.setTextColor(100, 100, 100);
    pdf.text(severityLabel, margin + 4, yPos);
    pdf.setTextColor(40, 40, 40);
    pdf.text(risk.title, margin + 22, yPos);
    yPos += 5;
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    const descLines = pdf.splitTextToSize(risk.description, contentWidth - 10);
    pdf.text(descLines, margin + 4, yPos);
    yPos += descLines.length * 4 + 4;
    pdf.setFontSize(9);
  });
  yPos += 10;

  // ==================== SECTION 3: ROADMAP ====================
  checkPageBreak(40);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("3. PLANO DE AÇÃO (90 DIAS)", margin, yPos);
  yPos += 10;

  [1, 2, 3].forEach((month) => {
    const actions = strategicAdvice.roadmap.filter((a) => a.month === month);
    if (actions.length === 0) return;
    
    checkPageBreak(25);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(99, 102, 241);
    pdf.text(`Mês ${month}:`, margin, yPos);
    yPos += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    actions.forEach((action) => {
      checkPageBreak(12);
      pdf.setTextColor(40, 40, 40);
      pdf.text(`• ${action.title}`, margin + 4, yPos);
      yPos += 5;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      const descLines = pdf.splitTextToSize(action.description, contentWidth - 10);
      pdf.text(descLines, margin + 8, yPos);
      yPos += descLines.length * 4 + 3;
      pdf.setFontSize(9);
    });
    yPos += 5;
  });

  // ==================== SECTION 4: RECOMMENDATIONS ====================
  checkPageBreak(40);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("4. RECOMENDAÇÕES", margin, yPos);
  yPos += 10;

  // Priority Validations
  pdf.setFontSize(10);
  pdf.setTextColor(139, 92, 246);
  pdf.text("Validações Prioritárias:", margin, yPos);
  yPos += 6;

  pdf.setFontSize(9);
  pdf.setTextColor(40, 40, 40);
  strategicAdvice.priorityValidations.forEach((validation, index) => {
    checkPageBreak(8);
    pdf.text(`${index + 1}. ${validation}`, margin + 4, yPos);
    yPos += 5;
  });
  yPos += 8;

  // Quick Wins
  checkPageBreak(30);
  pdf.setFontSize(10);
  pdf.setTextColor(34, 197, 94);
  pdf.text("Quick Wins:", margin, yPos);
  yPos += 6;

  pdf.setFontSize(9);
  pdf.setTextColor(40, 40, 40);
  strategicAdvice.quickWins.forEach((win) => {
    checkPageBreak(8);
    pdf.text(`★ ${win}`, margin + 4, yPos);
    yPos += 5;
  });

  // ==================== FOOTER ====================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text(
      `${reportId} • Documento gerado por Daat AI Engine`,
      margin,
      pageHeight - 10
    );
    pdf.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    );
  }

  // Save
  pdf.save(`${reportId}-${result.segment.replace(/\s+/g, "-")}.pdf`);
}
