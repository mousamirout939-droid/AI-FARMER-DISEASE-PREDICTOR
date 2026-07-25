import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { PassThrough } from 'stream';

/**
 * Generates a PDF disease report as a Buffer, and a QR code (data URL)
 * pointing to a shareable report link.
 */
export const generatePredictionPdf = async (prediction, user, disease) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = new PassThrough();
    const chunks = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
    doc.pipe(stream);

    doc.fontSize(20).fillColor('#16a34a').text('AI Farmer Disease Predictor', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).fillColor('#000').text('Crop Disease Diagnosis Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(11);
    doc.text(`Farmer: ${user?.name || 'N/A'}`);
    doc.text(`Date: ${new Date(prediction.createdAt || Date.now()).toLocaleString()}`);
    doc.text(`Crop: ${prediction.crop}`);
    doc.text(`Predicted Class: ${prediction.predictedClass}`);
    doc.text(`Confidence: ${(prediction.confidence * 100).toFixed(2)}%`);
    doc.text(`Severity Score: ${prediction.severityScore}/100`);
    doc.moveDown();

    if (disease) {
      doc.fontSize(13).fillColor('#16a34a').text('Disease Information');
      doc.fontSize(11).fillColor('#000');
      doc.text(`Name: ${disease.name}`);
      doc.text(`Description: ${disease.description}`);
      if (disease.symptoms?.length) doc.text(`Symptoms: ${disease.symptoms.join(', ')}`);
      if (disease.causes?.length) doc.text(`Causes: ${disease.causes.join(', ')}`);
      if (disease.preventiveMeasures?.length)
        doc.text(`Prevention: ${disease.preventiveMeasures.join(', ')}`);
      if (disease.organicTreatment?.length)
        doc.text(`Organic Treatment: ${disease.organicTreatment.join(', ')}`);
      if (disease.chemicalTreatment?.length)
        doc.text(`Chemical Treatment: ${disease.chemicalTreatment.join(', ')}`);
      doc.text(`Estimated Recovery: ${disease.estimatedRecoveryDays} days`);
    }

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#666').text('Generated automatically by AI Farmer Disease Predictor. This report is AI-assisted and should be verified by an agricultural expert for critical decisions.', {
      align: 'center',
    });

    doc.end();
  });
};

export const generateQrCode = async (text) => QRCode.toDataURL(text);
