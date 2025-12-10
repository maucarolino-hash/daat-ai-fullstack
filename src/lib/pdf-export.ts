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
  let yPos = 25;

  const reportId = `DAAT-ANALYSIS`;
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
      return true;
    }
    return false;
  };

  // Add footer to current page
  const addFooter = (pageNum: number, totalPages: number) => {
    pdf.setTextColor(130, 130, 130);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Página ${pageNum} de ${totalPages} | ${reportId} | Documento confidencial gerado por Daat AI Engine`,
      pageWidth / 2,
      pageHeight - 12,
      { align: "center" }
    );
  };

  // ==================== PAGE 1 ====================
  
  // Title
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("LAUDO DE ANÁLISE COMPETITIVA", margin, yPos);
  yPos += 10;

  // Subtitle
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Daat AI Engine • Relatório Automatizado", margin, yPos);
  yPos += 12;

  // Report ID and Date
  pdf.setFontSize(11);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`${reportId} | ${formattedDate}`, margin, yPos);
  yPos += 18;

  // Object of Analysis Header
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPos - 5, contentWidth, 18, "F");
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("OBJETO DE ANÁLISE", margin + 5, yPos + 2);
  
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(14);
  pdf.text(result.segment, margin + 5, yPos + 10);
  yPos += 25;

  // Final Score Section
  pdf.setFillColor(99, 102, 241);
  pdf.rect(margin, yPos - 5, contentWidth, 45, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("PARECER FINAL", margin + 5, yPos + 2);
  
  // Score
  pdf.setFontSize(36);
  pdf.text(String(scoreBreakdown.totalScore), margin + 5, yPos + 22);
  
  pdf.setFontSize(14);
  pdf.text(scoreBreakdown.classification, margin + 30, yPos + 22);
  
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Índice de Viabilidade Daat", margin + 5, yPos + 30);
  
  // Score breakdown on the right
  const breakdownX = margin + 90;
  pdf.setFontSize(9);
  pdf.text(`Oportunidade de Mercado: ${scoreBreakdown.marketOpportunity}/30`, breakdownX, yPos + 8);
  pdf.text(`Posição Competitiva: ${scoreBreakdown.competitivePosition}/30`, breakdownX, yPos + 15);
  pdf.text(`Viabilidade de Execução: ${scoreBreakdown.executionViability}/25`, breakdownX, yPos + 22);
  pdf.text(`Ajuste de Risco: ${scoreBreakdown.riskAdjustment}`, breakdownX, yPos + 29);
  
  yPos += 55;

  // ==================== SECTION 1: MARKET DATA ====================
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("1. DADOS DE MERCADO", margin, yPos);
  yPos += 10;

  // Market metrics inline
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);
  pdf.text(`TAM: ${marketData.tam}   Crescimento: ${marketData.growthRate}%   Concorrentes: ${competitors.length}`, margin, yPos);
  yPos += 12;

  // Competitors Table Header
  pdf.setFillColor(50, 50, 60);
  pdf.rect(margin, yPos - 4, contentWidth, 8, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("Empresa", margin + 3, yPos + 1);
  pdf.text("Receita", margin + 55, yPos + 1);
  pdf.text("Market Share", margin + 95, yPos + 1);
  pdf.text("Crescimento", margin + 140, yPos + 1);
  yPos += 6;

  // Competitors Table Rows
  pdf.setFont("helvetica", "normal");
  competitors.slice(0, 5).forEach((comp, index) => {
    yPos += 7;
    
    // Alternating row background
    if (index % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(margin, yPos - 4, contentWidth, 7, "F");
    }
    
    pdf.setTextColor(40, 40, 40);
    pdf.setFontSize(9);
    pdf.text(comp.name.substring(0, 20), margin + 3, yPos);
    pdf.text(comp.revenue, margin + 55, yPos);
    pdf.text(`${comp.marketShare}%`, margin + 95, yPos);
    
    const growthText = `${comp.growth > 0 ? '' : ''}${comp.growth}%`;
    pdf.text(growthText, margin + 140, yPos);
  });
  
  // ==================== PAGE 2 ====================
  pdf.addPage();
  yPos = 25;

  // ==================== SECTION 2: RISK ANALYSIS ====================
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("2. ANÁLISE DE RISCO", margin, yPos);
  yPos += 12;

  // Strengths Header
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Forças Identificadas:", margin, yPos);
  yPos += 8;

  // Strengths List
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  riskAssessment.strengths.forEach((strength) => {
    pdf.setTextColor(34, 197, 94);
    pdf.text("•", margin + 2, yPos);
    pdf.setTextColor(40, 40, 40);
    pdf.text(strength.title, margin + 8, yPos);
    yPos += 6;
  });
  yPos += 8;

  // Risks Header
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("Riscos Detectados:", margin, yPos);
  yPos += 8;

  // Risks List
  pdf.setFontSize(10);
  riskAssessment.risks.forEach((risk) => {
    checkPageBreak(18);
    
    const severityLabel = risk.severity === 'high' ? '[HIGH]' : 
                          risk.severity === 'medium' ? '[MEDIUM]' : '[LOW]';
    const severityColor = risk.severity === 'high' ? [220, 38, 38] : 
                          risk.severity === 'medium' ? [245, 158, 11] : [100, 100, 100];
    
    pdf.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    pdf.setFont("helvetica", "bold");
    pdf.text(`• ${severityLabel}`, margin + 2, yPos);
    
    pdf.setTextColor(40, 40, 40);
    pdf.text(risk.title, margin + 28, yPos);
    yPos += 5;
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const descLines = pdf.splitTextToSize(risk.description, contentWidth - 10);
    pdf.text(descLines, margin + 8, yPos);
    yPos += descLines.length * 4 + 6;
    pdf.setFontSize(10);
  });
  yPos += 10;

  // ==================== SECTION 3: ROADMAP ====================
  checkPageBreak(40);
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("3. PLANO DE AÇÃO (90 DIAS)", margin, yPos);
  yPos += 12;

  [1, 2, 3].forEach((month) => {
    const actions = strategicAdvice.roadmap.filter((a) => a.month === month);
    if (actions.length === 0) return;
    
    checkPageBreak(30);
    
    // Month header
    pdf.setFillColor(99, 102, 241);
    pdf.rect(margin, yPos - 4, 25, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Mês ${month}`, margin + 3, yPos + 1);
    yPos += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    actions.forEach((action) => {
      checkPageBreak(15);
      
      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "bold");
      pdf.text(`• ${action.title}`, margin + 2, yPos);
      yPos += 5;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const descLines = pdf.splitTextToSize(action.description, contentWidth - 10);
      pdf.text(descLines, margin + 8, yPos);
      yPos += descLines.length * 4 + 5;
      pdf.setFontSize(10);
    });
    yPos += 5;
  });

  // ==================== PAGE 3 (if needed) or continue ====================
  checkPageBreak(50);

  // ==================== SECTION 4: RECOMMENDATIONS ====================
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("4. RECOMENDAÇÕES", margin, yPos);
  yPos += 12;

  // Priority Validations Header
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Validações Prioritárias:", margin, yPos);
  yPos += 8;

  // Priority Validations List
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  strategicAdvice.priorityValidations.forEach((validation, index) => {
    checkPageBreak(10);
    pdf.setTextColor(99, 102, 241);
    pdf.text(`${index + 1}.`, margin + 2, yPos);
    pdf.setTextColor(40, 40, 40);
    const validationLines = pdf.splitTextToSize(validation, contentWidth - 15);
    pdf.text(validationLines, margin + 10, yPos);
    yPos += validationLines.length * 5 + 3;
  });
  yPos += 8;

  // Quick Wins Header
  checkPageBreak(30);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("Quick Wins:", margin, yPos);
  yPos += 8;

  // Quick Wins List
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  strategicAdvice.quickWins.forEach((win) => {
    checkPageBreak(10);
    pdf.setTextColor(34, 197, 94);
    pdf.text("•", margin + 2, yPos);
    pdf.setTextColor(40, 40, 40);
    const winLines = pdf.splitTextToSize(win, contentWidth - 12);
    pdf.text(winLines, margin + 8, yPos);
    yPos += winLines.length * 5 + 3;
  });

  // ==================== ADD FOOTERS TO ALL PAGES ====================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(i, totalPages);
  }

  // Save with segment name
  const fileName = `DAAT-ANALYSIS-${result.segment.replace(/\s+/g, "-")}`;
  pdf.save(`${fileName}.pdf`);
}
