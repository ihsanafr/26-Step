<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinancialTransaction;
use Illuminate\Http\Request;

class FinancialTransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = FinancialTransaction::where('user_id', $request->user()->id);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $transactions = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $validated['user_id'] = $request->user()->id;

        $transaction = FinancialTransaction::create($validated);

        return response()->json($transaction, 201);
    }

    public function show(Request $request, string $id)
    {
        $transaction = FinancialTransaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($transaction);
    }

    public function update(Request $request, string $id)
    {
        $transaction = FinancialTransaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|required|in:income,expense',
            'amount' => 'sometimes|required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date' => 'sometimes|required|date',
        ]);

        $transaction->update($validated);

        return response()->json($transaction);
    }

    public function destroy(Request $request, string $id)
    {
        $transaction = FinancialTransaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully']);
    }
}
