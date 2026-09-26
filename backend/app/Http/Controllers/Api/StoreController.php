<?php

namespace App\Http\Controllers\Api;

use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class StoreController
{
    /**
     * Display a listing of all stores.
     */
    public function index()
    {
        $stores = Store::with('manager', 'products')->get();

        return response()->json([
            'message' => 'Stores retrieved successfully',
            'data' => $stores,
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created store.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required_without:location|string|max:255',
            'city' => 'required_without:location|string|max:255',
            'location' => 'sometimes|string|max:255',
            'manager_id' => 'sometimes|exists:users,id',
        ]);

        $location = $request->input('location') ?: trim($request->input('address') . ', ' . $request->input('city'));
        $managerId = $request->input('manager_id') ?: Auth::id();
        $manager = User::find($managerId);

        if ($manager && $manager->store_limit !== null && $manager->stores()->count() >= $manager->store_limit) {
            return response()->json([
                'message' => 'Manager has reached the store limit',
            ], Response::HTTP_FORBIDDEN);
        }

        $store = Store::create([
            'name' => $request->input('name'),
            'location' => $location,
            'manager_id' => $managerId,
        ]);

        return response()->json([
            'message' => 'Store created successfully',
            'data' => $store->load('manager', 'products'),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified store.
     */
    public function show(Store $store)
    {
        return response()->json([
            'message' => 'Store retrieved successfully',
            'data' => $store->load('manager', 'products'),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified store.
     */
    public function update(Request $request, Store $store)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'manager_id' => 'sometimes|exists:users,id',
        ]);

        $data = $request->only(['name', 'location', 'manager_id']);

        if ($request->filled('manager_id') && $request->input('manager_id') != $store->manager_id) {
            $newManager = User::find($request->input('manager_id'));
            if ($newManager && $newManager->store_limit !== null && $newManager->stores()->count() >= $newManager->store_limit) {
                return response()->json([
                    'message' => 'Manager has reached the store limit',
                ], Response::HTTP_FORBIDDEN);
            }
        }

        if ($request->filled('address') || $request->filled('city')) {
            $data['location'] = trim($request->input('address') . ', ' . $request->input('city'));
        }

        $store->update($data);

        return response()->json([
            'message' => 'Store updated successfully',
            'data' => $store->load('manager', 'products'),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified store.
     */
    public function destroy(Store $store)
    {
        $store->delete();

        return response()->json([
            'message' => 'Store deleted successfully',
            'data' => null,
        ], Response::HTTP_OK);
    }
}
