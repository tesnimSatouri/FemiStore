package com.devdreamers.femistore;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTestEmail() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("laseule22@gmail.com"); // Use your email to receive the test email
        message.setSubject("Test Email from Femistore");
        message.setText("This is a test email sent from the Femistore microservice.");
        mailSender.send(message);
    }

    public void sendReplenishmentNotification(int productId, double predictedDemand, int currentStock, int suggestedStock) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("laseule22@gmail.com");
        message.setSubject("Alerte de réapprovisionnement pour le produit " + productId);
        message.setText(String.format(
                "La demande prévue pour le produit %d est de %.2f unités dans les 7 prochains jours.\n" +
                        "Stock actuel : %d unités.\n" +
                        "Stock suggéré pour réapprovisionnement : %d unités.\n" +
                        "Veuillez envisager un réapprovisionnement.",
                productId, predictedDemand, currentStock, suggestedStock
        ));
        System.out.println("Envoi de la notification pour le produit " + productId + " à l'adresse laseule22@gmail.com");
        mailSender.send(message);
        System.out.println("Notification envoyée avec succès pour le produit " + productId);
    }

}