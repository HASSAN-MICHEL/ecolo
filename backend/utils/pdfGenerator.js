// utils/pdfGenerator.js
import PDFDocument from 'pdfkit';

export const generatePDF = (title, content, filename) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      doc.fontSize(20).text(title, { align: 'center' });
      doc.moveDown();
      
      content.forEach(item => {
        if (item.style === 'header') {
          doc.fontSize(14).text(item.text, { underline: true });
        } else if (item.style === 'total') {
          doc.fontSize(16).text(item.text, { align: 'right', bold: true });
        } else {
          doc.fontSize(12).text(item.text, item.margin || {});
        }
      });
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};