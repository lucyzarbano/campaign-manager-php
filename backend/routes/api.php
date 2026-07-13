<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\CreativeController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']);
Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']);
Route::get('/campaigns/{campaign}/creatives', [CreativeController::class, 'index']);
Route::post('/campaigns/{campaign}/creatives', [CreativeController::class, 'store']);
Route::delete('/campaigns/{campaign}/creatives/{creative}', [CreativeController::class, 'destroy']);
