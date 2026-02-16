<?php

class NewsletterController
{
    public static function subscribe(array $params): void
    {
        $data = Validator::getBody();
        $email = $data['email'] ?? '';
        $frequency = $data['frequency'] ?? 'weekly';

        if (!Validator::email($email)) {
            Response::error('Valid email address is required', 422);
        }

        if (!in_array($frequency, ['daily', 'weekly', 'trending'])) {
            $frequency = 'weekly';
        }

        $result = Newsletter::subscribe($email, $frequency);

        if (!empty($result['already_subscribed'])) {
            Response::error('This email is already subscribed', 409);
        }

        // Send double opt-in email
        Mailer::sendNewsletterVerification($email, $result['token']);

        Response::success(null, 'Please check your email to confirm your subscription.', 201);
    }

    public static function verify(array $params): void
    {
        $token = $params['token'] ?? '';
        if (empty($token)) {
            Response::error('Token is required', 400);
        }

        $verified = Newsletter::verify($token);
        if (!$verified) {
            Response::error('Invalid or already verified token', 400);
        }

        Response::success(null, 'Subscription confirmed! Welcome aboard.');
    }

    public static function unsubscribe(array $params): void
    {
        $token = $params['token'] ?? '';
        if (empty($token)) {
            Response::error('Token is required', 400);
        }

        $removed = Newsletter::unsubscribe($token);
        if (!$removed) {
            Response::error('Invalid unsubscribe link', 400);
        }

        Response::success(null, 'You have been unsubscribed successfully.');
    }
}
