import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';

const _html2pdf = html2pdf();

@Injectable({
  providedIn: 'root',
})
export class PrintDocumentService {
  public fromPDFObject(pdfObject: ReturnType<(typeof _html2pdf)['toPdf']>) {
    pdfObject.get('pdf').then((value) => {
      window.open(value.output('bloburl'), '_blank');
    });
  }
}
