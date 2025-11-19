<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
define('APP_LOADED', true);
$config = include './includes/config.php';

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed"]);
    exit;
}

if (!isset($_POST['name'], $_POST['email'], $_POST['message'], $_POST['phone'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$name    = $_POST['name'];
$email   = $_POST['email'];
$contact = $_POST['phone'];
$city    = $_POST['city'];
$service = $_POST['service'];
$message = $_POST['message'] != "" ? trim($_POST['message']) : "No Message Entered";
$toEmail = 'info@astralaura.co.in';

// $serviceData = explode(':', $service);
// $serviceName = trim($serviceData[0]); 
// $serviceAmount = isset($serviceData[1]) ? trim($serviceData[1]) : 'N/A';

$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'astralaura.co.in'; 
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['EMAIL_USERNAME'];
    $mail->Password   = $config['EMAIL_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $config['EMAIL_PORT'];

    // Set UTF-8 Encoding
    $mail->CharSet = 'UTF-8';

    // Email Content
    $mail->setFrom($email, $name);
    $mail->addAddress($toEmail);
    $mail->Subject = "New Contact Form Submission: " . $name;

    // Create Email Body with Form Data
    $emailBody = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;'>
            <h2 style='color: #333; text-align: center; background: #FF9500; padding: 10px; border-radius: 5px; color: white;'>New Contact Form Submission</h2>
            <p><strong>Name:</strong> <span style='color: #555;'>$name</span></p>
            <p><strong>Email:</strong> <a href='mailto:$email' style='color: #0073e6; text-decoration: none;'>$email</a></p>
            <p><strong>Contact:</strong> <span style='color: #555;'>$contact</span></p>
            <p><strong>City:</strong> <span style='color: #555;'>$city</span></p>
            <p><strong>Service:</strong> <span style='color: #555;'>$service</span></p>
            <div style='padding: 15px; background: white; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);'>
                <p style='margin: 0;'><strong>Message:</strong></p>
                <p style='color: #333;'>$message</p>
            </div>
            <p style='margin-top: 20px; font-size: 12px; color: #777; text-align: center;'>This email was sent from the website contact form</p>
        </div>
    ";

    $mail->isHTML(true);
    $mail->Body = $emailBody;

    if ($mail->send()) {
        echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to send email"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $mail->ErrorInfo]);
}
?>