<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'student_name' => $this->student?->user?->full_name ?? "Unknown",
            'office_name' => $this->office->office_name ?? "Unknown",
            'service_type' => $this->service_type,
            'consultation_date' => $this->consultation_date,
            'attached_files' => $this->uploaded_file_url ?? null,
            'status' => ucfirst($this->status),
            'color' => $this->resource->getStatusColor($this->status) ?? 'gray',
        ];
    }
}
