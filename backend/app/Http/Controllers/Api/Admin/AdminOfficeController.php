<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Office;

class AdminOfficeController extends Controller
{
    public function show() {
        $offices = Office::all();

        return response()->json([
            'success' => true,
            'offices' => $offices
        ]);
    }

    public function store(Request $request)
    {
        $val = $request->validate([
            'office_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'status' => 'required|in:active,inactive'
        ]);

        $office = Office::create($val);

        return response()->json([
            'success' => true,
            'message' => 'Office created successfully',
            'office' => $office
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $office = Office::findOrFail($id);

        $val = $request->validate([
            'office_name' => 'sometimes|nullable|string|max:255',
            'contact_email' => 'sometimes|nullable|email|max:255',
            'status' => 'sometimes|nullable|in:active,inactive'
        ]);

        $office->update(array_filter($val));

        return response()->json([
            'success' => true,
            'message' => 'Office updated successfully',
            'office' => $office
        ]);
    }

    public function delete($id)
    {
        $office = Office::findOrFail($id);

        $office->delete();

        return response()->json([
            'success' => true,
            'message' => 'Office deleted successfully'
        ]);
    }
}
