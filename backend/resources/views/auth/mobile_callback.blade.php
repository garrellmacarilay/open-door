<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f5f5f5;
        }
        .container { text-align: center; padding: 24px; }
        .spinner {
            width: 40px; height: 40px;
            border: 4px solid #ddd;
            border-top-color: #4285F4;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        p { color: #555; font-size: 15px; }
        a {
            display: inline-block;
            margin-top: 16px;
            padding: 12px 24px;
            background: #4285F4;
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-size: 15px;
        }
        .error { color: #d32f2f; font-size: 14px; margin-top: 8px; }
    </style>
</head>
<body>
    <div class="container">
        @if(isset($error))
            <p>Login failed. Please close this window and try again.</p>
            <p class="error">{{ $error }}</p>
        @else
            <div class="spinner"></div>
            <p>Redirecting back to app...</p>
            <a href="#" id="manualBtn" style="display:none;">Tap here to open app</a>
        @endif
    </div>

    @if(!isset($error))
    <script>
        const deepLink = "{{ $deepLink }}?token={{ $token }}&role={{ $role }}";

        // Attempt to open the app immediately
        window.location.href = deepLink;

        // Show manual button after 3 seconds as fallback
        setTimeout(() => {
            const btn = document.getElementById('manualBtn');
            const p = document.querySelector('p');
            btn.href = deepLink;
            btn.style.display = 'inline-block';
            p.textContent = "If the app didn't open automatically:";
        }, 3000);
    </script>
    @endif
</body>
</html>
