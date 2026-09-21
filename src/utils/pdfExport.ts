import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Export invoice element to high-resolution A4 PDF
 */
export async function exportInvoiceToPdf(
  elementId: string = 'invoice-printable-sheet',
  filename: string = 'Invoice.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Invoice element not found:', elementId);
    window.print(); // Fallback to browser print
    return false;
  }

  try {
    // Generate high quality canvas (scale 2.5 for crisp text & borders)
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Center on page or add multiple pages if exceeds A4
    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to export PDF with html2canvas:', error);
    // Graceful fallback to native browser print dialog
    window.print();
    return false;
  }
}
