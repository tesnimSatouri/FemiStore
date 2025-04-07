// Fichier: src/main/java/com/esprit/twin/gestion_avis/service/mail/EmailService.java
package com.esprit.twin.gestion_avis.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    // Réinjecte l'email destinataire par défaut depuis les propriétés
    @Value("${avis.alert.recipient-email}")
    private String recipientEmail; // Cet email sera utilisé comme destinataire

    @Value("${avis.alert.from-email}")
    private String fromEmail;

    /**
     * Envoie une alerte simple par e-mail concernant la baisse de la note moyenne.
     * Le destinataire est défini par la propriété 'avis.alert.recipient-email'.
     *
     * @param productId   L'ID du produit concerné.
     * @param oldAverage  L'ancienne note moyenne (peut être null si c'était le premier avis).
     * @param newAverage  La nouvelle note moyenne.
     * @param criticalThreshold Le seuil critique configuré.
     * @param significantDrop La baisse significative configurée.
     */
    // Signature originale, sans le paramètre 'recipient'
    public void sendAverageRatingDropAlert(Long productId, Double oldAverage, double newAverage, double criticalThreshold, double significantDrop) {

        // Vérification que l'email destinataire configuré n'est pas vide
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            log.error("L'email du destinataire de l'alerte ('avis.alert.recipient-email') n'est pas configuré.");
            return; // Ne rien faire si non configuré
        }


        String subject = String.format("Alerte : Baisse de la note moyenne pour le produit ID %d", productId);

        // ... (le reste de la construction du message est identique) ...
        StringBuilder messageText = new StringBuilder();
        messageText.append(String.format("La note moyenne pour le produit ID %d a baissé.\n\n", productId));
        messageText.append(String.format("Nouvelle note moyenne : %.2f\n", newAverage));
        if (oldAverage != null) {
            messageText.append(String.format("Ancienne note moyenne : %.2f\n", oldAverage));
            messageText.append(String.format("Baisse : %.2f points\n", oldAverage - newAverage));
        } else {
            messageText.append("C'était le premier avis pour ce produit.\n");
        }
        messageText.append("\nConditions d'alerte déclenchées :\n");
        if (newAverage < criticalThreshold) {
            messageText.append(String.format("- La nouvelle moyenne (%.2f) est inférieure au seuil critique (%.1f).\n", newAverage, criticalThreshold));
        }
        if (oldAverage != null && (oldAverage - newAverage) >= significantDrop) {
            messageText.append(String.format("- La baisse (%.2f) est supérieure ou égale à la baisse significative configurée (%.1f).\n", (oldAverage - newAverage), significantDrop));
        }
        messageText.append("\nVeuillez examiner les derniers avis pour ce produit.");


        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        // Utilise l'email destinataire injecté depuis les propriétés
        message.setTo(recipientEmail);
        message.setSubject(subject);
        message.setText(messageText.toString());

        try {
            mailSender.send(message);
            // Log l'email destinataire utilisé (celui des propriétés)
            log.info("Alerte e-mail envoyée avec succès à {} pour le produit {}", recipientEmail, productId);
        } catch (MailException e) {
            // Log l'email destinataire pour lequel l'envoi a échoué
            log.error("Erreur lors de l'envoi de l'alerte e-mail pour le produit {} à {}", productId, recipientEmail, e);
        }
    }
}