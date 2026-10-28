<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Request\User\IndexUserRequest;
use App\Http\Controllers\Request\User\StoreUserRequest;
use App\Http\Controllers\Request\User\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class UserController extends ApiController
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index(IndexUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $perPage = isset($validated['per_page'])
            ? (int) $validated['per_page']
            : null;

        $page = (int) ($validated['page'] ?? 1);
        $search = $validated['search'] ?? null;

        $users = $this->userService->getAll(
            $perPage,
            $page,
            $search
        );

        if ($users instanceof LengthAwarePaginator) {
            return $this->paginated(
                'Berhasil mengambil data pengguna',
                $users
            );
        }

        return $this->success(
            'Berhasil mengambil data pengguna',
            $users
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = $this->userService->create($data);

        return $this->success(
            'Berhasil menambahkan pengguna',
            $user,
            null,
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $user = $this->userService->getById($id);

        return $this->success(
            'Berhasil mengambil detail pengguna',
            $user
        );
    }

    public function update(
        UpdateUserRequest $request,
        string $id
    ): JsonResponse {
        $data = $request->validated();

        $user = $this->userService->update($id, $data);

        return $this->success(
            'Berhasil memperbarui data pengguna',
            $user
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->userService->delete($id);

        return $this->success(
            'Berhasil menghapus pengguna'
        );
    }
}
