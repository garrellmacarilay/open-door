<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $emailSubject ?? 'Booking Notification' }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #2d3748; /* Dark Blue/Gray */
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .message-box {
            background-color: #f8fafc;
            border-left: 4px solid #3182ce; /* Blue accent border */
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .footer {
            background-color: #f4f6f9;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
        .btn {
            display: inline-block;
            background-color: #3182ce;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="header">
            <h1>{{ $emailSubject ?? 'New Notification' }}</h1>
        </div>

        <div class="content">
            <p>Hello,</p>

            {{--
                1. e() escapes HTML to prevent XSS attacks.
                2. nl2br() converts the "\n" from your controller into <br> tags.
                3. {!! !!} allows the <br> tags to render as HTML.
            --}}
            <div class="message-box">
                {!! nl2br(e($bodyContent)) !!}
            </div>

            <p>Please log in to your dashboard to view full details.</p>

            {{-- Optional: Link to your app --}}
            <center>
                <a href="{{ url('/') }}" class="btn">Go to Dashboard</a>
            </center>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>

</body>
</html>
