<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Saving;
use Illuminate\Http\Request;

class SavingController extends Controller
{
    public function index(Request $request)
    {
        $savings = Saving::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($savings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'type' => 'nullable|string',
            'target_date' => 'nullable|date',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['current_amount'] = $validated['current_amount'] ?? 0;

        $saving = Saving::create($validated);

        return response()->json($saving, 201);
    }

    public function show(Request $request, string $id)
    {
        $saving = Saving::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($saving);
    }

    public function update(Request $request, string $id)
    {
        $saving = Saving::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'sometimes|required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'type' => 'nullable|string',
            'target_date' => 'nullable|date',
        ]);

        $saving->update($validated);

        return response()->json($saving);
    }

    public function destroy(Request $request, string $id)
    {
        $saving = Saving::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $saving->delete();

        return response()->json(['message' => 'Saving deleted successfully']);
    }
}
