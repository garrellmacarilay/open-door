<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class AdminEventController extends Controller
{
    public function events() {

        $events = Event::orderBy('event_date', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $events
        ]);
    }

    public function storeEvents(Request $request) {

        $val = $request->validate([
            'event_title' => 'required|string',
            'description' => 'required|string',
            'event_date' => 'required|date',
            'event_time' => 'required|date_format:H:i'
        ]);

        $events = Event::create($val);

        return response()->json([
            'success' => true,
            'message' => 'Event successfully created',
            'data' => $events
        ]);
    }

}
