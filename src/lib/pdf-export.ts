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

  // Color Palette
  const colors = {
    primary: [99, 102, 241],      // Indigo
    success: [34, 197, 94],       // Green
    danger: [239, 68, 68],        // Red
    warning: [245, 158, 11],      // Amber
    purple: [139, 92, 246],       // Purple
    dark: [30, 30, 40],           // Dark background
    text: [40, 40, 40],           // Main text
    muted: [100, 100, 100],       // Muted text
    light: [248, 250, 252],       // Light background
    border: [226, 232, 240],      // Border color
  };

  // Helper function to add new page if needed
  const checkPageBreak = (additionalHeight: number) => {
    if (yPos + additionalHeight > pageHeight - 25) {
      pdf.addPage();
      yPos = 25;
    }
  };

  // Helper to draw a colored badge
  const drawBadge = (text: string, x: number, y: number, color: number[], textColor: number[] = [255, 255, 255]) => {
    const textWidth = pdf.getTextWidth(text) + 6;
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.roundedRect(x, y - 4, textWidth, 6, 1.5, 1.5, "F");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.text(text, x + 3, y);
  };

  // Helper to draw section header with accent line
  const drawSectionHeader = (number: string, title: string) => {
    checkPageBreak(20);
    yPos += 8;
    
    // Accent line
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.rect(margin, yPos, 3, 8, "F");
    
    // Section number and title
    pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${number}. ${title}`, margin + 6, yPos + 6);
    
    yPos += 15;
  };

  // ==================== HEADER ====================
  // Gradient-like header background
  pdf.setFillColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  pdf.rect(0, 0, pageWidth, 55, "F");
  
  // Accent line at bottom of header
  pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.rect(0, 55, pageWidth, 2, "F");
  
  // Logo text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("DAAT", margin, 28);
  
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.text("IA", margin + 32, 28);
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.text("Laudo de Análise Competitiva", margin, 38);
  
  // Metadata badges
  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.text(reportId, margin, 48);
  pdf.text("•", margin + 28, 48);
  pdf.text(formattedDate, margin + 32, 48);
  
  // Confidential badge
  pdf.setFillColor(colors.danger[0], colors.danger[1], colors.danger[2]);
  pdf.roundedRect(pageWidth - margin - 30, 42, 30, 8, 2, 2, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.text("CONFIDENCIAL", pageWidth - margin - 27, 47);

  yPos = 70;

  // ==================== SUBJECT BOX ====================
  pdf.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "F");
  pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "S");
  
  pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("OBJETO DE ANÁLISE", margin + 5, yPos + 7);
  
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(result.segment, margin + 5, yPos + 15);
  
  yPos += 30;

  // ==================== SCORE SECTION ====================
  const scoreColor = scoreBreakdown.totalScore >= 70 ? colors.success : 
                     scoreBreakdown.totalScore >= 50 ? colors.purple : colors.danger;

  // Score card background
  pdf.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, "F");
  pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, "S");
  
  // Score circle
  pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.circle(margin + 20, yPos + 22, 15, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  const scoreText = String(scoreBreakdown.totalScore);
  const scoreWidth = pdf.getTextWidth(scoreText);
  pdf.text(scoreText, margin + 20 - scoreWidth / 2, yPos + 27);
  
  // Classification and label
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(scoreBreakdown.classification, margin + 45, yPos + 18);
  
  pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Índice de Viabilidade Daat", margin + 45, yPos + 26);
  
  // Score breakdown on the right
  const breakdownX = margin + 110;
  pdf.setFontSize(8);
  const breakdown = [
    { label: "Oportunidade de Mercado", value: `${scoreBreakdown.marketOpportunity}/30`, color: colors.primary },
    { label: "Posição Competitiva", value: `${scoreBreakdown.competitivePosition}/30`, color: colors.purple },
    { label: "Viabilidade de Execução", value: `${scoreBreakdown.executionViability}/25`, color: colors.success },
    { label: "Ajuste de Risco", value: `${scoreBreakdown.riskAdjustment}`, color: colors.danger },
  ];
  
  let breakdownY = yPos + 10;
  breakdown.forEach(({ label, value, color }) => {
    pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    pdf.text(label, breakdownX, breakdownY);
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.setFont("helvetica", "bold");
    pdf.text(value, breakdownX + 55, breakdownY);
    pdf.setFont("helvetica", "normal");
    breakdownY += 7;
  });
  
  yPos += 55;

  // ==================== MARKET DATA SECTION ====================
  drawSectionHeader("1", "DADOS DE MERCADO");
  
  // Market metrics cards
  const cardWidth = (contentWidth - 10) / 3;
  const metrics = [
    { label: "TAM", value: marketData.tam, color: colors.primary },
    { label: "Crescimento Anual", value: `${marketData.growthRate}%`, color: colors.success },
    { label: "Concorrentes", value: String(competitors.length), color: colors.purple },
  ];
  
  metrics.forEach((metric, i) => {
    const cardX = margin + i * (cardWidth + 5);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(cardX, yPos, cardWidth, 22, 2, 2, "F");
    pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    pdf.roundedRect(cardX, yPos, cardWidth, 22, 2, 2, "S");
    
    // Accent top border
    pdf.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
    pdf.rect(cardX, yPos, cardWidth, 2, "F");
    
    pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    pdf.setFontSize(7);
    pdf.text(metric.label, cardX + 4, yPos + 8);
    
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(metric.value, cardX + 4, yPos + 17);
    pdf.setFont("helvetica", "normal");
  });
  
  yPos += 32;

  // Competitors Table
  checkPageBreak(50);
  
  // Table header
  pdf.setFillColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  pdf.roundedRect(margin, yPos, contentWidth, 9, 2, 2, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text("Empresa", margin + 4, yPos + 6);
  pdf.text("Receita", margin + 55, yPos + 6);
  pdf.text("Market Share", margin + 95, yPos + 6);
  pdf.text("Crescimento", margin + 140, yPos + 6);
  yPos += 9;

  // Table rows
  pdf.setFont("helvetica", "normal");
  competitors.slice(0, 5).forEach((comp, index) => {
    checkPageBreak(10);
    
    // Alternating row background
    if (index % 2 === 0) {
      pdf.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
      pdf.rect(margin, yPos, contentWidth, 9, "F");
    }
    
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.setFontSize(8);
    pdf.text(comp.name.substring(0, 20), margin + 4, yPos + 6);
    pdf.text(comp.revenue, margin + 55, yPos + 6);
    
    // Market share with color indicator
    const shareColor = comp.marketShare > 20 ? colors.success : 
                       comp.marketShare > 10 ? colors.warning : colors.muted;
    pdf.setTextColor(shareColor[0], shareColor[1], shareColor[2]);
    pdf.text(`${comp.marketShare}%`, margin + 95, yPos + 6);
    
    // Growth with color indicator
    const growthColor = comp.growth > 0 ? colors.success : colors.danger;
    pdf.setTextColor(growthColor[0], growthColor[1], growthColor[2]);
    pdf.text(`${comp.growth > 0 ? '+' : ''}${comp.growth}%`, margin + 140, yPos + 6);
    
    yPos += 9;
  });
  
  yPos += 10;

  // ==================== RISK ANALYSIS SECTION ====================
  drawSectionHeader("2", "ANÁLISE DE RISCO");

  // Strengths
  pdf.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
  pdf.roundedRect(margin, yPos, 3, 6, 1, 1, "F");
  pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Forças Identificadas", margin + 6, yPos + 5);
  yPos += 12;

  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  riskAssessment.strengths.forEach((strength) => {
    checkPageBreak(12);
    pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
    pdf.text("✓", margin + 2, yPos);
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.text(strength.title, margin + 8, yPos);
    yPos += 7;
  });
  yPos += 8;

  // Risks
  checkPageBreak(40);
  pdf.setFillColor(colors.danger[0], colors.danger[1], colors.danger[2]);
  pdf.roundedRect(margin, yPos, 3, 6, 1, 1, "F");
  pdf.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Riscos Detectados", margin + 6, yPos + 5);
  yPos += 12;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  riskAssessment.risks.forEach((risk) => {
    checkPageBreak(18);
    
    // Severity badge
    const severityColor = risk.severity === 'high' ? colors.danger : 
                          risk.severity === 'medium' ? colors.warning : colors.muted;
    const severityText = risk.severity === 'high' ? 'ALTO' : 
                         risk.severity === 'medium' ? 'MÉDIO' : 'BAIXO';
    
    drawBadge(severityText, margin, yPos, severityColor);
    
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(risk.title, margin + 20, yPos);
    yPos += 6;
    
    pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    const descLines = pdf.splitTextToSize(risk.description, contentWidth - 8);
    pdf.text(descLines, margin + 4, yPos);
    yPos += descLines.length * 4 + 6;
  });
  yPos += 5;

  // ==================== ROADMAP SECTION ====================
  drawSectionHeader("3", "PLANO DE AÇÃO (90 DIAS)");

  const monthColors = [colors.primary, colors.purple, colors.success];
  
  [1, 2, 3].forEach((month, monthIndex) => {
    const actions = strategicAdvice.roadmap.filter((a) => a.month === month);
    if (actions.length === 0) return;
    
    checkPageBreak(30);
    
    // Month header with colored background
    pdf.setFillColor(monthColors[monthIndex][0], monthColors[monthIndex][1], monthColors[monthIndex][2]);
    pdf.roundedRect(margin, yPos, 25, 7, 2, 2, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text(`MÊS ${month}`, margin + 4, yPos + 5);
    yPos += 12;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    actions.forEach((action) => {
      checkPageBreak(15);
      
      // Bullet point
      pdf.setFillColor(monthColors[monthIndex][0], monthColors[monthIndex][1], monthColors[monthIndex][2]);
      pdf.circle(margin + 3, yPos - 1, 1.5, "F");
      
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      pdf.setFont("helvetica", "bold");
      pdf.text(action.title, margin + 8, yPos);
      yPos += 5;
      
      pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      const descLines = pdf.splitTextToSize(action.description, contentWidth - 12);
      pdf.text(descLines, margin + 8, yPos);
      yPos += descLines.length * 4 + 5;
    });
    yPos += 5;
  });

  // ==================== RECOMMENDATIONS SECTION ====================
  drawSectionHeader("4", "RECOMENDAÇÕES");

  // Priority Validations
  pdf.setFillColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  pdf.roundedRect(margin, yPos, 3, 6, 1, 1, "F");
  pdf.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Validações Prioritárias", margin + 6, yPos + 5);
  yPos += 12;

  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  strategicAdvice.priorityValidations.forEach((validation, index) => {
    checkPageBreak(10);
    
    // Numbered circle
    pdf.setFillColor(colors.purple[0], colors.purple[1], colors.purple[2]);
    pdf.circle(margin + 4, yPos - 1, 3, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.text(String(index + 1), margin + 3, yPos + 1);
    
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const validationLines = pdf.splitTextToSize(validation, contentWidth - 15);
    pdf.text(validationLines, margin + 12, yPos);
    yPos += validationLines.length * 5 + 3;
  });
  yPos += 8;

  // Quick Wins
  checkPageBreak(40);
  pdf.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
  pdf.roundedRect(margin, yPos, 3, 6, 1, 1, "F");
  pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Quick Wins", margin + 6, yPos + 5);
  yPos += 12;

  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  strategicAdvice.quickWins.forEach((win) => {
    checkPageBreak(10);
    pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
    pdf.text("★", margin + 2, yPos);
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    const winLines = pdf.splitTextToSize(win, contentWidth - 12);
    pdf.text(winLines, margin + 10, yPos);
    yPos += winLines.length * 5 + 3;
  });

  // ==================== FOOTER ====================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `${reportId} • Documento confidencial gerado por Daat AI Engine`,
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
