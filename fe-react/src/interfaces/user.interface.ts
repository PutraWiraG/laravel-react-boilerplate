
export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface UserQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    error?: Record<string, string[]>;
}
