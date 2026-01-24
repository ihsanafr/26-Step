<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $feedback = Feedback::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => 'Feedback berhasil dikirim. Terima kasih atas saran dan masukan Anda!',
            'feedback' => $feedback,
        ], 201);
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $feedbacks = Feedback::orderBy('created_at', 'desc')->paginate($perPage);
        return response()->json($feedbacks);
    }

    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return response()->json([
            'message' => 'Feedback berhasil dihapus',
        ]);
    }
}
