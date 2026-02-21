// services/EmailService.js
import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async envoyerCodeReinitialisation(email, code, nomComplet) {
        const mailOptions = {
            from: `"EcoCollect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Réinitialisation de votre mot de passe - EcoCollect',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4CAF50;">EcoCollect</h1>
                        <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="font-size: 16px; color: #333;">Bonjour <strong>${nomComplet || 'cher utilisateur'}</strong>,</p>
                        <p style="font-size: 16px; color: #333;">Vous avez demandé la réinitialisation de votre mot de passe.</p>
                        <p style="font-size: 16px; color: #333;">Voici votre code de validation :</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4CAF50; background-color: #e8f5e9; padding: 20px; border-radius: 10px; display: inline-block;">
                                ${code}
                            </div>
                        </div>
                        
                        <p style="font-size: 14px; color: #666;">Ce code est valable pendant <strong>15 minutes</strong>.</p>
                        <p style="font-size: 14px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
                    </div>
                    
                    <div style="text-align: center; color: #999; font-size: 12px;">
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        <p>&copy; 2024 EcoCollect. Tous droits réservés.</p>
                    </div>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email envoyé:', info.messageId);
            return true;
        } catch (error) {
            console.error('❌ Erreur envoi email:', error);
            return false;
        }
    }

    // Version simplifiée pour le développement (affiche le code dans la console)
    async envoyerCodeDev(email, code, nomComplet) {
        console.log('\n' + '='.repeat(50));
        console.log('📧 SIMULATION D\'ENVOI D\'EMAIL');
        console.log('📧 À:', email);
        console.log('📧 Nom:', nomComplet || 'Utilisateur');
        console.log('📧 Code de réinitialisation:', code);
        console.log('='.repeat(50) + '\n');
        return true;
    }
}

export default new EmailService();