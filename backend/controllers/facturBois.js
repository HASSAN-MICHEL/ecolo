import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const facture  = async (req, res) => {
  try {
    const venteId = req.params.id;
    
    // Ici, vous devez récupérer la vente depuis votre base de données
    // avec les relations Client et Boisson
    // Ceci est un exemple - adaptez-le à votre ORM/ODM
    const vente = await VenteBoisson.findByPk(venteId, {
      include: [Client, Boisson]
    });

    if (!vente) {
      return res.status(404).send('Vente non trouvée');
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Configurer l'en-tête de la réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture_${vente.id}.pdf`);

    // Pipe le PDF dans la réponse
    doc.pipe(res);

    // Chemin vers le logo - ajustez selon votre structure
    const logoPath = path.join(__dirname, '../public/images/logo.png');
    
    // Ajouter le logo (s'il existe)
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 50 });
    }

    // En-tête de la facture
    doc.fontSize(20).text('FACTURE', { align: 'right' });
    doc.moveDown();
    doc.fontSize(10).text(`N°: ${vente.id}`, { align: 'right' });
    doc.text(`Date: ${new Date(vente.date_vente).toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Informations de l'entreprise
    doc.fontSize(12).text('Nom de l\'entreprise', 50, 50);
    doc.text('Adresse de l\'entreprise', 50, 65);
    doc.text('Téléphone: +225 XX XX XX XX', 50, 80);
    doc.text('Email: contact@entreprise.com', 50, 95);
    doc.moveDown(3);

    // Informations du client
    doc.fontSize(14).text('Client:', { underline: true });
    doc.fontSize(12).text(vente.Client.nom);
    doc.moveDown();

    // Détails de la facture
    doc.fontSize(14).text('Détails de la vente:', { underline: true });
    doc.moveDown();

    // Tableau des articles
    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Description', 50, tableTop);
    doc.text('Quantité', 300, tableTop, { width: 100, align: 'right' });
    doc.text('Prix unitaire', 400, tableTop, { width: 100, align: 'right' });
    doc.text('Total', 500, tableTop, { width: 100, align: 'right' });
    doc.font('Helvetica');

    const itemTop = tableTop + 25;
    doc.text(vente.Boisson.nom, 50, itemTop);
    doc.text(vente.quantite.toString(), 300, itemTop, { width: 100, align: 'right' });
    doc.text(`${vente.Boisson.prix} FCFA`, 400, itemTop, { width: 100, align: 'right' });
    doc.text(`${vente.montant_total} FCFA`, 500, itemTop, { width: 100, align: 'right' });

    // Total
    const totalTop = itemTop + 50;
    doc.font('Helvetica-Bold');
    doc.text('Total:', 400, totalTop, { width: 100, align: 'right' });
    doc.text(`${vente.montant_total} FCFA`, 500, totalTop, { width: 100, align: 'right' });
    doc.font('Helvetica');

    // Conditions de paiement
    doc.moveDown(2);
    doc.fontSize(10).text('Conditions de paiement: Paiement à la commande', { align: 'left' });

    // Pied de page
    doc.moveDown(3);
    doc.fontSize(10).text('Merci pour votre achat !', { align: 'center' });
    doc.text('Pour toute réclamation, veuillez contacter notre service client', { align: 'center' });

    // Finaliser le PDF
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la génération de la facture');
  }
};