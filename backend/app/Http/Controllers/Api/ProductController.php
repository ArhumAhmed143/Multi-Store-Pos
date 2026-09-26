<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductController
{
    /**
     * Display a listing of all products.
     */
    public function index()
    {
        $products = Product::with('store')->get();

        return response()->json([
            'message' => 'Products retrieved successfully',
            'data' => $products,
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'store_id' => 'required|exists:stores,id',
        ]);

        $product = Product::create($request->all());

        $this->checkAndCreateLowStockNotification($product);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product->load('store'),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        return response()->json([
            'message' => 'Product retrieved successfully',
            'data' => $product->load('store'),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'min_stock' => 'sometimes|integer|min:0',
            'store_id' => 'sometimes|exists:stores,id',
        ]);

        $product->update($request->all());

        $this->checkAndCreateLowStockNotification($product);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product->load('store'),
        ], Response::HTTP_OK);
    }

    /**
     * Create notifications when a product hits or falls below minimum stock.
     */
    private function checkAndCreateLowStockNotification(Product $product)
    {
        if ($product->stock > $product->min_stock) {
            return;
        }

        $message = sprintf('%s stock is low (%d left).', $product->name, $product->stock);
        $users = User::whereIn('role', ['admin', 'manager'])->get();

        foreach ($users as $user) {
            Notification::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'message' => $message,
                    'type' => 'low_stock',
                ],
                [
                    'is_read' => false,
                ]
            );
        }
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
            'data' => null,
        ], Response::HTTP_OK);
    }
}
