<?php
// contact.php - simple contact form handler
// Validates input, sends email using PHP mail(), and redirects back to /contact with status

// Configuration
// Prefer environment variables for production. Fallbacks provided for local testing.
$toEmail = getenv('TO_EMAIL') ?: 'contact@vizstarbuilders.com'; // recipient
$fromDomain = $_SERVER['SERVER_NAME'] ?? 'localhost';
$fromAddress = getenv('FROM_EMAIL') ?: ('contact@vizstarbuilders.com');
$fromName = getenv('FROM_NAME') ?: 'Vizstar Website';

// Helper
// Logging helper
$log = __DIR__ . '/contact_mail.log';
function log_msg($level, $msg) {
    global $log;
    $line = sprintf("[%s] %s: %s\n", date('c'), strtoupper($level), $msg);
    @file_put_contents($log, $line, FILE_APPEND | LOCK_EX);
}

function redirect($sent = false, $error = false, $note = '') {
    if ($note) log_msg('info', 'redirect: ' . $note);
    $params = [];
    if ($sent) $params['sent'] = '1';
    if ($error) $params['error'] = '1';
    $qs = http_build_query($params);
    $loc = '/contact' . ($qs ? '?' . $qs : '');
    header('Location: ' . $loc);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Only accept POST
    redirect(false, true);
}

// Prepare log path for fallbacks (used by validation logging)
$log = __DIR__ . '/contact_mail.log';

// Collect and sanitize (handle cases where PHP didn't populate $_POST)
$rawPost = $_POST;
if (empty($rawPost)) {
    $raw = file_get_contents('php://input');
    // log raw input for debugging
    if ($raw) log_msg('debug', 'RAW INPUT: ' . $raw);
    $contentType = $_SERVER['CONTENT_TYPE'] ?? ($_SERVER['HTTP_CONTENT_TYPE'] ?? '');
    log_msg('debug', 'Content-Type: ' . $contentType);
    if (stripos($contentType, 'application/json') !== false) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) $rawPost = $decoded;
    } else {
        // try parse form-encoded body
        parse_str($raw, $parsed);
        if (is_array($parsed) && count($parsed)) $rawPost = $parsed;
    }
}

$name = trim($rawPost['name'] ?? '');
$email = trim($rawPost['email'] ?? '');
$phone = trim($rawPost['phone'] ?? '');
$subject = trim($rawPost['subject'] ?? 'New contact form submission');
$message = trim($rawPost['message'] ?? '');
log_msg('info', sprintf('Parsed fields: name=%s email=%s phone=%s subject=%s', $name, $email, $phone, $subject));
// Validate inputs (phone optional)
$errors = [];
if ($name === '') $errors[] = 'Name is required';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
// phone is optional now
if ($message === '') $errors[] = 'Message is required';
if (count($errors)) {
    // log validation failure details to help debugging
    $logEntry = sprintf("VALIDATION FAILED: errors=%s payload=name=%s,email=%s,phone=%s,subject=%s", implode('|', $errors), $name, $email, $phone, $subject);
    log_msg('warn', $logEntry);
    redirect(false, true, 'validation failed');
}

// Build email content
$emailSubject = sprintf('Website Contact: %s', $subject ?: 'Contact Form');
$body = "You have a new contact form submission:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Phone: " . $phone . "\n";
$body .= "Subject: " . $subject . "\n\n";
$body .= "Message:\n" . $message . "\n\n";
$body .= "--\nThis message was sent from: " . ($_SERVER['HTTP_HOST'] ?? 'unknown') . "\n";

// Build a simple, responsive HTML email with inline-friendly CSS
$escapedName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$escapedEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$escapedPhone = htmlspecialchars($phone, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$escapedSubject = htmlspecialchars($subject, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$escapedMessage = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));

