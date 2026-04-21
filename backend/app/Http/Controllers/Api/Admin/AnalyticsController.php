<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnalyticsResource;
use App\Models\Booking;
use App\Models\Feedback;
use App\Models\Office;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

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

        $approved = Booking::where('status', 'approved')
            ->whereBetween('consultation_date', [$start, $end])
            ->count();

        $completed = Booking::where('status', 'completed')
            ->whereBetween('consultation_date', [$start, $end])
            ->count();

        $declined = Booking::where('status', 'declined')
            ->whereBetween('consultation_date', [$start, $end])
            ->count();

        $pending = $total - ($completed + $declined + $approved);
        //Percentages (Ratio-to-Percentage Conversion)

        $percentage = fn($value) => $total > 0 ? round(($value / $total) * 100, 1) : 0;

        return response()->json([
            'success' => true,
            'stats' => new AnalyticsResource([
                'total' => $total,
                'approved' => $approved,
                'completed' => $completed,
                'declined' => $declined,
                'pending' =>  $pending,
                'percentages' => [
                    'approved' => $percentage($approved),
                    'completed' => $percentage($completed),
                    'declined' => $percentage($declined),
                    'pending' => $percentage($pending),
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
        $distribution = Booking::query()
            ->join('offices', 'bookings.office_id', '=', 'offices.id')
            ->selectRaw('offices.office_name as office, COUNT(bookings.id) as count')
            ->groupBy('offices.office_name')
            ->get();

        return response()->json([
            'success' => true,
            'distribution' => $distribution
        ]);
    }

    public function generateReport(Request $request)
    {
        try {
            $now = Carbon::now();
            $start = $now->copy()->startOfMonth();
            $end = $now->copy()->endOfMonth();

            $completed = Booking::where('status', 'completed')
                ->whereMonth('consultation_date', $now->month)->count();
            $cancelled = Booking::where('status', 'cancelled')
                ->whereMonth('consultation_date', $now->month)->count();
            $total = Booking::whereBetween('consultation_date', [$start, $end])->count();
            $distribution = Booking::selectRaw('office_id, COUNT(*) as total')
                ->with('office:id,office_name')
                ->whereMonth('consultation_date', $now->month)
                ->whereYear('consultation_date', $now->year)
                ->groupBy('office_id')->get();

            $officeBreakdown = [];
            foreach (Office::all() as $office) {
                $query = Booking::where('office_id', $office->id)
                    ->whereMonth('consultation_date', $now->month)
                    ->whereYear('consultation_date', $now->year);
                $officeBreakdown[] = [
                    'name' => $office->office_name,
                    'total' => $query->count(),
                    'completed' => (clone $query)->where('status', 'completed')->count(),
                    'cancelled' => (clone $query)->where('status', 'cancelled')->count()
                ];
            }

            $monthYear = $now->format('F Y');

            try {
                $html = view('reports.analytics', compact(
                    'monthYear', 'total', 'completed', 'cancelled', 'distribution', 'officeBreakdown'
                ))->render();
            } catch (\Exception $e) {
                Log::error('View render failed: ' . $e->getMessage());
                return response()->json(['error' => 'View render failed', 'details' => $e->getMessage()], 500);
            }

            $directory = storage_path('app/reports');
            if (!file_exists($directory)) mkdir($directory, 0755, true);

            $jobId = Str::uuid()->toString();
            $filePath = $directory . '/consultation_report_' . $now->format('Y_m') . '_' . $jobId . '.pdf';

            Cache::put("report_status_{$jobId}", 'processing', 300);
            \App\Jobs\GenerateReportJob::dispatch($jobId, $filePath, $html);

            return response()->json(['job_id' => $jobId]);

        } catch (\Exception $e) {
            Log::error('Generate report failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reportStatus(Request $request, string $jobId)
    {
        $status = Cache::get("report_status_{$jobId}");

        if (!$status) {
            return response()->json(['status' => 'not_found'], 404);
        }

        if ($status === 'ready') {
            $fileUrl = Cache::get("report_path_{$jobId}");

            if (!$fileUrl) {
                return response()->json(['status' => 'failed', 'error' => 'URL missing'], 500);
            }

                // Return the download with a clear Content-Type
            return response()->json([
                'status' => 'ready',
                'download_url' => $fileUrl
            ]);
        }

        // Explicitly return JSON for pending/processing
        return response()->json([
            'status' => $status,
        ]);
    }

    public function officeFeedback() {
        $feedbackData = Feedback::with('office')
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->get()
        ->groupBy('office_id')
        ->map(function ($feedbacks) {
            $office = $feedbacks->first()->office;
            return [
                'id' => $office->id,
                'office' => $office->office_name,
                'rating' => $feedbacks->avg('rating') ?? 0,
                'reviews' => $feedbacks->count(),
                // Get the 2 most recent comments
                'feedback' => $feedbacks->sortByDesc('created_at')
                                       ->take(2)
                                       ->pluck('comment')
                                       ->values()
            ];
        })
        ->values();

        return response()->json([
            'success' => true,
            'feedback' => $feedbackData
        ]);
    }
}
