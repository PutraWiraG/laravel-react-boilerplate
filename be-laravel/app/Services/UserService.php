<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAll(
        ?int $perPage = null,
        int $page = 1,
        ?string $search = null
    ): Collection|LengthAwarePaginator {
        $query = User::query();

        if ($search !== null && trim($search) !== '') {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $query->latest();

        if ($perPage === null) {
            return $query->get();
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);

        return User::create($data);
    }

    public function getById(string $id): User
    {
        return User::findOrFail($id);
    }

    public function update(string $id, array $data): User
    {
        $user = $this->getById($id);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return $user->refresh();
    }

    public function delete(string $id): void
    {
        $user = $this->getById($id);
        $user->delete();
    }
}
