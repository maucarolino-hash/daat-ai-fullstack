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

  const reportId = `DAAT-ANALYSIS`;
  const formattedDate = result.createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Helper function to add new page if needed
  const checkPageBreak = (additionalHeight: number) => {
    if (yPos + additionalHeight > pageHeight - 30) {
      pdf.addPage();
      yPos = 25;
      return true;
    }
    return false;
  };

  // Draw horizontal separator line
  const drawSeparator = () => {
    pdf.setDrawColor(220, 50, 50);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
  };

  // ==================== PAGE 1 - HEADER ====================
  
  // Dark header background
  pdf.setFillColor(35, 35, 45);
  pdf.rect(0, 0, pageWidth, 50, "F");
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("LAUDO DE ANÁLISE COMPETITIVA", margin, 28);
  
  // Subtitle
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("Daat AI Engine • Relatório Automatizado", margin, 38);
  
  // Report ID and Date
  pdf.setFontSize(10);
  pdf.text(`${reportId} | ${formattedDate}`, margin, 46);

  yPos = 65;

  // ==================== OBJETO DE ANÁLISE ====================
  pdf.setTextColor(120, 120, 120);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("OBJETO DE ANÁLISE", margin, yPos);
  yPos += 7;
  
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(result.segment, margin, yPos);
  yPos += 15;

  // Red separator line
  drawSeparator();
  yPos += 5;

  // ==================== PARECER FINAL ====================
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("PARECER FINAL", margin, yPos);
  yPos += 10;

  // Green score box
  const scoreBoxSize = 35;
  pdf.setFillColor(34, 197, 94);
  pdf.roundedRect(margin, yPos, scoreBoxSize, scoreBoxSize, 3, 3, "F");
  
  // Score number
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  const scoreText = String(scoreBreakdown.totalScore);
  const scoreWidth = pdf.getTextWidth(scoreText);
  pdf.text(scoreText, margin + (scoreBoxSize - scoreWidth) / 2, yPos + 23);
  
  // Classification text
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(scoreBreakdown.classification, margin + scoreBoxSize + 10, yPos + 15);
  
  pdf.setTextColor(120, 120, 120);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Índice de Viabilidade Daat", margin + scoreBoxSize + 10, yPos + 23);
  
  yPos += scoreBoxSize + 15;

  // Score breakdown table
  const breakdownItems = [
    { label: "Oportunidade de Mercado", value: `${scoreBreakdown.marketOpportunity}/30` },
    { label: "Posição Competitiva", value: `${scoreBreakdown.competitivePosition}/30` },
    { label: "Viabilidade de Execução", value: `${scoreBreakdown.executionViability}/25` },
    { label: "Ajuste de Risco", value: String(scoreBreakdown.riskAdjustment) },
  ];

  pdf.setFontSize(10);
  breakdownItems.forEach((item) => {
    pdf.setTextColor(60, 60, 60);
    pdf.text(item.label, margin, yPos);
    pdf.text(item.value, pageWidth - margin, yPos, { align: "right" });
    yPos += 7;
  });

  yPos += 12;

  // ==================== 1. DADOS DE MERCADO ====================
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("1. DADOS DE MERCADO", margin, yPos);
  yPos += 12;

  // Market metrics
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text(`TAM: ${marketData.tam}`, margin, yPos);
  pdf.text(`Crescimento: ${marketData.growthRate}%`, margin + 55, yPos);
  pdf.text(`Concorrentes: ${competitors.length}`, margin + 115, yPos);
  yPos += 15;

  // Competitors table header
  pdf.setFillColor(248, 248, 248);
  pdf.rect(margin, yPos - 4, contentWidth, 8, "F");
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(0.3);
  pdf.line(margin, yPos + 4, pageWidth - margin, yPos + 4);
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Empresa", margin + 2, yPos + 1);
  pdf.text("Receita", margin + 55, yPos + 1);
  pdf.text("Market Share", margin + 95, yPos + 1);
  pdf.text("Crescimento", margin + 140, yPos + 1);
  yPos += 10;

  // Competitors table rows
  pdf.setTextColor(40, 40, 40);
  competitors.slice(0, 5).forEach((comp) => {
    pdf.text(comp.name.substring(0, 18), margin + 2, yPos);
    pdf.text(comp.revenue, margin + 55, yPos);
    pdf.text(`${comp.marketShare}%`, margin + 95, yPos);
    pdf.text(`${comp.growth}%`, margin + 140, yPos);
    yPos += 8;
  });

  // ==================== PAGE 2 ====================
  pdf.addPage();
  yPos = 25;

  // Red separator
  drawSeparator();

  // ==================== 2. ANÁLISE DE RISCO ====================
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("2. ANÁLISE DE RISCO", margin, yPos);
  yPos += 12;

  // Forças Identificadas
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Forças Identificadas:", margin, yPos);
  yPos += 8;

  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  riskAssessment.strengths.forEach((strength) => {
    pdf.text(`• ${strength.title}`, margin + 5, yPos);
    yPos += 7;
  });
  yPos += 8;

  // Riscos Detectados
  pdf.setTextColor(239, 68, 68);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Riscos Detectados:", margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  riskAssessment.risks.forEach((risk) => {
    checkPageBreak(20);
    
    const severityLabel = risk.severity === 'high' ? '[HIGH]' : 
                          risk.severity === 'medium' ? '[MEDIUM]' : '[LOW]';
    
    pdf.setTextColor(40, 40, 40);
    pdf.setFont("helvetica", "bold");
    pdf.text(`• ${severityLabel} ${risk.title}`, margin + 5, yPos);
    yPos += 6;
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    pdf.text(`   ${risk.description}`, margin + 5, yPos);
    yPos += 10;
  });

  yPos += 10;

  // Red separator
  drawSeparator();

  // ==================== 3. PLANO DE AÇÃO (90 DIAS) ====================
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("3. PLANO DE AÇÃO (90 DIAS)", margin, yPos);
  yPos += 12;

  [1, 2, 3].forEach((month) => {
    const actions = strategicAdvice.roadmap.filter((a) => a.month === month);
    if (actions.length === 0) return;
    
    checkPageBreak(35);
    
    // Month header in green
    pdf.setTextColor(34, 197, 94);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Mês ${month}`, margin, yPos);
    yPos += 8;

    actions.forEach((action) => {
      checkPageBreak(18);
      
      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(`• ${action.title}`, margin + 5, yPos);
      yPos += 6;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "normal");
      pdf.text(`   ${action.description}`, margin + 5, yPos);
      yPos += 10;
    });
    yPos += 5;
  });

  // ==================== PAGE 3 ====================
  pdf.addPage();
  yPos = 25;

  // Red separator
  drawSeparator();

  // ==================== 4. RECOMENDAÇÕES ====================
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("4. RECOMENDAÇÕES", margin, yPos);
  yPos += 12;

  // Validações Prioritárias
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Validações Prioritárias:", margin, yPos);
  yPos += 8;

  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  strategicAdvice.priorityValidations.forEach((validation, index) => {
    checkPageBreak(10);
    pdf.text(`${index + 1}. ${validation}`, margin + 5, yPos);
    yPos += 7;
  });
  yPos += 10;

  // Quick Wins
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Quick Wins:", margin, yPos);
  yPos += 8;

  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  strategicAdvice.quickWins.forEach((win) => {
    checkPageBreak(10);
    pdf.text(`• ${win}`, margin + 5, yPos);
    yPos += 7;
  });

  // ==================== ADD FOOTERS TO ALL PAGES ====================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(130, 130, 130);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Página ${i} de ${totalPages} | ${reportId} | Documento confidencial gerado por Daat AI Engine`,
      pageWidth / 2,
      pageHeight - 12,
      { align: "center" }
    );
  }

  // Save
  const fileName = `DAAT-ANALYSIS-${result.segment.replace(/\s+/g, "-")}`;
  pdf.save(`${fileName}.pdf`);
}
