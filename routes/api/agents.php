<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AgentController;

// Protect all agent routes with Sanctum middleware
Route::middleware('auth:sanctum')->group(function () {
    // CRUD operations for agents
    Route::prefix('/agents')->group(function () {
        Route::apiResource('/', AgentController::class);
        Route::get('/metrics/{agentId}', [AgentController::class, 'fetchMetrics']);
        Route::get('/call-logs/{agentId}', [AgentController::class, 'fetchCallLogs']);
        Route::get('/call-log-details/{agentId}/{callId}', [AgentController::class, 'fetchCallLogDetails']);
        // Custom route to get agents owned by a specific user
        Route::get('/owned-by/{userId}', [AgentController::class, 'getAgentsByOwner']);
    });
});
