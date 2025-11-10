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
            'cancelled' => $this['cancelled'],

            'percentages' => [
                'completed' => $this['percentages']['completed'],
                'cancelled' => $this['percentages']['cancelled'],
            ],

            'trends' => $this['trends'] ?? null,
            'service_distribution' => $this['service_distribution'] ?? null
        ];
    }
}
