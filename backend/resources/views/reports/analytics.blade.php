<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Consultation Report - {{ $monthYear }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            font-size: 12px;
            color: #333;
            background: #EEF1F5;
            padding: 30px;
        }

        /* Header */
        .header {
            background: #13244F;
            border-radius: 16px;
            padding: 24px 28px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 { color: #fff; font-size: 22px; font-weight: 800; }
        .header .subtitle { color: #C8D0E3; font-size: 11px; margin-top: 4px; }
        .header .month-badge {
            background: rgba(255,255,255,0.15);
            color: #fff;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
        }

        /* Stats Cards Row */
        .stats-row {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
        }
        .stat-card {
            flex: 1;
            background: #13244F;
            border-radius: 12px;
            padding: 16px 12px;
            text-align: center;
        }
        .stat-card .value { color: #fff; font-size: 26px; font-weight: 800; }
        .stat-card .label { color: #C8D0E3; font-size: 10px; font-weight: 600; margin-top: 4px; line-height: 1.3; }

        /* Section Cards */
        .card {
            background: #fff;
            border-radius: 20px;
            padding: 20px 24px;
            margin-bottom: 24px;
            border: 1px solid #E5E7EB;
        }
        .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
        }
        .section-accent { width: 4px; height: 28px; border-radius: 4px; }
        .section-title { font-size: 15px; font-weight: 800; color: #1F2937; }
        .section-subtitle { font-size: 11px; color: #9CA3AF; font-weight: 600; margin-top: 2px; }

        /* Status Grid */
        .status-grid { display: flex; gap: 10px; margin-top: 12px; }
        .status-card {
            flex: 1;
            border-radius: 14px;
            padding: 14px 12px;
        }
        .status-label { font-size: 12px; font-weight: 700; margin-bottom: 8px; }
        .status-count { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 10px; }
        .status-bar-bg { height: 6px; background: rgba(255,255,255,0.8); border-radius: 4px; }
        .status-bar-fill { height: 6px; border-radius: 4px; }

        /* Multi bar */
        .multi-bar { display: flex; height: 20px; border-radius: 10px; overflow: hidden; margin: 12px 0 16px; }
        .multi-bar-segment { height: 100%; }

        /* Office Distribution */
        .office-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .rank-badge {
            width: 32px; height: 32px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 16px; font-weight: 800;
            flex-shrink: 0;
        }
        .office-info { flex: 1; }
        .office-name { font-size: 12px; font-weight: 700; color: #6B7280; margin-bottom: 6px; }
        .office-bar-bg { height: 10px; background: #F1F2F4; border-radius: 6px; }
        .office-bar-fill { height: 10px; border-radius: 6px; }
        .office-count { font-size: 12px; font-weight: 800; color: #4B5563; flex-shrink: 0; }

        /* Table */
        table { width: 100%; border-collapse: collapse; }
        th {
            background: #F3F4F6; color: #374151;
            font-size: 11px; font-weight: 700;
            padding: 10px 12px; text-align: left;
            border-bottom: 2px solid #E5E7EB;
        }
        td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; font-size: 11px; color: #4B5563; }
        tr:last-child td { border-bottom: none; }
        .badge {
            display: inline-block; padding: 3px 10px;
            border-radius: 20px; font-size: 10px; font-weight: 700;
        }

        /* Pie Chart */
        .chart-row { display: flex; align-items: center; gap: 30px; }
        .legend { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .legend-item { display: flex; align-items: center; gap: 8px; }
        .legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
        .legend-text { font-size: 11px; color: #4B5563; font-weight: 600; }

        /* Footer */
        .footer {
            text-align: center; margin-top: 16px;
            font-size: 10px; color: #9CA3AF;
        }
    </style>
</head>
<body>

@php
    $colors = ['#6366F1','#06B6D4','#10B981','#A855F7','#F59E0B','#EC4899','#8B5CF6'];
    $statusColors = [
        'approved'  => ['bg' => '#EAF8F1', 'text' => '#10B981'],
        'completed' => ['bg' => '#EEF3FF', 'text' => '#3B82F6'],
        'declined'  => ['bg' => '#FDEEEE', 'text' => '#EF4444'],
        'pending'   => ['bg' => '#FFF7ED', 'text' => '#F59E0B'],
        'cancelled' => ['bg' => '#F3F4F6', 'text' => '#6B7280'],
    ];
    $totalConsultations = array_sum(array_column($officeBreakdown, 'total'));
    $maxOfficeCount = max(array_column($officeBreakdown, 'total') ?: [1]);

    // Pie chart
    $radius = 80;
    $circumference = 2 * pi() * $radius;
    $startAngle = 0;

    $approvedPct  = $total > 0 ? round(($approved  / $total) * 100, 1) : 0;
    $completedPct = $total > 0 ? round(($completed / $total) * 100, 1) : 0;
    $declinedPct  = $total > 0 ? round(($declined  / $total) * 100, 1) : 0;
    $maxStatus = max($approved, $completed, $declined, 1);
@endphp

<!-- Header -->
<div class="header">
    <div>
        <h1>Consultation Report</h1>
        <div class="subtitle">Performance Insights &amp; Analytics</div>
    </div>
    <div class="month-badge">{{ $monthYear }}</div>
</div>

<!-- Stats Summary Row -->
<div class="stats-row">
    <div class="stat-card">
        <div class="value">{{ $total }}</div>
        <div class="label">Total Appointments</div>
    </div>
    <div class="stat-card">
        <div class="value">{{ $approved }}</div>
        <div class="label">Approved</div>
    </div>
    <div class="stat-card">
        <div class="value">{{ $approvedPct }}%</div>
        <div class="label">Approved Rate</div>
    </div>
    <div class="stat-card">
        <div class="value">{{ $declined }}</div>
        <div class="label">Declined</div>
    </div>
</div>

<!-- Appointments per Status -->
<div class="card">
    <div class="section-header">
        <div class="section-accent" style="background:#4387FF"></div>
        <div>
            <div class="section-title">Appointments per Status</div>
            <div class="section-subtitle">Total of {{ $total }} appointments</div>
        </div>
    </div>

    <!-- Multi-color bar -->
    <div class="multi-bar">
        @foreach([['count' => $approved, 'color' => '#10B981'], ['count' => $completed, 'color' => '#3B82F6'], ['count' => $declined, 'color' => '#EF4444']] as $seg)
            <div class="multi-bar-segment" style="flex: {{ max($seg['count'], 0.1) }}; background: {{ $seg['color'] }};"></div>
        @endforeach
    </div>

    <div class="status-grid">
        @foreach([
            ['label' => 'Approved',  'count' => $approved,  'color' => '#10B981', 'bg' => '#EAF8F1'],
            ['label' => 'Completed', 'count' => $completed, 'color' => '#3B82F6', 'bg' => '#EEF3FF'],
            ['label' => 'Declined',  'count' => $declined,  'color' => '#EF4444', 'bg' => '#FDEEEE'],
        ] as $s)
        @php $barPct = max(($s['count'] / $maxStatus) * 100, 15); @endphp
        <div class="status-card" style="background: {{ $s['bg'] }}">
            <div class="status-label" style="color: {{ $s['color'] }}">{{ $s['label'] }}</div>
            <div class="status-count">{{ $s['count'] }}</div>
            <div class="status-bar-bg">
                <div class="status-bar-fill" style="width: {{ $barPct }}%; background: {{ $s['color'] }}"></div>
            </div>
        </div>
        @endforeach
    </div>
</div>

<!-- Office Distribution -->
<div class="card">
    <div class="section-header">
        <div class="section-accent" style="background:#E400D9"></div>
        <div>
            <div class="section-title">Offices Commonly Visited</div>
            <div class="section-subtitle">Top consultation categories</div>
        </div>
    </div>

    @foreach($officeBreakdown as $index => $office)
    @php
        $barPct = $maxOfficeCount > 0 ? max(($office['total'] / $maxOfficeCount) * 100, 18) : 18;
        $color = $colors[$index % count($colors)];
    @endphp
    <div class="office-row">
        <div class="rank-badge" style="background: {{ $color }}">{{ $index + 1 }}</div>
        <div class="office-info">
            <div class="office-name">{{ $office['name'] }}</div>
            <div class="office-bar-bg">
                <div class="office-bar-fill" style="width: {{ $barPct }}%; background: {{ $color }}"></div>
            </div>
        </div>
        <div class="office-count">{{ $office['total'] }}</div>
    </div>
    @endforeach
</div>

<!-- Detailed Table + Pie Chart -->
<div class="card">
    <div class="section-header">
        <div class="section-accent" style="background:#F59E0B"></div>
        <div>
            <div class="section-title">Office Breakdown</div>
            <div class="section-subtitle">Detailed per-office statistics</div>
        </div>
    </div>

    <div class="chart-row">
        <!-- Pie Chart -->
        <svg viewBox="0 0 200 200" width="160" height="160">
            @foreach($officeBreakdown as $index => $office)
            @php
                $slicePct    = $totalConsultations > 0 ? ($office['total'] / $totalConsultations) : 0;
                $sliceLength = $slicePct * $circumference;
            @endphp
            <circle cx="100" cy="100" r="{{ $radius }}" fill="transparent"
                stroke="{{ $colors[$index % count($colors)] }}" stroke-width="40"
                stroke-dasharray="{{ $sliceLength }} {{ $circumference - $sliceLength }}"
                stroke-dashoffset="{{ $circumference - $startAngle }}"
                transform="rotate(-90 100 100)"/>
            @php $startAngle += $sliceLength; @endphp
            @endforeach
        </svg>

        <!-- Legend -->
        <div class="legend">
            @foreach($officeBreakdown as $index => $office)
            @php $pct = $totalConsultations > 0 ? round(($office['total'] / $totalConsultations) * 100, 1) : 0; @endphp
            <div class="legend-item">
                <div class="legend-dot" style="background: {{ $colors[$index % count($colors)] }}"></div>
                <div class="legend-text">{{ $office['name'] }} — {{ $pct }}%</div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Table -->
    <table style="margin-top: 20px;">
        <thead>
            <tr>
                <th>Office</th>
                <th>Total</th>
                <th>Completed</th>
                <th>Cancelled</th>
                <th>Share</th>
            </tr>
        </thead>
        <tbody>
            @foreach($officeBreakdown as $office)
            @php $pct = $totalConsultations > 0 ? round(($office['total'] / $totalConsultations) * 100, 1) : 0; @endphp
            <tr>
                <td><strong>{{ $office['name'] }}</strong></td>
                <td>{{ $office['total'] }}</td>
                <td>
                    <span class="badge" style="background:#EEF3FF; color:#3B82F6">
                        {{ $office['completed'] }}
                    </span>
                </td>
                <td>
                    <span class="badge" style="background:#F3F4F6; color:#6B7280">
                        {{ $office['cancelled'] }}
                    </span>
                </td>
                <td>{{ $pct }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="footer">
    Report generated on {{ now()->format('F d, Y \a\t h:i A') }}
</div>

</body>
</html>
