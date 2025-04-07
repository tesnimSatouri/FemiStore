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

    @Value("${avis.alert.recipient-email}")
    private String recipientEmail;

    @Value("${avis.alert.from-email}")
    private String fromEmail;

    /**Envoie une alerte simple par e-mail concernant la baisse de la note moyenne.*/
    public void sendAverageRatingDropAlert(Long productId, Double oldAverage, double newAverage, double criticalThreshold, double significantDrop) {

        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            log.error("L'email du destinataire de l'alerte ('avis.alert.recipient-email') n'est pas configuré.");
            return;
        }

        String subject = String.format("Alerte : Baisse de la note moyenne pour le produit ID %d", productId);

        StringBuilder messageText = new StringBuilder();
        messageText.append(String.format("La note moyenne pour le produit ID %d a baissé.\n\n", productId));
        messageText.append(String.format("Nouvelle note moyenne : %.2f\n", newAverage));
        if (oldAverage != null) {
            messageText.append(String.format("Ancienne note moyenne : %.2f\n", oldAverage));
            messageText.append(String.format("Baisse : %.2f points\n", oldAverage - newAverage));
        } else {
            messageText.append("C'était le premier avis pour ce produit.\n");
        }

        messageText.append("\nRaisons de cette alerte :\n");
        if (newAverage < criticalThreshold) {
            messageText.append(String.format("- La note moyenne (%.2f) est passée sous le seuil d'alerte critique de %.1f.\n", newAverage, criticalThreshold));
        }
        if (oldAverage != null && (oldAverage - newAverage) >= significantDrop) {
            messageText.append(String.format("- Une baisse significative de %.2f points a été détectée (seuil de baisse : %.1f).\n", (oldAverage - newAverage), significantDrop));
        }

        messageText.append("\nVeuillez examiner les derniers avis pour ce produit.");


        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(recipientEmail);
        message.setSubject(subject);
        message.setText(messageText.toString());

        try {
            mailSender.send(message);
            log.info("Alerte e-mail envoyée avec succès à {} pour le produit {}", recipientEmail, productId);
        } catch (MailException e) {
            log.error("Erreur lors de l'envoi de l'alerte e-mail pour le produit {} à {}", productId, recipientEmail, e);
        }
    }
}