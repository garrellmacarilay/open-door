<?php

namespace App\Services;

use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address; // ✅ Added this import
use Illuminate\Support\Facades\Log;

class GmailService
{
    public function sendEmail($to, $subject, $htmlBody)
    {
        // 1. Setup Google Client
        $client = new Client();

        // Use config() to be safe. Ensure you added these to config/services.php previously.
        // If not, use env() but make sure cache is cleared.
        $clientId = config('services.gmail.client_id') ?? env('GMAIL_CLIENT_ID');
        $clientSecret = config('services.gmail.client_secret') ?? env('GMAIL_CLIENT_SECRET');
        $refreshToken = config('services.gmail.refresh_token') ?? env('GMAIL_REFRESH_TOKEN');

        $client->setClientId($clientId);
        $client->setClientSecret($clientSecret);
        $client->setAccessType('offline');

        // 2. FORCE TOKEN FETCH
        try {
            $client->refreshToken($refreshToken);
            if ($client->isAccessTokenExpired()) {
                $newAccessToken = $client->fetchAccessTokenWithRefreshToken($refreshToken);
                if (isset($newAccessToken['error'])) {
                    Log::error("Gmail API Token Error: " . json_encode($newAccessToken));
                    return false;
                }
                $client->setAccessToken($newAccessToken);
            }
        } catch (\Exception $e) {
            Log::error("Gmail API Auth Failed: " . $e->getMessage());
            return false;
        }

        // 3. Create Email
        $service = new Gmail($client);

        // FIX: Verify your from address is actually an email
        $fromEmail = env('MAIL_FROM_ADDRESS');
        // Validate it's not "Laravel" or null
        if (!$fromEmail || !filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
            $fromEmail = 'vincentleeduriga@student.laverdad.edu.ph'; // Fallback
        }

        $email = (new Email())
            // ✅ CORRECTED: Using 'new Address' prevents the "RFC 2822" error
            ->from(new Address($fromEmail, env('MAIL_FROM_NAME', 'La Verdad App')))
            ->to($to)
            ->subject($subject)
            ->html($htmlBody);

        // 4. Encode & Send
        $rawMessage = $email->toString();
        $base64Message = rtrim(strtr(base64_encode($rawMessage), '+/', '-_'), '=');

        $msg = new Message();
        $msg->setRaw($base64Message);

        try {
            $service->users_messages->send('me', $msg);
            Log::info("Gmail API: Email sent successfully to $to");
            return true;
        } catch (\Exception $e) {
            Log::error("Gmail API Send Error: " . $e->getMessage());
            return false;
        }
    }
}
