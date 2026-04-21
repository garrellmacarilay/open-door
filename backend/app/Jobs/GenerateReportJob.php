<?php

namespace App\Jobs;

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

    /**
     * The number of seconds the job can run before timing out.
     */
    public $timeout = 120;

    public function __construct(
        public string $jobId,
        public string $filePath,
        public string $html
    ) {}

    public function handle(): void
    {
        try {
            // 1. Configure Browsershot
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
                    '--disable-gpu',
                ])
                ->newHeadless();

            // 2. Production Environment Paths
            // We use the fixed symlink created in the Dockerfile
            if (app()->environment('production')) {
                $browsershot->setNodeBinary('/usr/bin/node')
                    ->setNpmBinary('/usr/bin/npm')
                    ->setChromePath('/usr/bin/google-chrome');
            }

            // 3. Generate the PDF
            $browsershot->save($this->filePath);

            if (!file_exists($this->filePath)) {
                throw new \Exception("File was not created at: " . $this->filePath);
            }

            // 4. Cloudinary Upload
            // Using the UploadApi directly for stability
            $uploadApi = new \Cloudinary\Api\Upload\UploadApi();

            $uploadOptions = [
                'folder'        => 'reports',
                'resource_type' => 'raw',
                'access_mode'   => 'public',
                'public_id'     => 'report_' . $this->jobId, // No .pdf here
                'context'       => 'caption=Consultation Report',
            ];

            // Only add upload_preset if it's actually defined in config
            if ($preset = config('cloudinary.upload_pdf')) {
                $uploadOptions['upload_preset'] = $preset;
            }

            $uploaded = $uploadApi->upload($this->filePath, $uploadOptions);

            // 5. Secure URL Handling
            $publicUrl = $uploaded['secure_url'];

            // Ensure URL ends in .pdf for mobile app file detection
            if (!Str::endsWith(strtolower($publicUrl), '.pdf')) {
                $publicUrl .= '.pdf';
            }

            Log::info("Cloudinary Upload Success: " . $publicUrl);

            // 6. Update Cache Status
            Cache::put("report_path_{$this->jobId}", $publicUrl, 300);
            Cache::put("report_status_{$this->jobId}", 'ready', 300);

            // 7. Cleanup local temp file
            if (file_exists($this->filePath)) {
                unlink($this->filePath);
            }

        } catch (\Exception $e) {
            Log::error('Report Job Failed: ' . $e->getMessage());
            Cache::put("report_status_{$this->jobId}", 'failed', 300);

            // Re-throw so the queue knows it failed
            throw $e;
        }
    }
}
