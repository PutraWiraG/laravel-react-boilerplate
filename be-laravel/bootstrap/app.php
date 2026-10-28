
<?php

use App\Helpers\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (Throwable $e, Request $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            if ($e instanceof ValidationException) {
                return ApiResponse::error(
                    'Validasi gagal',
                    $e->errors(),
                    422
                );
            }

            if ($e instanceof AuthenticationException) {
                return ApiResponse::error(
                    'Silakan login terlebih dahulu',
                    [['code' => 'UNAUTHENTICATED', 'detail' => 'Autentikasi diperlukan']],
                    401
                );
            }

            if ($e instanceof AuthorizationException) {
                return ApiResponse::error(
                    'Anda tidak memiliki izin untuk melakukan tindakan ini',
                    [['code' => 'FORBIDDEN', 'detail' => 'Akses ditolak']],
                    403
                );
            }

            if ($e instanceof ModelNotFoundException) {
                return ApiResponse::error(
                    'Data tidak ditemukan',
                    [['code' => 'NOT_FOUND', 'detail' => 'Data yang diminta tidak ditemukan']],
                    404
                );
            }

            if ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();

                $messages = [
                    403 => 'Akses ditolak',
                    404 => 'Data atau halaman tidak ditemukan',
                    405 => 'Metode request tidak diizinkan',
                    419 => 'Sesi telah berakhir',
                    429 => 'Terlalu banyak permintaan',
                ];

                return ApiResponse::error(
                    $messages[$status] ?? 'Request gagal',
                    [['code' => 'HTTP_ERROR', 'detail' => $messages[$status] ?? 'Request tidak dapat diproses']],
                    $status
                );
            }

            return ApiResponse::error(
                'Terjadi kesalahan pada server',
                [['code' => 'INTERNAL_SERVER_ERROR', 'detail' => 'Terjadi kesalahan internal']],
                500
            );
        });
    })->create();
