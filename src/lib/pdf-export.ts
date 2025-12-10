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

  // Extract only the first line of segment (the name)
  const segmentName = result.segment.split('\n')[0].trim();

  // Helper function to add new page if needed
  const checkPageBreak = (additionalHeight: number) => {
    if (yPos + additionalHeight > pageHeight - 25) {
      pdf.addPage();
      yPos = 25;
      return true;
    }
    return false;
  };

  // Draw horizontal separator line
  const drawSeparator = () => {
    pdf.setDrawColor(200, 60, 60);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
  };

  // ==================== PAGE 1 - HEADER ====================
  
  // Dark header background
  pdf.setFillColor(40, 40, 50);
  pdf.rect(0, 0, pageWidth, 48, "F");
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("LAUDO DE ANÁLISE COMPETITIVA", margin, 22);
  
  // Subtitle
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Daat AI Engine • Relatório Automatizado", margin, 32);
  
  // Report ID and Date
  pdf.setFontSize(9);
  pdf.text(`${reportId} | ${formattedDate}`, margin, 42);

  yPos = 60;

  // ==================== OBJETO DE ANÁLISE ====================
  pdf.setTextColor(130, 130, 130);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("OBJETO DE ANÁLISE", margin, yPos);
  yPos += 6;
  
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(segmentName, margin, yPos);
  yPos += 12;

  // Red separator line
  drawSeparator();

  // ==================== PARECER FINAL ====================
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("PARECER FINAL", margin, yPos);
  yPos += 8;

  // Green score box
  const scoreBoxWidth = 50;
  const scoreBoxHeight = 45;
  pdf.setFillColor(34, 197, 94);
  pdf.roundedRect(margin, yPos, scoreBoxWidth, scoreBoxHeight, 4, 4, "F");
  
  // Score number centered in box
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont("helvetica", "bold");
  const scoreText = String(scoreBreakdown.totalScore);
  const scoreTextWidth = pdf.getTextWidth(scoreText);
  pdf.text(scoreText, margin + (scoreBoxWidth - scoreTextWidth) / 2, yPos + 30);
  
  // Classification text next to box
  const textX = margin + scoreBoxWidth + 12;
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.text(scoreBreakdown.classification, textX, yPos + 18);
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Índice de Viabilidade Daat", textX, yPos + 28);
  
  yPos += scoreBoxHeight + 12;

  // Score breakdown - aligned list
  const breakdownItems = [
    { label: "Oportunidade de Mercado:", value: `${scoreBreakdown.marketOpportunity}/30` },
    { label: "Posição Competitiva:", value: `${scoreBreakdown.competitivePosition}/30` },
    { label: "Viabilidade de Execução:", value: `${scoreBreakdown.executionViability}/25` },
    { label: "Ajuste de Risco:", value: String(scoreBreakdown.riskAdjustment) },
  ];

  pdf.setFontSize(10);
  breakdownItems.forEach((item) => {
    pdf.setTextColor(60, 60, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text(item.label, margin, yPos);
    pdf.text(item.value, pageWidth - margin, yPos, { align: "right" });
    yPos += 6;
  });

  yPos += 12;

  // ==================== 1. DADOS DE MERCADO ====================
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("1. DADOS DE MERCADO", margin, yPos);
  yPos += 10;

  // Market metrics
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`TAM: ${marketData.tam}`, margin, yPos);
  pdf.text(`Crescimento: ${marketData.growthRate}%`, margin + 50, yPos);
  pdf.text(`Concorrentes: ${competitors.length}`, margin + 110, yPos);
  yPos += 12;

  // Competitors table header
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPos - 4, contentWidth, 8, "F");
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(margin, yPos + 4, pageWidth - margin, yPos + 4);
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Empresa", margin + 3, yPos + 1);
  pdf.text("Receita", margin + 55, yPos + 1);
  pdf.text("Market Share", margin + 95, yPos + 1);
  pdf.text("Crescimento", margin + 140, yPos + 1);
  yPos += 8;

  // Table rows
  pdf.setTextColor(40, 40, 40);
  competitors.slice(0, 5).forEach((comp) => {
    yPos += 6;
    pdf.text(comp.name.substring(0, 18), margin + 3, yPos);
    pdf.text(comp.revenue, margin + 55, yPos);
    pdf.text(`${comp.marketShare}%`, margin + 95, yPos);
    pdf.text(`${comp.growth}%`, margin + 140, yPos);
  });

  // ==================== PAGE 2 ====================
  pdf.addPage();
  yPos = 20;
  drawSeparator();

  // ==================== 2. ANÁLISE DE RISCO ====================
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("2. ANÁLISE DE RISCO", margin, yPos);
  yPos += 10;

  // Forças Identificadas
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Forças Identificadas:", margin, yPos);
  yPos += 7;

  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  riskAssessment.strengths.forEach((strength) => {
    pdf.text(`• ${strength.title}`, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 6;

  // Riscos Detectados
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Riscos Detectados:", margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  riskAssessment.risks.forEach((risk) => {
    const severityLabel = risk.severity === 'high' ? '[HIGH]' : 
                          risk.severity === 'medium' ? '[MEDIUM]' : '[LOW]';
    
    pdf.setTextColor(40, 40, 40);
    pdf.setFont("helvetica", "bold");
    pdf.text(`• ${severityLabel} ${risk.title}`, margin + 5, yPos);
    yPos += 5;
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const descLines = pdf.splitTextToSize(risk.description, contentWidth - 15);
    pdf.text(descLines, margin + 10, yPos);
    yPos += descLines.length * 4 + 5;
    pdf.setFontSize(10);
  });

  yPos += 6;
  drawSeparator();

  // ==================== 3. PLANO DE AÇÃO (90 DIAS) ====================
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("3. PLANO DE AÇÃO (90 DIAS)", margin, yPos);
  yPos += 10;

  [1, 2, 3].forEach((month) => {
    const actions = strategicAdvice.roadmap.filter((a) => a.month === month);
    if (actions.length === 0) return;
    
    // Check if we need a new page - but only if there's very little space
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 20;
      drawSeparator();
    }
    
    // Month header in green
    pdf.setTextColor(34, 197, 94);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Mês ${month}`, margin, yPos);
    yPos += 7;

    actions.forEach((action) => {
      // Check for page break within month
      if (yPos > pageHeight - 30) {
        pdf.addPage();
        yPos = 20;
        drawSeparator();
      }
      
      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(`• ${action.title}`, margin + 5, yPos);
      yPos += 5;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const descLines = pdf.splitTextToSize(action.description, contentWidth - 15);
      pdf.text(descLines, margin + 10, yPos);
      yPos += descLines.length * 4 + 5;
    });
    yPos += 4;
  });

  // ==================== 4. RECOMENDAÇÕES ====================
  // Check if we need a new page
  if (yPos > pageHeight - 80) {
    pdf.addPage();
    yPos = 20;
  }
  
  drawSeparator();

  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("4. RECOMENDAÇÕES", margin, yPos);
  yPos += 10;

  // Validações Prioritárias
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Validações Prioritárias:", margin, yPos);
  yPos += 7;

  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  strategicAdvice.priorityValidations.forEach((validation, index) => {
    if (yPos > pageHeight - 25) {
      pdf.addPage();
      yPos = 25;
    }
    const validationLines = pdf.splitTextToSize(`${index + 1}. ${validation}`, contentWidth - 10);
    pdf.text(validationLines, margin + 5, yPos);
    yPos += validationLines.length * 5 + 2;
  });
  yPos += 6;

  // Quick Wins
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Quick Wins:", margin, yPos);
  yPos += 7;

  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  strategicAdvice.quickWins.forEach((win) => {
    if (yPos > pageHeight - 25) {
      pdf.addPage();
      yPos = 25;
    }
    const winLines = pdf.splitTextToSize(`• ${win}`, contentWidth - 10);
    pdf.text(winLines, margin + 5, yPos);
    yPos += winLines.length * 5 + 2;
  });

  // ==================== ADD FOOTERS TO ALL PAGES ====================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(130, 130, 130);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Página ${i} de ${totalPages} | ${reportId} | Documento confidencial gerado por Daat AI Engine`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save - use only the first part of segment name for filename
  const fileSegment = segmentName.replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '').replace(/\s+/g, '-');
  pdf.save(`DAAT-ANALYSIS-${fileSegment}.pdf`);
}
