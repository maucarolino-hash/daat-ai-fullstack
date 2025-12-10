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
    if (yPos + additionalHeight > 270) {
      pdf.addPage();
      yPos = 20;
    }
  };

  // Header
  pdf.setFillColor(30, 30, 40);
  pdf.rect(0, 0, pageWidth, 50, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("LAUDO DE ANÁLISE COMPETITIVA", margin, 25);
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Daat AI Engine • Relatório Automatizado`, margin, 33);
  
  pdf.setFontSize(9);
  pdf.text(`${reportId} | ${formattedDate}`, margin, 42);

  yPos = 60;

  // Subject
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text("OBJETO DE ANÁLISE", margin, yPos);
  yPos += 6;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(result.segment, margin, yPos);
  yPos += 15;

  // Score Section
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text("PARECER FINAL", margin, yPos);
  yPos += 8;

  // Score Box
  const scoreColor = scoreBreakdown.totalScore >= 70 ? [34, 197, 94] : 
                     scoreBreakdown.totalScore >= 50 ? [168, 85, 247] : [239, 68, 68];
  pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.roundedRect(margin, yPos, 25, 25, 3, 3, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(String(scoreBreakdown.totalScore), margin + 7, yPos + 15);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text(scoreBreakdown.classification, margin + 32, yPos + 10);
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Índice de Viabilidade Daat", margin + 32, yPos + 18);
  yPos += 35;

  // Score Breakdown
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(9);
  const breakdown = [
    ["Oportunidade de Mercado", `${scoreBreakdown.marketOpportunity}/30`],
    ["Posição Competitiva", `${scoreBreakdown.competitivePosition}/30`],
    ["Viabilidade de Execução", `${scoreBreakdown.executionViability}/25`],
    ["Ajuste de Risco", `${scoreBreakdown.riskAdjustment}`],
  ];
  
  breakdown.forEach(([label, value]) => {
    pdf.text(label, margin, yPos);
    pdf.text(value, pageWidth - margin - 20, yPos);
    yPos += 6;
  });
  yPos += 10;

  // Market Data Section
  checkPageBreak(60);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text("1. DADOS DE MERCADO", margin, yPos);
  yPos += 10;

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`TAM: ${marketData.tam}`, margin, yPos);
  pdf.text(`Crescimento: ${marketData.growthRate}%`, margin + 70, yPos);
  pdf.text(`Concorrentes: ${competitors.length}`, margin + 120, yPos);
  yPos += 12;

  // Competitors Table
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPos, contentWidth, 7, "F");
  pdf.setTextColor(80, 80, 80);
  pdf.text("Empresa", margin + 2, yPos + 5);
  pdf.text("Receita", margin + 50, yPos + 5);
  pdf.text("Market Share", margin + 90, yPos + 5);
  pdf.text("Crescimento", margin + 130, yPos + 5);
  yPos += 7;

  pdf.setTextColor(40, 40, 40);
  competitors.slice(0, 5).forEach((comp) => {
    checkPageBreak(8);
    pdf.text(comp.name, margin + 2, yPos + 5);
    pdf.text(comp.revenue, margin + 50, yPos + 5);
    pdf.text(`${comp.marketShare}%`, margin + 90, yPos + 5);
    pdf.text(`${comp.growth}%`, margin + 130, yPos + 5);
    yPos += 7;
  });
  yPos += 10;

  // Risks Section
  checkPageBreak(50);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text("2. ANÁLISE DE RISCO", margin, yPos);
  yPos += 10;

  // Strengths
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Forças Identificadas:", margin, yPos);
  yPos += 7;

  pdf.setTextColor(40, 40, 40);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  riskAssessment.strengths.forEach((strength) => {
    checkPageBreak(10);
    pdf.text(`• ${strength.title}`, margin + 3, yPos);
    yPos += 6;
  });
  yPos += 5;

  // Risks
  checkPageBreak(30);
  pdf.setTextColor(239, 68, 68);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Riscos Detectados:", margin, yPos);
  yPos += 7;

  pdf.setTextColor(40, 40, 40);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  riskAssessment.risks.forEach((risk) => {
    checkPageBreak(12);
    pdf.text(`• [${risk.severity.toUpperCase()}] ${risk.title}`, margin + 3, yPos);
    yPos += 5;
    pdf.setTextColor(100, 100, 100);
    const descLines = pdf.splitTextToSize(risk.description, contentWidth - 10);
    pdf.text(descLines, margin + 6, yPos);
    yPos += descLines.length * 4 + 3;
    pdf.setTextColor(40, 40, 40);
  });
  yPos += 10;

  // Roadmap Section
  checkPageBreak(50);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text("3. PLANO DE AÇÃO (90 DIAS)", margin, yPos);
  yPos += 10;

  [1, 2, 3].forEach((month) => {
    const actions = strategicAdvice.roadmap.filter((a) => a.month === month);
    if (actions.length === 0) return;
    
    checkPageBreak(20);
    pdf.setTextColor(168, 85, 247);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Mês ${month}`, margin, yPos);
    yPos += 7;

    pdf.setTextColor(40, 40, 40);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    actions.forEach((action) => {
      checkPageBreak(12);
      pdf.text(`• ${action.title}`, margin + 3, yPos);
      yPos += 5;
      pdf.setTextColor(100, 100, 100);
      const descLines = pdf.splitTextToSize(action.description, contentWidth - 10);
      pdf.text(descLines, margin + 6, yPos);
      yPos += descLines.length * 4 + 3;
      pdf.setTextColor(40, 40, 40);
    });
    yPos += 5;
  });

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text(
      `Página ${i} de ${totalPages} | ${reportId} | Documento confidencial gerado por Daat AI Engine`,
      pageWidth / 2,
      285,
      { align: "center" }
    );
  }

  // Save
  pdf.save(`${reportId}-${result.segment.replace(/\s+/g, "-")}.pdf`);
}
