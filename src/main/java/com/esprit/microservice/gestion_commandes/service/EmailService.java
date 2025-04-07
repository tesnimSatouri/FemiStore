package com.esprit.microservice.gestion_commandes.service;

// Import necessary logging classes
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired; // Keep if needed, but constructor injection is used
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException; // Import Spring's MailException
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Create a Logger instance for this class
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Constructor injection is good practice
    @Autowired // Optional if this is the only constructor
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmationEmail(String toEmail, Long orderId, double totalPrice) {
        // Log entry into the method and the parameters received
        log.info("Attempting to send order confirmation email. To: '{}', Order ID: {}, Total Price: {}",
                toEmail, orderId, totalPrice);

        // Validate recipient email (basic check)
        if (toEmail == null || toEmail.trim().isEmpty()) {
            log.warn("Cannot send order confirmation email: Recipient email address is null or empty. Order ID: {}", orderId);
            return; // Stop processing if email is invalid
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Confirmation de votre commande - ID: " + orderId); // Include ID in subject for easier tracking
            message.setText("Bonjour,\n\nVotre commande a été créée avec succès !\n\n"
                    + "Numéro de commande : " + orderId + "\n"
                    + "Montant total : " + String.format("%.2f", totalPrice) + " TND\n\n" // Format price
                    + "Merci de votre confiance !");

            // Ensure 'from' address is set
            if (fromEmail == null || fromEmail.trim().isEmpty()) {
                log.error("Cannot send email: 'spring.mail.username' (from address) is not configured correctly.");
                // Optionally throw an exception or handle this configuration error appropriately
                return;
            }
            message.setFrom(fromEmail);

            log.debug("Sending email message object: {}", message); // Log message details at DEBUG level if needed

            // Attempt to send the email
            mailSender.send(message);

            // Log success if no exception was thrown
            log.info("Successfully sent order confirmation email to '{}' for Order ID: {}", toEmail, orderId);

        } catch (MailException e) {
            // Log specific Spring MailExceptions (authentication, connection issues, etc.)
            log.error("Failed to send order confirmation email to '{}' for Order ID: {}. Error: {}",
                    toEmail, orderId, e.getMessage(), e); // Include the exception for stack trace
            // Depending on your application's needs, you might want to:
            // - Re-throw the exception or a custom exception
            // - Add the failed email task to a retry queue
            // - Notify an admin
        } catch (Exception e) {
            // Catch any other unexpected exceptions during the process
            log.error("An unexpected error occurred while preparing or sending the order confirmation email to '{}' for Order ID: {}. Error: {}",
                    toEmail, orderId, e.getMessage(), e);
        }
    }
}