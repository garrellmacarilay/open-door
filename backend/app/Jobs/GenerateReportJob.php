<?php
namespace App\Jobs;

use App\Models\Booking;
use App\Models\Office;
use Carbon\Carbon;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

    class GenerateReportJob implements ShouldQueue
    {
        use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

        public $timeout = 120;

        public function __construct(
            public string $jobId,
            public string $filePath,
            public string $html
        ) {}

        public function handle(): void
        {
            try {
                $browsershot = Browsershot::html($this->html)
                    ->format('A4')
                    ->margins(10, 10, 10, 10)
                    ->showBackground()
                    ->emulateMedia('print')
                    ->setOption('args', [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-extensions',
                    ])
                    ->newHeadless();

                if (app()->environment('production')) {
                    $browsershot->setNodeBinary('/usr/bin/node');
                    $browsershot->setNpmBinary('/usr/bin/npm');
                    $browsershot->setIncludePath('/usr/local/bin:/usr/bin:/bin:/var/www/node_modules/.bin');
                    $browsershot->setNodeModulesPath('/var/www/node_modules');

                    $chromeMatches = glob('/var/www/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome');
                    if (!empty($chromeMatches)) {
                        $browsershot->setChromePath($chromeMatches[0]);
                    } else {
                        throw new \Exception('Chrome binary not found.');
                    }
                }

                 $browsershot->save($this->filePath);

                // 1. Use the direct SDK UploadApi to bypass Facade conflicts
                // This is the most "bulletproof" way for local Windows testing
                $uploadApi = new \Cloudinary\Api\Upload\UploadApi();

                $uploaded = $uploadApi->upload($this->filePath, [
                    'folder' => 'reports',
                    'resource_type' => 'raw',
                    'access_mode' => 'public',
                    'public_id' => 'report_' . $this->jobId . '.pdf',
                    'raw_convert'   => 'as_is',
                    'context' => 'caption=Consultation Report',
                ]);

                // 2. The SDK returns an array/object. Get the secure_url string.
                $publicUrl = $uploaded['secure_url'];
                if (!Str::endsWith($publicUrl, '.pdf')) {
                    $publicUrl .= '?resource_type=raw';
                }

                Log::info("Cloudinary Upload Success: " . $publicUrl);

                // Store file path so the status endpoint can serve it
                Cache::put("report_path_{$this->jobId}", $publicUrl, 300);
                Cache::put("report_status_{$this->jobId}", 'ready', 300);

                if (file_exists($this->filePath)) {
                    unlink($this->filePath);
                }

            } catch (\Exception $e) {
                Log::error('Report Job Failed: ' . $e->getMessage());
                Cache::put("report_status_{$this->jobId}", 'failed', 300);
            }
        }
    }
