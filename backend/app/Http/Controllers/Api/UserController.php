<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->get();

        return response()->json([
            'message' => 'Users retrieved successfully',
            'data' => $users,
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        if (in_array(Auth::user()->role, ['manager', 'store_manager'])) {
            $request->merge(['role' => 'cashier']);

            $cashierCount = User::where('role', 'cashier')->count();
            if (Auth::user()->store_limit !== null && Auth::user()->store_limit !== '' && $cashierCount >= Auth::user()->store_limit) {
                return response()->json([
                    'message' => 'Cashier creation limit reached',
                ], Response::HTTP_FORBIDDEN);
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,manager,cashier',
            'store_limit' => 'nullable|integer|min:0',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ];

        if ($request->has('store_limit') && $request->input('store_limit') !== '') {
            $userData['store_limit'] = $request->input('store_limit');
        }

        $user = User::create($userData);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user,
        ], Response::HTTP_CREATED);
    }

    public function show(User $user)
    {
        return response()->json([
            'message' => 'User retrieved successfully',
            'data' => $user,
        ], Response::HTTP_OK);
    }

    public function update(Request $request, User $user)
    {
        if (in_array(Auth::user()->role, ['manager', 'store_manager']) && $user->role !== 'cashier') {
            return response()->json([
                'message' => 'Unauthorized to edit this user',
            ], Response::HTTP_FORBIDDEN);
        }

        if (in_array(Auth::user()->role, ['manager', 'store_manager'])) {
            $request->merge(['role' => 'cashier']);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:admin,manager,cashier',
            'store_limit' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['name', 'email', 'role']);
        if ($request->has('store_limit')) {
            $data['store_limit'] = $request->input('store_limit');
        }

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user,
        ], Response::HTTP_OK);
    }

    public function destroy(User $user)
    {
        if (in_array(Auth::user()->role, ['manager', 'store_manager']) && $user->role !== 'cashier') {
            return response()->json([
                'message' => 'Unauthorized to delete this user',
            ], Response::HTTP_FORBIDDEN);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
            'data' => null,
        ], Response::HTTP_OK);
    }
}