$htmlBody = '<!doctype html>' . "\n";
$htmlBody .= '<html lang="en">' . "\n";
$htmlBody .= '<head>' . "\n";
$htmlBody .= '  <meta charset="utf-8" />' . "\n";
$htmlBody .= '  <meta name="viewport" content="width=device-width,initial-scale=1" />' . "\n";
$htmlBody .= '  <title>New contact from website</title>' . "\n";
$htmlBody .= '  <style type="text/css">' . "\n";
$htmlBody .= '    /* Basic responsive, email-friendly CSS */' . "\n";
$htmlBody .= '    body { background:#f4f6f8; margin:0; padding:20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color:#333333; }' . "\n";
$htmlBody .= '    .email-wrapper { max-width:700px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(12,18,26,0.08); }' . "\n";
$htmlBody .= '    .email-header { background:linear-gradient(90deg,#0f1724,#1e293b); color:#fff; padding:18px 24px; }' . "\n";
$htmlBody .= '    .email-header h1 { margin:0; font-size:18px; font-weight:600; }' . "\n";
$htmlBody .= '    .email-body { padding:24px; }' . "\n";
$htmlBody .= '    .meta { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px; }' . "\n";
$htmlBody .= '    .meta .item { background:#f1f5f9; padding:10px 12px; border-radius:6px; font-size:13px; color:#0f1724; }' . "\n";
$htmlBody .= '    .message { white-space:pre-wrap; font-size:15px; line-height:1.5; color:#111827; margin-top:12px; }' . "\n";
$htmlBody .= '    .footer { font-size:12px; color:#6b7280; padding:16px 24px; border-top:1px solid #eef2f7; background:#fbfdff; }' . "\n";
$htmlBody .= '    a.button { display:inline-block; background:#0b74de; color:#fff; padding:10px 14px; border-radius:6px; text-decoration:none; font-weight:600; }' . "\n";
$htmlBody .= '    @media (max-width:520px) { .email-wrapper { margin:0 12px; } .meta { flex-direction:column; } }' . "\n";
$htmlBody .= '  </style>' . "\n";
$htmlBody .= '</head>' . "\n";
$htmlBody .= '<body>' . "\n";
$htmlBody .= '  <div class="email-wrapper">' . "\n";
$htmlBody .= '    <div class="email-header"><h1>New enquiry from your website</h1></div>' . "\n";
$htmlBody .= '    <div class="email-body">' . "\n";
$htmlBody .= '      <div class="meta">' . "\n";
$htmlBody .= '        <div class="item"><strong>Name:</strong> ' . $escapedName . '</div>' . "\n";
$htmlBody .= '        <div class="item"><strong>Email:</strong> ' . $escapedEmail . '</div>' . "\n";
$htmlBody .= '        <div class="item"><strong>Phone:</strong> ' . $escapedPhone . '</div>' . "\n";
$htmlBody .= '        <div class="item"><strong>Subject:</strong> ' . $escapedSubject . '</div>' . "\n";
$htmlBody .= '      </div>' . "\n";
$htmlBody .= '      <div class="message">' . $escapedMessage . '</div>' . "\n";
$htmlBody .= '    </div>' . "\n";
$htmlBody .= '    <div class="footer">This email was sent from: ' . htmlspecialchars($_SERVER['HTTP_HOST'] ?? 'unknown') . '. Replying to this message will send a reply to the visitor.' . "</div>" . "\n";
$htmlBody .= '  </div>' . "\n";
$htmlBody .= '</body>' . "\n";
$htmlBody .= '</html>' . "\n";

$boundary = '==Multipart_Boundary_x' . md5(time()) . 'x';

