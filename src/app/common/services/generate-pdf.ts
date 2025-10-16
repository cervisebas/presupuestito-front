import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root',
})
export class GeneratePdfService {
  public fromHTMLElement(element: HTMLElement, filename: `${string}.pdf`) {
    const _html2pdf = html2pdf();

    const options: Parameters<typeof _html2pdf.set>[0] = {
      margin: 10,
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 1,
      },
      html2canvas: {
        scale: 3,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    };

    return _html2pdf.set(options).from(element).toPdf();
  }
}
