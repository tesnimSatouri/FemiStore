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


    public void sendAverageRatingDropAlert(Long productId, Double oldAverage, double newAverage, double criticalThreshold, double significantDrop) {

        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            log.error("L'email du destinataire de l'alerte ('avis.alert.recipient-email') n'est pas configuré.");
            return;
        }

        // --- MODIFICATION : Sujet plus neutre ---
        String subject = String.format("Alerte : Note moyenne produit ID %d - Attention requise", productId);

        StringBuilder messageText = new StringBuilder();
        // --- MODIFICATION : Introduction plus neutre ---
        messageText.append(String.format("Attention : La note moyenne pour le produit ID %d a déclenché une alerte.\n\n", productId));

        messageText.append(String.format("Nouvelle note moyenne : %.2f\n", newAverage));
        if (oldAverage != null) {
            messageText.append(String.format("Ancienne note moyenne : %.2f\n", oldAverage));
            // --- MODIFICATION : Afficher la baisse seulement si elle est réelle et positive ---
            double difference = oldAverage - newAverage;
            if (difference > 0) { // N'afficher que si c'est une vraie baisse
                messageText.append(String.format("Baisse : %.2f points\n", difference));
            } else if (difference < 0) { // Optionnel : Indiquer l'augmentation
                messageText.append(String.format("Augmentation : %.2f points\n", -difference)); // Afficher la valeur positive de l'augmentation
            }
            // Si difference == 0, on n'affiche rien sur la variation.
        } else {
            messageText.append("C'était le premier avis pour ce produit.\n");
        }

        // La section "Raisons" reste la même, elle explique la vraie cause
        messageText.append("\nRaisons de cette alerte :\n");
        if (newAverage < criticalThreshold) {
            messageText.append(String.format("- La note moyenne (%.2f) est passée sous le seuil d'alerte critique de %.1f.\n", newAverage, criticalThreshold));
        }
        // Vérifier la condition de baisse significative ici aussi pour l'affichage
        if (oldAverage != null && (oldAverage - newAverage) >= significantDrop) {
            // --- MODIFICATION : Message de baisse plus précis ---
            messageText.append(String.format("- Une baisse de %.2f points a été détectée .\n", (oldAverage - newAverage)));
        }

        messageText.append("\nVeuillez examiner les derniers avis pour ce produit.");


        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(recipientEmail);
        message.setSubject(subject); // Utilise le nouveau sujet
        message.setText(messageText.toString());

        try {
            mailSender.send(message);
            log.info("Alerte e-mail envoyée avec succès à {} pour le produit {}", recipientEmail, productId);
        } catch (MailException e) {
            log.error("Erreur lors de l'envoi de l'alerte e-mail pour le produit {} à {}", productId, recipientEmail, e);
        }
    }
}