// Headers for the mail() fallback (multipart/alternative)
$mailHeaders = [];
$mailHeaders[] = 'From: ' . $fromName . ' <' . $fromAddress . '>';
$mailHeaders[] = 'Reply-To: ' . $email;
$mailHeaders[] = 'MIME-Version: 1.0';
$mailHeaders[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

// Build multipart message body (plain text then HTML)
$multipartMessage = "This is a MIME encoded message." . "\r\n\r\n";
$multipartMessage .= '--' . $boundary . "\r\n";
$multipartMessage .= 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
$multipartMessage .= 'Content-Transfer-Encoding: 7bit' . "\r\n\r\n";
$multipartMessage .= $body . "\r\n\r\n";
$multipartMessage .= '--' . $boundary . "\r\n";
$multipartMessage .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
$multipartMessage .= 'Content-Transfer-Encoding: 7bit' . "\r\n\r\n";
$multipartMessage .= $htmlBody . "\r\n\r\n";
$multipartMessage .= '--' . $boundary . '--' . "\r\n";

// Prepare log path for fallbacks
$log = __DIR__ . '/contact_mail.log';

// Try PHPMailer with SMTP if available and configured, otherwise fall back to mail()
$sent = false;
$vendorAutoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($vendorAutoload)) {
    log_msg('info', 'Found vendor/autoload.php, will attempt PHPMailer if SMTP env present');
    require_once $vendorAutoload;
    // Check for SMTP env vars
    $smtpHost = getenv('SMTP_HOST') ?: getenv('MAIL_HOST');
    $smtpUser = getenv('SMTP_USER') ?: getenv('MAIL_USER');
    $smtpPass = getenv('SMTP_PASS') ?: getenv('MAIL_PASS');
    $smtpPort = getenv('SMTP_PORT') ?: getenv('MAIL_PORT') ?: 587;
    $smtpSecure = getenv('SMTP_SECURE') ?: getenv('MAIL_SECURE') ?: 'tls';
    log_msg('debug', sprintf('SMTP env: host=%s user=%s port=%s secure=%s', $smtpHost, $smtpUser, $smtpPort, $smtpSecure));
    if ($smtpHost && $smtpUser && $smtpPass) {
        // Use PHPMailer
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
            $mail->SMTPSecure = $smtpSecure; // 'tls' or 'ssl'
            $mail->Port = (int)$smtpPort;

            // Enable SMTP debug output and capture it to our log for diagnosis
            $mail->SMTPDebug = 2; // verbose
            $mail->Debugoutput = function($str, $level) {
                log_msg('debug', "PHPMailer: ($level) $str");
            };

            // Envelope sender (important for deliverability and bounce handling)
            try { $mail->Sender = $fromAddress; } catch (Exception $e) {}

            $mail->setFrom($fromAddress, $fromName);
            $mail->addAddress($toEmail);
            $mail->addReplyTo($email);
            // Send HTML email with a plain-text alternative
            $mail->isHTML(true);
            $mail->Subject = $emailSubject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $body;
            log_msg('info', 'Attempting PHPMailer send');
            $sent = $mail->send();
            log_msg('info', 'PHPMailer send returned: ' . ($sent ? 'true' : 'false'));
        } catch (Exception $e) {
            // log detailed PHPMailer error
            log_msg('error', 'PHPMailer exception: ' . $e->getMessage());
            $sent = false;
        }
    }
}

// If PHPMailer didn't run or failed, try PHP mail() as a fallback
if (!$sent) {
    try {
        log_msg('info', 'Attempting PHP mail() fallback');
        // Use -f to set envelope sender which many MTAs require for deliverability
    $additionalParams = '-f' . escapeshellarg($fromAddress);
    // Use multipart message (plain text + HTML)
    $sent = mail($toEmail, $emailSubject, $multipartMessage, implode("\r\n", $mailHeaders), $additionalParams);
    log_msg('info', 'mail() returned: ' . ($sent ? 'true' : 'false') . ' (called with params: ' . $additionalParams . ')');
    } catch (Exception $e) {
        log_msg('error', 'mail() exception: ' . $e->getMessage());
        $sent = false;
    }
}

if ($sent) {
    log_msg('info', 'Email send succeeded, redirecting with sent=1');
    redirect(true, false, 'send success');
} else {
    // fallback: log message to file for debugging
    $entry = sprintf("FAILED SEND: to=%s from=%s subject=%s Name=%s Phone=%s Message=%s", $toEmail, $email, $emailSubject, $name, $phone, str_replace("\n", '\\n', $message));
    log_msg('error', $entry);
    redirect(false, true, 'send failed');
}
