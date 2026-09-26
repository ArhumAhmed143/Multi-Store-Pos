<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController
{
    /**
     * Display a listing of user's notifications.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->latest()->get();

        return response()->json([
            'message' => 'Notifications retrieved successfully',
            'data' => $notifications,
        ], Response::HTTP_OK);
    }

    /**
     * Mark a notification as read.
     */
    public function update(Request $request, Notification $notification)
    {
        // Check if notification belongs to authenticated user
        if ($notification->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
                'data' => null,
            ], Response::HTTP_FORBIDDEN);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'message' => 'Notification updated successfully',
            'data' => $notification,
        ], Response::HTTP_OK);
    }
}
