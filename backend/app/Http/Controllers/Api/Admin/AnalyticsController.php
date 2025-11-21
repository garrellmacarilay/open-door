<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Office;
use App\Models\Booking;
use Illuminate\Http\Request;
use Spatie\Browsershot\Browsershot;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnalyticsResource;

class AnalyticsController extends Controller
{
    public function consultationStats()
    {
        $statsNow = Carbon::now();

        $start = $statsNow->copy()->subMonth()->startOfMonth();
        $end = $statsNow->copy()->subMonth()->endOfMonth();

        //Total Summary
        $total = Booking::whereBetween('consultation_date', [$start, $end])->count();

        //Status Category

        $completed = Booking::where('status', 'completed')
            ->whereBetween('consultation_date', [$start, $end])
            ->count();

        $cancelled = Booking::where('status', 'cancelled')
            ->whereBetween('consultation_date', [$start, $end])
            ->count();

        //Percentages (Ratio-to-Percentage Conversion)

        $percentage = fn($value) => $total > 0 ? round(($value / $total) * 100, 1) : 0;

        return response()->json([
            'success' => true,
            'stats' => new AnalyticsResource([
                'total' => $total,
                'completed' => $completed,
                'cancelled' => $cancelled,
                'percentages' => [
                    'completed' => $percentage($completed),
                    'cancelled' => $percentage($cancelled),
                ],
            ])
        ]);
    }

    public function consultationTrends()
    {
        $statsNow = Carbon::now();

        $start = $statsNow->copy()->subMonth()->startOfMonth();
        $end = $statsNow->copy()->subMonth()->endOfMonth();

        $statuses = ['completed', 'cancelled'];

        foreach ($statuses as $status) {
            $trendData[$status] = Booking::where('status', $status)
                ->whereBetween('consultation_date', [$start, $end])
                ->count();
        }

        return response()->json([
            'success' => true,
            'trends' => [
                'labels' => ['Completed', 'Cancelled'],
                'values' => [$trendData['completed'], $trendData['cancelled']]
            ]
        ]);
    }

    public function serviceDistribution()
    {
        $distribution = Booking::selectRaw('office_id, COUNT(*) as total')
            ->with('office:id,office_name')
            ->groupBy('office_id')
            ->get()
            ->map(function($item) {
                return [
                    'office' => $item->office->office_name ?? 'Unknown',
                    'count' => $item->total
                ];
            });

        return response()->json([
            'success' => true,
            'distribution' => $distribution
        ]);
    }

    public function generateReport()
    {
        $monthYear = now()->subMonth()->format('F Y');

        $completed = Booking::where('status', 'completed')
            ->whereMonth('consultation_date', now()->subMonth()->month)
            ->count();

        $cancelled = Booking::where('status', 'cancelled')
            ->whereMonth('consultation_date', now()
            ->subMonth()->month)
            ->count();

        $total = $completed + $cancelled;

        $distribution = Booking::selectRaw('office_id, COUNT(*) as total')
            ->with('office:id,office_name')
            ->whereMonth('consultation_date',now()->subMonth()->month)
            ->whereYear('consultation_date', now()->subMonth()->year)
            ->groupBy('office_id')
            ->get();

        $officeBreakdown = [];

        $offices = Office::all();

        foreach ($offices as $office) {
            $query = Booking::where('office_id', $office->id)
                ->whereMonth('consultation_date',now()->subMonth()->month)
                ->whereYear('consultation_date', now()->subMonth()->year);

            $officeBreakdown[] = [
                'name' => $office->office_name,
                'total' => $query->count(),
                'completed' => (clone $query)->where('status', 'completed')->count(),
                'cancelled' => (clone $query)->where('status', 'cancelled')->count()
            ];
        }

        $html = view('reports.analytics', compact(
            'monthYear', 'total', 'completed', 'cancelled', 'distribution', 'officeBreakdown'
        ))->render();

        $directory = storage_path('app/reports');
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $fileName = 'consultation_report_' . now()->subMonth()->format('Y_m') . '.pdf';
        $filePath = $directory . '/' . $fileName;

        Browsershot::html($html)
            ->format('A4')
            ->margins(10, 10, 10, 10)
            ->setOption('args', ['--no-sandbox'])
            ->save($filePath);

        return response()->download($filePath);
    }
}
