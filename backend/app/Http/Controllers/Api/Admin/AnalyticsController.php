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

        $start = $statsNow->copy()->startOfMonth();
        $end = $statsNow->copy()->endOfMonth();

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
                'pending' =>  $total - ($completed + $cancelled),
                'percentages' => [
                    'completed' => $percentage($completed),
                    'cancelled' => $percentage($cancelled),
                    'total' => $percentage($total)
                ],
            ])
        ]);
    }

    public function consultationTrends()
    {
        $now = Carbon::now();

        $months = collect();

        for ($i = 11; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $months->push([
                'month' => $month->format('F'),
                'start' => $month->startOfMonth()->toDateTimeString(),
                'end' => $month->endOfMonth()->toDateTimeString(),
            ]);
        }

        $trendData = $months->map(function($m) {
            $count = Booking::whereBetween('consultation_date', [$m['start'], $m['end']])->count();

            return [
                'month' => $m['month'],
                'total' => $count
            ];
        });

        return response()->json([
            'success' => true,
            'trends' => [
                'labels' => $trendData->pluck('month'),
                'values' => $trendData->pluck('total')
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
        $monthYear = now()->format('F Y');

        $now = Carbon::now();

        $start = $now->copy()->startOfMonth();
        $end = $now->copy()->endOfMonth();

        $completed = Booking::where('status', 'completed')
            ->whereMonth('consultation_date', now()->month)
            ->count();

        $cancelled = Booking::where('status', 'cancelled')
            ->whereMonth('consultation_date', now()
            ->month)
            ->count();

        $total = Booking::whereBetween('consultation_date', [$start, $end])->count();

        $distribution = Booking::selectRaw('office_id, COUNT(*) as total')
            ->with('office:id,office_name')
            ->whereMonth('consultation_date',now()->month)
            ->whereYear('consultation_date', now()->year)
            ->groupBy('office_id')
            ->get();

        $officeBreakdown = [];

        $offices = Office::all();

        foreach ($offices as $office) {
            $query = Booking::where('office_id', $office->id)
                ->whereMonth('consultation_date',now()->month)
                ->whereYear('consultation_date', now()->year);

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

        $fileName = 'consultation_report_' . now()->format('Y_m') . '.pdf';
        $filePath = $directory . '/' . $fileName;

        Browsershot::html($html)
            ->format('A4')
            ->margins(10, 10, 10, 10)
            ->setOption('args', ['--no-sandbox'])
            ->save($filePath);

        return response()->download($filePath);
    }
}
