<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $emailSubject;
    public $emailMessage;

    // 1. Pass the subject and message into the constructor
    public function __construct($subject, $message)
    {
        $this->emailSubject = $subject;
        $this->emailMessage = $message;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->emailSubject, // 2. Use the passed subject
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking_notification', // 3. We will create this view next
            with: [
                'bodyContent' => $this->emailMessage,
            ]
        );
    }
}
