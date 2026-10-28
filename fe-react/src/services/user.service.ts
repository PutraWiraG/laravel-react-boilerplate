
import api from "../lib/api";
import type {
    ApiResponse,
    CreateUserPayload,
    UpdateUserPayload,
    User,
    UserQueryParams,
} from "../interfaces/user.interface";

export const getUsers = async (
    params?: UserQueryParams
): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>("/users", {
        params,
    });

    return response.data;
};

export const getUserById = async (
    id: string
): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);

    return response.data;
};

export const createUser = async (
    data: CreateUserPayload
): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>("/users", data);

    return response.data;
};

export const updateUser = async (
    id: string,
    data: UpdateUserPayload
): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);

    return response.data;
};

export const deleteUser = async (
    id: string
): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);

    return response.data;
};
