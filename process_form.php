<?php
// Require the PHPMailer library
// You need to install PHPMailer via Composer first: 
// composer require phpmailer/phpmailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Get form data
$fullName = $_POST['full_name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';
$zipCode = $_POST['zip_code'] ?? '';
$requiredDate = $_POST['required_date'] ?? '';
$description = $_POST['description'] ?? '';

// Validate required fields
if (empty($fullName) || empty($email) || empty($phone) || empty($address) || empty($zipCode) || empty($requiredDate)) {
    // Redirect back with error
    header('Location: en/services/contact/index.html?status=error&message=Please fill all required fields');
    exit;
}

// Configure PHPMailer
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com';        // CHANGE THIS to your SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'info@gksus.com';      // CHANGE THIS to your email
    $mail->Password = 'your-password';       // CHANGE THIS to your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Recipients
    $mail->setFrom('info@gksus.com', 'Contact Form');
    $mail->addAddress('info@gksus.com', 'German Kitchen Studio');
    $mail->addReplyTo($email, $fullName);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';
    
    // Build email body
    $emailBody = "
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> $fullName</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Address:</strong> $address</p>
    <p><strong>Zip Code:</strong> $zipCode</p>
    <p><strong>Required Date:</strong> $requiredDate</p>
    <p><strong>Description:</strong><br>$description</p>
    ";
    
    $mail->Body = $emailBody;
    $mail->AltBody = strip_tags($emailBody);

    $mail->send();
    
    // Redirect with success message
    header('Location: en/services/contact/index.html?status=success&message=Thank you for your message! We will contact you soon.');
} catch (Exception $e) {
    // Log the error
    error_log("Mail error: {$mail->ErrorInfo}");
    
    // Redirect with error message
    header('Location: en/services/contact/index.html?status=error&message=Sorry, there was an error sending your message. Please try again later.');
}
?> 