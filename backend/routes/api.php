<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Flow\FlowController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/check-email', [AuthController::class, 'checkEmail']);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Flow Management Routes
    Route::prefix('flows')->group(function () {
        Route::get('/', [FlowController::class, 'index']);                    // Get all flows
        Route::post('/', [FlowController::class, 'store']);                   // Create new flow
        Route::get('/templates', [FlowController::class, 'templates']);       // Get flow templates
        Route::get('/{id}', [FlowController::class, 'show']);                 // Get specific flow
        Route::put('/{id}', [FlowController::class, 'update']);               // Update flow
        Route::delete('/{id}', [FlowController::class, 'destroy']);           // Delete flow
        Route::post('/{id}/duplicate', [FlowController::class, 'duplicate']); // Duplicate flow
        Route::post('/{id}/activate', [FlowController::class, 'activate']);   // Activate flow
        Route::post('/{id}/deactivate', [FlowController::class, 'deactivate']); // Deactivate flow
    });
});
