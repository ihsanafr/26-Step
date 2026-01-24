<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\FinancialTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $query = Budget::where('user_id', $request->user()->id);

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $budgets = $query->orderBy('created_at', 'desc')->get();

        // Calculate spent amount for each budget
        foreach ($budgets as $budget) {
            $spent = FinancialTransaction::where('user_id', $request->user()->id)
                ->where('type', 'expense')
                ->where('category', $budget->category)
                ->whereBetween('date', [$budget->start_date, $budget->end_date])
                ->sum('amount');

            $budget->spent = (float) $spent;
            $budget->remaining = $budget->amount - $spent;
            $budget->percentage = $budget->amount > 0 ? ($spent / $budget->amount) * 100 : 0;
        }

        return response()->json($budgets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'period' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'nullable|boolean',
            'color' => 'nullable|string|max:7',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $budget = Budget::create($validated);

        return response()->json($budget, 201);
    }

    public function show(Request $request, string $id)
    {
        $budget = Budget::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $spent = FinancialTransaction::where('user_id', $request->user()->id)
            ->where('type', 'expense')
            ->where('category', $budget->category)
            ->whereBetween('date', [$budget->start_date, $budget->end_date])
            ->sum('amount');

        $budget->spent = (float) $spent;
        $budget->remaining = $budget->amount - $spent;
        $budget->percentage = $budget->amount > 0 ? ($spent / $budget->amount) * 100 : 0;

        return response()->json($budget);
    }

    public function update(Request $request, string $id)
    {
        $budget = Budget::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'category' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric|min:0',
            'period' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'is_active' => 'nullable|boolean',
            'color' => 'nullable|string|max:7',
        ]);

        $budget->update($validated);

        return response()->json($budget);
    }

    public function destroy(Request $request, string $id)
    {
        $budget = Budget::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $budget->delete();

        return response()->json(['message' => 'Budget deleted successfully']);
    }
}
