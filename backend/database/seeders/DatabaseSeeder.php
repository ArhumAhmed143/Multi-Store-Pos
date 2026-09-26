<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Store;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@pos.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create Manager Users
        $manager1 = User::create([
            'name' => 'Manager One',
            'email' => 'manager1@pos.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
        ]);

        $manager2 = User::create([
            'name' => 'Manager Two',
            'email' => 'manager2@pos.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
        ]);

        // Create Cashier Users
        $cashier1 = User::create([
            'name' => 'Cashier One',
            'email' => 'cashier1@pos.com',
            'password' => Hash::make('password123'),
            'role' => 'cashier',
        ]);

        $cashier2 = User::create([
            'name' => 'Cashier Two',
            'email' => 'cashier2@pos.com',
            'password' => Hash::make('password123'),
            'role' => 'cashier',
        ]);

        // Create Stores
        $store1 = Store::create([
            'name' => 'Downtown Store',
            'location' => '123 Main St, Downtown',
            'manager_id' => $manager1->id,
        ]);

        $store2 = Store::create([
            'name' => 'Mall Store',
            'location' => '456 Shopping Center, Mall District',
            'manager_id' => $manager2->id,
        ]);

        // Create Products for Store 1
        $products_store1 = [
            [
                'name' => 'Espresso',
                'price' => 2.50,
                'stock' => 100,
                'store_id' => $store1->id,
            ],
            [
                'name' => 'Americano',
                'price' => 2.00,
                'stock' => 150,
                'store_id' => $store1->id,
            ],
            [
                'name' => 'Cappuccino',
                'price' => 3.50,
                'stock' => 80,
                'store_id' => $store1->id,
            ],
            [
                'name' => 'Latte',
                'price' => 3.75,
                'stock' => 90,
                'store_id' => $store1->id,
            ],
            [
                'name' => 'Croissant',
                'price' => 2.50,
                'stock' => 50,
                'store_id' => $store1->id,
            ],
        ];

        $created_products_store1 = [];
        foreach ($products_store1 as $product) {
            $created_products_store1[] = Product::create($product);
        }

        // Create Products for Store 2
        $products_store2 = [
            [
                'name' => 'Mocha',
                'price' => 4.00,
                'stock' => 60,
                'store_id' => $store2->id,
            ],
            [
                'name' => 'Macchiato',
                'price' => 3.25,
                'stock' => 70,
                'store_id' => $store2->id,
            ],
            [
                'name' => 'Cold Brew',
                'price' => 2.75,
                'stock' => 110,
                'store_id' => $store2->id,
            ],
            [
                'name' => 'Donut',
                'price' => 1.50,
                'stock' => 200,
                'store_id' => $store2->id,
            ],
            [
                'name' => 'Muffin',
                'price' => 3.00,
                'stock' => 75,
                'store_id' => $store2->id,
            ],
        ];

        $created_products_store2 = [];
        foreach ($products_store2 as $product) {
            $created_products_store2[] = Product::create($product);
        }

        // Create Sample Orders
        $order1 = Order::create([
            'cashier_id' => $cashier1->id,
            'total_amount' => 0, // Will be calculated
            'status' => 'completed',
        ]);

        // Add items to order 1
        $order1_total = 0;
        $order1_items = [
            ['product' => $created_products_store1[0], 'quantity' => 2, 'price' => 2.50],
            ['product' => $created_products_store1[2], 'quantity' => 1, 'price' => 3.50],
            ['product' => $created_products_store1[4], 'quantity' => 3, 'price' => 2.50],
        ];

        foreach ($order1_items as $item) {
            $item_total = $item['quantity'] * $item['price'];
            $order1_total += $item_total;
            
            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $item['product']->id,
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        $order1->update(['total_amount' => $order1_total]);

        // Create another sample order
        $order2 = Order::create([
            'cashier_id' => $cashier2->id,
            'total_amount' => 0, // Will be calculated
            'status' => 'completed',
        ]);

        $order2_total = 0;
        $order2_items = [
            ['product' => $created_products_store2[0], 'quantity' => 1, 'price' => 4.00],
            ['product' => $created_products_store2[2], 'quantity' => 2, 'price' => 2.75],
        ];

        foreach ($order2_items as $item) {
            $item_total = $item['quantity'] * $item['price'];
            $order2_total += $item_total;
            
            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $item['product']->id,
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        $order2->update(['total_amount' => $order2_total]);

        // Create Sample Notifications
        Notification::create([
            'user_id' => $manager1->id,
            'message' => 'Your store has completed a new order',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $manager1->id,
            'message' => 'Stock is running low for Espresso',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $cashier1->id,
            'message' => 'Order #1 was successfully completed',
            'is_read' => true,
        ]);

        Notification::create([
            'user_id' => $admin->id,
            'message' => 'New manager assigned to Mall Store',
            'is_read' => false,
        ]);
    }
}
