import { jsPDF } from "jspdf";

const PDF_MARGIN_MM = 10;

export async function downloadChecklistPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2canvas = (await import("html2canvas-pro")).default;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PDF_MARGIN_MM * 2;
  const contentHeight = pageHeight - PDF_MARGIN_MM * 2;
  const imageHeight = (canvas.height * contentWidth) / canvas.width;

  let heightLeft = imageHeight;
  let position = PDF_MARGIN_MM;

  pdf.addImage(
    canvas.toDataURL("image/jpeg", 0.96),
    "JPEG",
    PDF_MARGIN_MM,
    position,
    contentWidth,
    imageHeight,
    undefined,
    "FAST"
  );

  heightLeft -= contentHeight;

  while (heightLeft > 0) {
    position = heightLeft - imageHeight + PDF_MARGIN_MM;
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.96),
      "JPEG",
      PDF_MARGIN_MM,
      position,
      contentWidth,
      imageHeight,
      undefined,
      "FAST"
    );
    heightLeft -= contentHeight;
  }

  pdf.save(filename);
}
