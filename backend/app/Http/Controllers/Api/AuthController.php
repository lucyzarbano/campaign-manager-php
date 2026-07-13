<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:users,username'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'name' => $validated['username'],
            'username' => $validated['username'],
            'email' => $validated['username'].'@campaign-manager.local',
            'password' => $validated['password'],
        ]);

        return response()->json([
            'data' => [
                'user' => $this->serializeUser($user),
            ],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('username', $validated['username'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Invalid credentials.'],
            ]);
        }

        $token = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => $this->serializeUser($user),
                'token' => $token,
            ],
        ]);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
        ];
    }
}
