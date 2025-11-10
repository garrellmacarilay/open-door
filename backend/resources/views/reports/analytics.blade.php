<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Consultation Report - {{ $monthYear }}</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #333;
        }
        h1, h2, h3 {
            text-align: center;
            margin-bottom: 10px;
        }
        .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
        }
        .summary div {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        table, th, td {
            border: 1px solid #888;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .page-break {
            page-break-after: always;
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

<!-- ========================= PAGE 1: OVERALL SUMMARY ========================= -->
<h1>Consultation Report</h1>
<h2>{{ $monthYear }}</h2>

<div class="summary">
    <div>
        <p><strong>Total Consultations</strong></p>
        <p>{{ $total }}</p>
    </div>
    <div>
        <p><strong>Completed</strong></p>
        <p>{{ $completed }}</p>
    </div>
    <div>
        <p><strong>Cancelled</strong></p>
        <p>{{ $cancelled }}</p>
    </div>
</div>

<h3>Service Distribution by Office</h3>
<table>
    <thead>
        <tr>
            <th>Office</th>
            <th>Number of Consultations</th>
        </tr>
    </thead>
    <tbody>
        @foreach($distribution as $dist)
        <tr>
            <td>{{ $dist->office->office_name ?? 'Unknown' }}</td>
            <td>{{ $dist->total }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="footer">
    Report generated on {{ now()->format('F d, Y H:i') }}
</div>

<div class="page-break"></div>

<!-- ========================= PAGE 2+ : PER OFFICE BREAKDOWN ========================= -->
@foreach($officeBreakdown as $office)
    <h2>{{ $office['name'] }} Office Summary</h2>

    <div class="summary">
        <div>
            <p><strong>Total</strong></p>
            <p>{{ $office['total'] }}</p>
        </div>
        <div>
            <p><strong>Completed</strong></p>
            <p>{{ $office['completed'] }}</p>
        </div>
        <div>
            <p><strong>Cancelled</strong></p>
            <p>{{ $office['cancelled'] }}</p>
        </div>
    </div>

    <h3>Consultation Breakdown</h3>
    <table>
        <thead>
            <tr>
                <th>Status</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Completed</td><td>{{ $office['completed'] }}</td></tr>
            <tr><td>Cancelled</td><td>{{ $office['cancelled'] }}</td></tr>
        </tbody>
    </table>

    <div class="footer">
        {{ $office['name'] }} — Report Page
    </div>

    @if(!$loop->last)
        <div class="page-break"></div>
    @endif

@endforeach

</body>
</html>
