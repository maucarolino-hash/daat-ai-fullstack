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
  const pageHeight = pdf.internal.pageSize.getHeight(); // Getting page height for breaks
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  const reportId = `DAAT-${result.id ? result.id.slice(0, 8).toUpperCase() : "PREVIEW"}`;
  const formattedDate = result.createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // --- Helpers ---

  const checkPageBreak = (additionalHeight: number) => {
    if (yPos + additionalHeight > pageHeight - margin) {
      pdf.addPage();
      yPos = 20;
    }
  };

  /**
   * Writes text that wraps automatically within contentWidth.
   * Returns the height used by the text block.
   */
  const printWrappedText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0], indent: number = 0) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    pdf.setTextColor(color[0], color[1], color[2]);

    const availableWidth = contentWidth - indent;
    const lines = pdf.splitTextToSize(text, availableWidth);
    const lineHeight = fontSize * 0.3527 * 1.5; // conversion pts to mm * line spacing

    // Check break before printing
    checkPageBreak(lines.length * lineHeight);

    pdf.text(lines, margin + indent, yPos);

    const heightUsed = lines.length * lineHeight;
    yPos += heightUsed + 2; // small padding
    return heightUsed;
  };

  // --- Header ---
  pdf.setFillColor(30, 30, 40);
  pdf.rect(0, 0, pageWidth, 50, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18); // Reduced from 20
  pdf.setFont("helvetica", "bold");
  pdf.text("LAUDO DE ANÁLISE COMPETITIVA", margin, 25);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Daat AI Engine • Relatório Automatizado`, margin, 33);

  pdf.setFontSize(9);
  pdf.text(`${reportId} | ${formattedDate}`, margin, 42);

  yPos = 65;

  // --- Subject (Fixes First Page Overlap) ---
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text("OBJETO DE ANÁLISE", margin, yPos);
  yPos += 6;

  // Adjusted: Smaller (12), Normal Weight (false), Dark Gray ([40,40,50])
  printWrappedText(result.segment, 12, false, [40, 40, 50]);

  yPos += 5; // Extra spacing after title

  // --- Score Section ---
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
  // Center roughly
  const scoreTxt = String(scoreBreakdown.totalScore);
  const xOffset = scoreTxt.length === 3 ? 4 : scoreTxt.length === 1 ? 10 : 7;
  pdf.text(scoreTxt, margin + xOffset, yPos + 15);

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

  // --- Market Data Section ---
  checkPageBreak(50);
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
  competitors.slice(0, 5).forEach((comp, i) => {
    checkPageBreak(8);
    // Zebra striping
    if (i % 2 !== 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPos, contentWidth, 7, "F");
    }
    pdf.text(comp.name, margin + 2, yPos + 5);
    pdf.text(comp.revenue, margin + 50, yPos + 5);
    pdf.text(`${comp.marketShare}%`, margin + 90, yPos + 5);
    pdf.text(`${comp.growth}%`, margin + 130, yPos + 5);
    yPos += 7;
  });
  yPos += 10;

  // --- Risks Section ---
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
  yPos += 8;

  riskAssessment.strengths.forEach((strength) => {
    // Bold bullet, normal text
    checkPageBreak(15);
    const text = `• ${strength.title}`;
    printWrappedText(text, 9, false, [40, 40, 40], 3); // Indent 3
  });
  yPos += 5;

  // Risks
  checkPageBreak(30);
  pdf.setTextColor(239, 68, 68);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Riscos Detectados:", margin, yPos);
  yPos += 8;

  riskAssessment.risks.forEach((risk) => {
    checkPageBreak(25);
    // Title
    const title = `• [${risk.severity.toUpperCase()}] ${risk.title}`;
    printWrappedText(title, 9, false, [40, 40, 40], 3);

    // Description
    const desc = risk.description;
    printWrappedText(desc, 9, false, [100, 100, 100], 6); // More indent
    yPos += 2;
  });
  yPos += 10;

  // --- Roadmap Section ---
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

    checkPageBreak(25);
    pdf.setTextColor(168, 85, 247);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Mês ${month}`, margin, yPos);
    yPos += 8;

    actions.forEach((action) => {
      checkPageBreak(20);
      const title = `• ${action.title}`;
      printWrappedText(title, 9, false, [40, 40, 40], 3);

      const desc = action.description;
      printWrappedText(desc, 9, false, [100, 100, 100], 6);
      yPos += 2;
    });
    yPos += 5;
  });

  // --- Recommendations Section ---
  checkPageBreak(60);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text("4. RECOMENDAÇÕES", margin, yPos);
  yPos += 10;

  // Priority Validations
  pdf.setTextColor(168, 85, 247);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Validações Prioritárias:", margin, yPos);
  yPos += 8;

  strategicAdvice.priorityValidations.forEach((validation, index) => {
    const text = `${index + 1}. ${validation}`;
    printWrappedText(text, 9, false, [40, 40, 40], 3);
  });
  yPos += 10;

  // Quick Wins (Fixes Last Page Overlap)
  checkPageBreak(30);
  pdf.setTextColor(34, 197, 94);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Quick Wins:", margin, yPos);
  yPos += 8;

  strategicAdvice.quickWins.forEach((win) => {
    // Manually ensure NO overlap
    const text = `• ${win}`;
    printWrappedText(text, 9, false, [40, 40, 40], 3);
  });

  yPos += 10;

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text(
      `Página ${i} de ${totalPages} | ${reportId} | Documento confidencial gerado por Daat AI Engine`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save
  const safeName = result.segment.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  pdf.save(`${reportId}-${safeName}.pdf`);
}
