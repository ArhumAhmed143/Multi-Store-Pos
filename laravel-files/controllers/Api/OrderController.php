&lt;?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OrderController
{
    /**
     * Display a listing of all orders.
     */
    public function index()
    {
        $orders = Order::with('cashier', 'items.product')->get();

        return response()->json([
            'message' => 'Orders retrieved successfully',
            'data' => $orders,
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cashier_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        // Calculate total amount
        $totalAmount = collect($request->items)->sum(function ($item) {
            return $item['quantity'] * $item['price'];
        });

        // Create order
        $order = Order::create([
            'cashier_id' => $request->cashier_id,
            'total_amount' => $totalAmount,
            'status' => 'completed',
        ]);

        // Create order items
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json([
            'message' => 'Order created successfully',
            'data' => $order->load('cashier', 'items.product'),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        return response()->json([
            'message' => 'Order retrieved successfully',
            'data' => $order->load('cashier', 'items.product'),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'sometimes|in:pending,completed,cancelled',
        ]);

        $order->update($request->all());

        return response()->json([
            'message' => 'Order updated successfully',
            'data' => $order->load('cashier', 'items.product'),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
            'data' => null,
        ], Response::HTTP_OK);
    }
}
