<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminEventController extends Controller
{
    public function events(Request $request) {

        $now = now();

        $events = Event::orderBy('event_date', 'asc')->get();

        if ($request->filled('month') && $request->filled('year')) {
            $events = $events->filter(function ($event) use ($request) {
                return \Carbon\Carbon::parse($event->event_date)->month == $request->month &&
                    \Carbon\Carbon::parse($event->event_date)->year == $request->year;
            });
        } else {
            $events = $events->where('event_date', '>=', $now->toDateString());
        }

         // Filter out past events
         $events = $events->filter(function ($event) use ($now) {
            return \Carbon\Carbon::parse($event->event_date)->isSameDay($now) || \Carbon\Carbon::parse($event->event_date)->isFuture();
        });

        return response()->json([
            'success' => true,
            'data' => $events->values()
        ]);
    }

    public function storeEvents(Request $request) {

        $val = $request->validate([
            'event_title' => 'required|string',
            'description' => 'required|string',
            'event_date' => 'required|date',
            'event_time' => 'required|date_format:g:i A'
        ]);

        try {
            $val['event_date'] = \Carbon\Carbon::createFromFormat('m/d/Y', $val['event_date'])->format('Y-m-d');
            $val['event_time'] = \Carbon\Carbon::createFromFormat('g:i A', $val['event_time'])->format('H:i');
            $events = Event::create($val);
            Log::info('Event created successfully: ' . $events->id);
        } catch (\Exception $e) {
            Log::error('Error creating event: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create event'
            ], 500);
        }


        return response()->json([
            'success' => true,
            'message' => 'Event successfully created',
            'data' => $events
        ]);
    }

    public function updateEvent(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        $val = $request->validate([
            'event_title' => 'required|string',
            'description' => 'required|string',
            'event_date' => 'required|date',
            'event_time' => 'required|date_format:H:i'
        ]);

        $event->update($val);

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => $event
        ]);
    }

    public function deleteEvent($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully'
        ]);
    }
}
