package com.terresana.backend.service;

import com.terresana.backend.model.Admin;
import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

/**
 * Service d'envoi d'emails automatiques via Gmail SMTP.
 * Utilisé pour les notifications bénévoles (RG-12, RG-13, RG-20).
 *
 * Toutes les méthodes sont @Async : le vrai aller-retour SMTP peut prendre 1 à 3 secondes,
 * et sans ça chaque action admin (confirmer, refuser...) restait bloquée à attendre l'email
 * avant de répondre — l'admin percevait ça comme une lenteur générale de l'application.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    private static final String FROM = "alainyoundjeu@gmail.com";
    private static final String GREEN = "#2D6A4F";
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH:mm");

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // RG-12 — Email envoyé quand l'admin confirme une inscription
    @Async
    public void sendConfirmation(AppUser user, Event event) {
        String subject = "✅ Inscription confirmée — " + event.getTitle();
        String body = buildHtml(user.getFirstName(),
            "Votre inscription est confirmée !",
            "Bonjour <strong>" + user.getFirstName() + "</strong>,<br><br>" +
            "Votre inscription à l'événement <strong>" + event.getTitle() + "</strong> a été confirmée par l'équipe Terra Sana.<br><br>" +
            "<strong>📅 Date :</strong> " + event.getEventDate().format(FMT) + "<br>" +
            "<strong>📍 Lieu :</strong> " + event.getLocation() + "<br><br>" +
            "Nous avons hâte de vous retrouver !"
        );
        send(user.getEmail(), subject, body);
    }

    // RG-12 — Email envoyé quand l'admin refuse une inscription
    @Async
    public void sendRejection(AppUser user, Event event) {
        String subject = "❌ Inscription non retenue — " + event.getTitle();
        String body = buildHtml(user.getFirstName(),
            "Inscription non retenue",
            "Bonjour <strong>" + user.getFirstName() + "</strong>,<br><br>" +
            "Malheureusement, votre inscription à l'événement <strong>" + event.getTitle() + "</strong> " +
            "du " + event.getEventDate().format(FMT) + " n'a pas pu être retenue.<br><br>" +
            "N'hésitez pas à vous inscrire à d'autres événements Terra Sana. À bientôt !"
        );
        send(user.getEmail(), subject, body);
    }

    // Envoyé aux bénévoles encore inscrits (confirmés ou en attente) quand l'admin annule l'événement
    @Async
    public void sendEventCancelled(AppUser user, Event event) {
        String subject = "⚠️ Événement annulé — " + event.getTitle();
        String body = buildHtml(user.getFirstName(),
            "Événement annulé",
            "Bonjour <strong>" + user.getFirstName() + "</strong>,<br><br>" +
            "L'événement <strong>" + event.getTitle() + "</strong> prévu le " + event.getEventDate().format(FMT) +
            " a été annulé par l'équipe Terra Sana.<br><br>" +
            "Votre inscription est automatiquement annulée, aucune action n'est nécessaire de votre part. " +
            "N'hésitez pas à consulter nos autres événements. À bientôt !"
        );
        send(user.getEmail(), subject, body);
    }

    // RG-13 — Email envoyé quand une place se libère et le bénévole sort de la liste d'attente
    @Async
    public void sendWaitlistPromotion(AppUser user, Event event) {
        String subject = "🎉 Une place s'est libérée — " + event.getTitle();
        String body = buildHtml(user.getFirstName(),
            "Bonne nouvelle : une place est disponible !",
            "Bonjour <strong>" + user.getFirstName() + "</strong>,<br><br>" +
            "Une place vient de se libérer pour l'événement <strong>" + event.getTitle() + "</strong>.<br>" +
            "Votre inscription passe de la liste d'attente à <strong>en attente de confirmation</strong>.<br><br>" +
            "<strong>📅 Date :</strong> " + event.getEventDate().format(FMT) + "<br>" +
            "<strong>📍 Lieu :</strong> " + event.getLocation() + "<br><br>" +
            "L'équipe Terra Sana va confirmer votre participation dans les plus brefs délais."
        );
        send(user.getEmail(), subject, body);
    }

    // RG-20 — Email envoyé quand le bénévole passe à un niveau supérieur
    @Async
    public void sendLevelChange(AppUser user, String newLevel) {
        String emoji = newLevel.equals("OR") ? "🥇" : "🥈";
        String subject = emoji + " Félicitations — Vous passez au niveau " + newLevel + " !";
        String body = buildHtml(user.getFirstName(),
            emoji + " Nouveau niveau atteint : " + newLevel,
            "Bonjour <strong>" + user.getFirstName() + "</strong>,<br><br>" +
            "Grâce à votre engagement, vous passez au niveau <strong>" + newLevel + "</strong> chez Terra Sana !<br><br>" +
            "Merci pour votre dévouement et votre implication. Continuez comme ça !"
        );
        send(user.getEmail(), subject, body);
    }

    // Section 3.3 — Email groupé envoyé par l'admin à un bénévole inscrit à un événement
    @Async
    public void sendGroupMessage(AppUser user, Event event, String message) {
        String subject = "📢 Message concernant " + event.getTitle();
        String body = buildHtml(user.getFirstName(),
            "Message de l'équipe Terra Sana",
            "Bonjour <strong>" + user.getFirstName() + "</strong>,<br><br>" +
            "Concernant l'événement <strong>" + event.getTitle() + "</strong> :<br><br>" +
            message.replace("\n", "<br>")
        );
        send(user.getEmail(), subject, body);
    }

    // RG-04 — Email de réinitialisation de mot de passe, avec lien contenant le jeton valable 30 minutes
    @Async
    public void sendPasswordReset(AppUser user, String token) {
        String subject = "🔑 Réinitialisation de votre mot de passe Terra Sana";
        String resetLink = "http://localhost:3000/volunteer/reset-password?token=" + token;
        String body = buildHtml(user.getFirstName(),
            "Réinitialisation de mot de passe",
            "Bonjour <strong>" + user.getFirstName() + "</strong>,<br><br>" +
            "Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour en choisir un nouveau :<br><br>" +
            "<a href='" + resetLink + "' style='display:inline-block;background:" + GREEN + ";color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold'>Réinitialiser mon mot de passe</a><br><br>" +
            "⚠️ Ce lien n'est valable que <strong>30 minutes</strong>.<br><br>" +
            "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email."
        );
        send(user.getEmail(), subject, body);
    }

    // Admin.forgotPassword() (diagramme de classes) — jeton JWT auto-suffisant, valable 30 minutes
    @Async
    public void sendAdminPasswordReset(Admin admin, String token) {
        String subject = "🔑 Réinitialisation de votre mot de passe administrateur Terra Sana";
        String resetLink = "http://localhost:3000/admin/reset-password?token=" + token;
        String body = buildHtml(admin.getUsername(),
            "Réinitialisation de mot de passe (administrateur)",
            "Bonjour <strong>" + admin.getUsername() + "</strong>,<br><br>" +
            "Vous avez demandé à réinitialiser votre mot de passe administrateur. Cliquez sur le lien ci-dessous pour en choisir un nouveau :<br><br>" +
            "<a href='" + resetLink + "' style='display:inline-block;background:" + GREEN + ";color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold'>Réinitialiser mon mot de passe</a><br><br>" +
            "⚠️ Ce lien n'est valable que <strong>30 minutes</strong>.<br><br>" +
            "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email."
        );
        send(FROM, subject, body);
    }

    // Construction du template HTML commun pour tous les emails
    private String buildHtml(String name, String heading, String content) {
        return "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden'>" +
            "<div style='background:" + GREEN + ";padding:24px;text-align:center'>" +
            "<h2 style='color:#fff;margin:0'>Terra Sana ASBL</h2></div>" +
            "<div style='padding:32px'>" +
            "<h3 style='color:" + GREEN + ";margin-top:0'>" + heading + "</h3>" +
            "<p style='color:#444;line-height:1.7'>" + content + "</p>" +
            "<hr style='border:none;border-top:1px solid #eee;margin:24px 0'>" +
            "<p style='font-size:12px;color:#999'>Terra Sana ASBL — 53/3, 1200 Woluwe-Saint-Lambert<br>" +
            "Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>" +
            "</div></div>";
    }

    // Envoi effectif du mail HTML via JavaMailSender
    private void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, "UTF-8");
            helper.setFrom(FROM);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(msg);
            log.info("Email envoyé avec succès à {} — sujet : {}", to, subject);
        } catch (Exception e) {
            // Log l'erreur complète (stack trace) sans bloquer le flux principal
            log.error("Erreur envoi email à {} : {}", to, e.getMessage(), e);
        }
    }
}
