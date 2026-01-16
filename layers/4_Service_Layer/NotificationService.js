/**
 * AgriMastery Service Layer: Notification Engine
 * Responsible for External Communications
 */

class NotificationService {
    static sendCertificateEmail(userEmail, courseName) {
        console.log([EXTERNAL SERVICE] Sending PDF Certificate to: );
        console.log([EXTERNAL SERVICE] Subject: Congratulations on mastering !);
        // In a real production environment, this would call SendGrid or AWS SES
    }

    static notifyMarketplaceOfSale(sellerEmail, productName) {
        console.log([EXTERNAL SERVICE] Alerting : Your  has a buyer!);
    }
}
