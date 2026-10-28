<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

abstract class ApiController extends Controller
{
    protected function success(
        string $message,
        mixed $data = null,
        ?array $meta = null,
        int $statusCode = 200
    ): JsonResponse {
        return ApiResponse::success(
            $message,
            $data,
            $meta,
            $statusCode
        );
    }

    protected function error(
        string $message,
        array $errors = [],
        int $statusCode = 400
    ): JsonResponse {
        return ApiResponse::error(
            $message,
            $errors,
            $statusCode
        );
    }

    protected function paginated(
        string $message,
        LengthAwarePaginator $paginator
    ): JsonResponse {
        return ApiResponse::paginated($message, $paginator);
    }
}
