&lt;?php

namespace App\Http\Controllers\Api;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
            'location' => 'required|string|max:255',
            'manager_id' => 'required|exists:users,id',
        ]);

        $store = Store::create($request->all());

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
            'location' => 'sometimes|string|max:255',
            'manager_id' => 'sometimes|exists:users,id',
        ]);

        $store->update($request->all());

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
