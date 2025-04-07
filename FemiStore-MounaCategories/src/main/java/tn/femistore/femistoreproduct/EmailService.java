package tn.femistore.femistoreproduct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    @Value("${notification.recipient.email}")
    private String recipientEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendCategoryAddedNotification(String categoryName, boolean isSubcategory, Long parentId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail.isEmpty() ? "femistore@localhost" : senderEmail);
            message.setTo(recipientEmail);
            message.setSubject("New Category Added in FemiStore");

            String categoryType = isSubcategory ? "Subcategory" : "Main Category";
            String parentInfo = isSubcategory ? " under parent category ID " + parentId : "";
            String body = String.format("A new %s '%s' has been added%s.", categoryType, categoryName, parentInfo);

            message.setText(body);
            mailSender.send(message);
            logger.info("Email notification sent to {} for new {}: {}", recipientEmail, categoryType, categoryName);
        } catch (Exception e) {
            logger.error("Failed to send email notification to {}: {}", recipientEmail, e.getMessage(), e);
        }
    }
}
