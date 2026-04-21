<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnalyticsResource;
use App\Models\Booking;
use App\Models\Office;
use App\Models\Feedback;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        // 1. Gather Data
        $monthYear = now()->format('F Y');
        $now = Carbon::now();
        $start = $now->copy()->startOfMonth();
        $end = $now->copy()->endOfMonth();

        $completed = Booking::where('status', 'completed')
            ->whereMonth('consultation_date', $now->month)
            ->count();

        $cancelled = Booking::where('status', 'cancelled')
            ->whereMonth('consultation_date', $now->month)
            ->count();

        $total = Booking::whereBetween('consultation_date', [$start, $end])->count();

        $distribution = Booking::selectRaw('office_id, COUNT(*) as total')
            ->with('office:id,office_name')
            ->whereMonth('consultation_date', $now->month)
            ->whereYear('consultation_date', $now->year)
            ->groupBy('office_id')
            ->get();

        $officeBreakdown = [];
        $offices = Office::all();

        foreach ($offices as $office) {
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

        // 2. Render HTML
        $html = view('reports.analytics', compact(
            'monthYear', 'total', 'completed', 'cancelled', 'distribution', 'officeBreakdown'
        ))->render();

        // 3. Prepare Directory
        $directory = storage_path('app/reports');
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        } 

        if (!is_writable($directory)) {
            Log::error('Reports directory is not writable: ' . $directory);
            return response()->json(['error' => 'Server configuration error.'], 500);
        }

        $fileName = 'consultation_report_' . now()->format('Y_m') . '.pdf';
        $filePath = $directory . '/' . $fileName;

        // 4. Generate PDF
        try {
            $browsershot = Browsershot::html($html)
                ->format('A4')
                ->margins(10, 10, 10, 10)
                ->showBackground()
                ->setOption('args', [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-extensions',
                    ])
                ->newHeadless();

            // 🟢 FIX: Only enforce paths in Production (Docker)
            // Locally, let Browsershot find Node automatically
            if (app()->environment('production')) {
                $browsershot->setNodeBinary('/usr/bin/node');
                $browsershot->setNpmBinary('/usr/bin/npm');
                $browsershot->setIncludePath('/usr/local/bin:/usr/bin:/bin:/var/www/node_modules');

                $chromeMatches = glob('/var/www/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome');
                if (!empty($chromeMatches)) {
                    $browsershot->setChromePath($chromeMatches[0]);
                } else {
                    Log::error('Chrome binary not found in Puppeteer cache');
                    throw new \Exception('Chrome binary not found.');
                }
            }

            $browsershot->save($filePath);

        } catch (\Exception $e) {
            Log::error('PDF Generation Failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to generate PDF.',
                'details' => $e->getMessage()
            ], 500);
        }

        // 5. Download and Delete
        return response()->download($filePath)->deleteFileAfterSend(true);
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
