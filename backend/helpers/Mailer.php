<?php

class Mailer
{
    /**
     * Send email using SMTP via fsockopen (no PHPMailer dependency for shared hosting).
     * For production, consider including PHPMailer via composer or manual include.
     */
    public static function send(string $to, string $subject, string $htmlBody): bool
    {
        // Try PHPMailer if available
        $phpmailerPath = __DIR__ . '/../vendor/phpmailer/PHPMailer.php';
        if (file_exists($phpmailerPath)) {
            return self::sendWithPhpMailer($to, $subject, $htmlBody);
        }

        // Fallback: use PHP mail() with proper headers
        return self::sendWithMail($to, $subject, $htmlBody);
    }

    private static function sendWithPhpMailer(string $to, string $subject, string $htmlBody): bool
    {
        require_once __DIR__ . '/../vendor/phpmailer/PHPMailer.php';
        require_once __DIR__ . '/../vendor/phpmailer/SMTP.php';
        require_once __DIR__ . '/../vendor/phpmailer/Exception.php';

        try {
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USER;
            $mail->Password = SMTP_PASS;
            $mail->SMTPSecure = SMTP_ENCRYPTION;
            $mail->Port = SMTP_PORT;

            $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);

            return $mail->send();
        } catch (\Exception $e) {
            error_log("Mailer error: " . $e->getMessage());
            return false;
        }
    }

    private static function sendWithMail(string $to, string $subject, string $htmlBody): bool
    {
        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . SMTP_FROM_NAME . ' <' . SMTP_FROM_EMAIL . '>',
            'Reply-To: ' . SMTP_FROM_EMAIL,
            'X-Mailer: PHP/' . phpversion(),
        ]);

        return mail($to, $subject, $htmlBody, $headers);
    }

    public static function sendVerification(string $to, string $name, string $token): bool
    {
        $link = FRONTEND_URL . '/verify-email?token=' . urlencode($token);
        $subject = 'Verify Your Email - ' . APP_NAME;

        $html = self::getTemplate(
            'Verify Your Email',
            "Hi $name,",
            'Thank you for registering! Please click the button below to verify your email address.',
            $link,
            'Verify Email',
            'This link will expire in ' . VERIFICATION_TOKEN_EXPIRY . ' hours.'
        );

        return self::send($to, $subject, $html);
    }

    public static function sendPasswordReset(string $to, string $name, string $token): bool
    {
        $link = FRONTEND_URL . '/reset-password?token=' . urlencode($token);
        $subject = 'Password Reset - ' . APP_NAME;

        $html = self::getTemplate(
            'Reset Your Password',
            "Hi $name,",
            'You requested a password reset. Click the button below to set a new password.',
            $link,
            'Reset Password',
            'This link will expire in 1 hour. If you did not request this, please ignore this email.'
        );

        return self::send($to, $subject, $html);
    }

    public static function sendNewsletterVerification(string $to, string $token): bool
    {
        $link = FRONTEND_URL . '/newsletter/verify?token=' . urlencode($token);
        $subject = 'Confirm Newsletter Subscription - ' . APP_NAME;

        $html = self::getTemplate(
            'Confirm Subscription',
            'Hello,',
            'Please confirm your newsletter subscription by clicking the button below.',
            $link,
            'Confirm Subscription',
            'If you did not subscribe, please ignore this email.'
        );

        return self::send($to, $subject, $html);
    }

    private static function getTemplate(
        string $title,
        string $greeting,
        string $body,
        string $actionUrl,
        string $actionText,
        string $footer
    ): string {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
        <body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#111118;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden;">
            <div style="padding:32px 24px;text-align:center;background:linear-gradient(135deg,rgba(0,255,136,0.05),rgba(99,102,241,0.05));">
              <h1 style="color:#00ff88;font-size:24px;margin:0;">$title</h1>
            </div>
            <div style="padding:32px 24px;">
              <p style="color:#e5e7eb;font-size:16px;margin:0 0 8px;">$greeting</p>
              <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px;">$body</p>
              <div style="text-align:center;margin:24px 0;">
                <a href="$actionUrl" style="display:inline-block;padding:12px 32px;background:#00ff88;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">$actionText</a>
              </div>
              <p style="color:#6b7280;font-size:12px;text-align:center;margin:24px 0 0;">$footer</p>
            </div>
            <div style="padding:16px 24px;border-top:1px solid #1e1e2e;text-align:center;">
              <p style="color:#4b5563;font-size:11px;margin:0;">This platform utilizes FMHY services and backend data.</p>
              <p style="color:#374151;font-size:11px;margin:4px 0 0;">&copy; Haxcode Technology Solutions</p>
            </div>
          </div>
        </body>
        </html>
        HTML;
    }
}
