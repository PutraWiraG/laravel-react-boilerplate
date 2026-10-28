<?php

namespace Tests\Feature;

use App\Helpers\ApiResponse;
use Tests\TestCase;

class ApiResponseTest extends TestCase
{
    public function test_success_response_has_expected_structure(): void
    {
        $response = ApiResponse::success(
            'Berhasil mengambil data pengguna',
            ['id' => 1, 'name' => 'Putra']
        );

        $this->assertSame(200, $response->getStatusCode());

        $this->assertSame([
            'success' => true,
            'message' => 'Berhasil mengambil data pengguna',
            'data' => [
                'id' => 1,
                'name' => 'Putra',
            ],
        ], $response->getData(true));
    }

    public function test_error_response_has_expected_structure(): void
    {
        $response = ApiResponse::error(
            'Validasi gagal',
            ['email' => ['Email wajib diisi']],
            422
        );

        $this->assertSame(422, $response->getStatusCode());

        $this->assertSame([
            'success' => false,
            'message' => 'Validasi gagal',
            'error' => [
                'email' => ['Email wajib diisi'],
            ],
        ], $response->getData(true));
    }

    public function test_success_response_can_include_meta(): void
    {
        $response = ApiResponse::success(
            'Berhasil mengambil data',
            ['id' => 1],
            ['current_page' => 1, 'per_page' => 10]
        );

        $this->assertSame(200, $response->getStatusCode());

        $this->assertSame(
            ['current_page' => 1, 'per_page' => 10],
            $response->getData(true)['meta']
        );
    }
}
