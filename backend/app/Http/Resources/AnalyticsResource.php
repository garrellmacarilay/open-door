<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnalyticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total' => $this['total'],
            'completed' => $this['completed'],
            'declined' => $this['declined'],
            'approved' => $this['approved'],
            'pending' => $this['pending'],

            'percentages' => [
                'completed' => $this['percentages']['completed'],
                'declined' => $this['percentages']['declined'],
                'approved' => $this['percentages']['approved'],
                'pending' => $this['percentages']['pending'],
            ],

            'trends' => $this['trends'] ?? null,
            'service_distribution' => $this['service_distribution'] ?? null
        ];
    }
}
