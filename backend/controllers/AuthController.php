<?php

class AuthController
{
    public static function register(array $params): void
    {
        $data = Validator::getBody();
        $data = Validator::sanitizeArray($data, ['name', 'email']);

        $errors = Validator::required($data, ['name', 'email', 'password']);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        if (!Validator::email($data['email'])) {
            Response::error('Invalid email address', 422);
        }

        if (!Validator::minLength($data['password'], 8)) {
            Response::error('Password must be at least 8 characters', 422);
        }

        if (!Validator::maxLength($data['name'], 100)) {
            Response::error('Name is too long', 422);
        }

        // Check if email exists
        if (User::findByEmail($data['email'])) {
            Response::error('Email already registered', 409);
        }

        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        $verificationToken = Validator::generateToken();

        $userId = User::create($data['name'], $data['email'], $passwordHash, $verificationToken);

        // Send verification email
        Mailer::sendVerification($data['email'], $data['name'], $verificationToken);

        Response::success(
            ['user_id' => $userId],
            'Registration successful! Please check your email to verify your account.',
            201
        );
    }

    public static function login(array $params): void
    {
        $data = Validator::getBody();

        $errors = Validator::required($data, ['email', 'password']);
        if (!empty($errors)) {
            Response::error('Email and password are required', 422);
        }

        $user = User::findByEmail($data['email']);
        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            Response::error('Invalid email or password', 401);
        }

        if (!$user['is_verified']) {
            Response::error('Please verify your email before logging in', 403);
        }

        $token = JWT::encode([
            'user_id' => $user['id'],
            'role' => $user['role'],
        ]);

        Response::success([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'created_at' => $user['created_at'],
            ],
        ], 'Login successful');
    }

    public static function verifyEmail(array $params): void
    {
        $token = Validator::getQueryParam('token');
        if (!$token) {
            Response::error('Verification token is required', 400);
        }

        $user = User::findByVerificationToken($token);
        if (!$user) {
            Response::error('Invalid or expired verification link', 400);
        }

        User::verify((int)$user['id']);

        Response::success(null, 'Email verified successfully! You can now log in.');
    }

    public static function forgotPassword(array $params): void
    {
        $data = Validator::getBody();
        $email = $data['email'] ?? '';

        if (!Validator::email($email)) {
            Response::error('Valid email is required', 422);
        }

        $user = User::findByEmail($email);

        // Always return success to prevent email enumeration
        if ($user) {
            $token = Validator::generateToken();
            User::setResetToken((int)$user['id'], $token);
            Mailer::sendPasswordReset($email, $user['name'], $token);
        }

        Response::success(null, 'If an account exists, a reset link has been sent.');
    }

    public static function resetPassword(array $params): void
    {
        $data = Validator::getBody();

        $errors = Validator::required($data, ['token', 'password']);
        if (!empty($errors)) {
            Response::error('Token and new password are required', 422);
        }

        if (!Validator::minLength($data['password'], 8)) {
            Response::error('Password must be at least 8 characters', 422);
        }

        $user = User::findByResetToken($data['token']);
        if (!$user) {
            Response::error('Invalid or expired reset link', 400);
        }

        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        User::resetPassword((int)$user['id'], $passwordHash);

        Response::success(null, 'Password reset successful! You can now log in.');
    }

    public static function me(array $params): void
    {
        $user = Auth::getUser();
        Response::success([
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'created_at' => $user['created_at'],
            ],
        ]);
    }

    public static function updateProfile(array $params): void
    {
        $user = Auth::getUser();
        $data = Validator::getBody();
        $name = Validator::sanitize($data['name'] ?? '');

        if (empty($name)) {
            Response::error('Name is required', 422);
        }

        User::updateName((int)$user['id'], $name);
        Response::success(null, 'Profile updated successfully');
    }
}
