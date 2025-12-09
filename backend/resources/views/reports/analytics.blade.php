<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Consultation Report - {{ now()->format('F Y') }}</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        h1, h2 {
            text-align: center;
            margin-bottom: 10px;
        }
        .chart-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 50px;
            margin-top: 30px;
        }
        .pie-chart {
            position: relative;
            width: 300px;
            height: 300px;
        }
        .legend {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .legend div {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .legend-color {
            width: 15px;
            height: 15px;
            border-radius: 3px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 10px;
            color: #555;
        }
    </style>
</head>
<body>

<h1>Consultation Report</h1>
<h2>{{ now()->format('F Y') }}</h2>

@php
    $totalConsultations = array_sum(array_column($officeBreakdown, 'total'));
    $colors = ['#E3F2FD','#BBDEFB','#90CAF9','#64B5F6','#42A5F5','#2196F3','#1E88E5','#1976D2','#1565C0','#0D47A1','#0A3A8A'];
    $radius = 100;
    $circumference = 2 * pi() * $radius;
    $startAngle = 0;
@endphp

<div class="chart-container">
    <!-- Pie Chart -->
    <div class="pie-chart">
        <svg viewBox="0 0 250 250" width="250" height="250">
            @foreach($officeBreakdown as $index => $office)
                @php
                    $slicePercent = $totalConsultations > 0 ? ($office['total'] / $totalConsultations) * 100 : 0;
                    $sliceLength = ($slicePercent / 100) * $circumference;
                    $dashOffset = $circumference - $sliceLength;
                @endphp
                <circle cx="125" cy="125" r="{{ $radius }}" fill="transparent"
                    stroke="{{ $colors[$index % count($colors)] }}" stroke-width="50"
                    stroke-dasharray="{{ $sliceLength }} {{ $circumference - $sliceLength }}"
                    stroke-dashoffset="{{ $circumference - $startAngle }}"
                    transform="rotate(-90 125 125)"/>
                @php
                    $startAngle += $sliceLength;
                @endphp
            @endforeach
        </svg>
    </div>

    <!-- Legend -->
    <div class="legend">
        @foreach($officeBreakdown as $index => $office)
            @php
                $slicePercent = $totalConsultations > 0 ? ($office['total'] / $totalConsultations) * 100 : 0;
            @endphp
            <div>
                <div class="legend-color" style="background-color: {{ $colors[$index % count($colors)] }}"></div>
                <span>{{ $office['name'] }} — {{ round($slicePercent,1) }}%</span>
            </div>
        @endforeach
    </div>
</div>

<div class="footer">
    Report generated on {{ now()->format('F d, Y') }}
</div>

</body>
</html>
