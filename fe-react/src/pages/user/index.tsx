import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    Search,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import type {
    ApiResponse,
    CreateUserPayload,
    UpdateUserPayload,
    User,
} from "../../interfaces/user.interface";
import {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
} from "../../services/user.service";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import UserModal from "./_components/UserModal";
import UserTable from "./_components/UserTable";

interface ToastState {
    type: "success" | "error";
    message: string;
}

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Modal & Toast States
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalSubmitting, setModalSubmitting] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => {
            setToast((prev) => (prev?.message === message ? null : prev));
        }, 3500);
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response: ApiResponse<User[]> = await getUsers({
                page,
                per_page: perPage,
                search: search || undefined,
            });

            setUsers(response.data ?? []);
            setLastPage(response.meta?.last_page ?? 1);
            setTotal(response.meta?.total ?? 0);
        } catch {
            setError("Gagal mengambil data pengguna dari server.");
            setUsers([]);
            setLastPage(1);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, search]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchUsers();
    }, [fetchUsers]);

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        setPage(1);
    };

    // Open Add Modal
    const handleOpenAddModal = () => {
        setSelectedUser(null);
        setIsUserModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEditModal = (user: User) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    // Handle Submit Add or Edit
    const handleUserSubmit = async (
        payload: CreateUserPayload | UpdateUserPayload
    ): Promise<boolean> => {
        setModalSubmitting(true);
        try {
            if (selectedUser) {
                // Edit
                await updateUser(selectedUser.id, payload as UpdateUserPayload);
                showToast("success", `Pengguna "${selectedUser.name}" berhasil diperbarui.`);
            } else {
                // Add
                await createUser(payload as CreateUserPayload);
                showToast("success", "Pengguna baru berhasil ditambahkan.");
            }
            await fetchUsers();
            return true;
        } catch (err: unknown) {
            let errorMsg = "Terjadi kesalahan saat menyimpan data.";
            if (
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
            ) {
                errorMsg = (err as { response: { data: { message: string } } }).response.data.message;
            }
            showToast("error", errorMsg);
            return false;
        } finally {
            setModalSubmitting(false);
        }
    };

    // Open Delete Modal
    const handleOpenDeleteModal = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setDeleteSubmitting(true);
        try {
            await deleteUser(userToDelete.id);
            showToast("success", `Pengguna "${userToDelete.name}" berhasil dihapus.`);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            await fetchUsers();
        } catch {
            showToast("error", "Gagal menghapus pengguna.");
        } finally {
            setDeleteSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-xl transition-all">
                    {toast.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    )}
                    <span className="text-sm font-medium text-slate-800">
                        {toast.message}
                    </span>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-2xs">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Manajemen Pengguna
                            </h1>
                            <p className="text-xs text-slate-500 sm:text-sm">
                                Kelola data pengguna, detail akun, dan identitas UUID.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-98 sm:text-sm"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Tambah Pengguna</span>
                    </button>
                </div>
            </div>

            {/* Search & Action Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative flex flex-1 items-center"
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Search className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        placeholder="Cari berdasarkan nama atau email..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-10 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void fetchUsers()}
                        disabled={loading}
                        title="Segarkan data"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${loading ? "animate-spin text-indigo-600" : ""}`}
                        />
                    </button>

                    {search && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/70 px-3 py-2 text-xs font-medium text-slate-700">
                            <span>Filter: &quot;{search}&quot;</span>
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Table */}
            <UserTable
                data={users}
                page={page}
                lastPage={lastPage}
                total={total}
                perPage={perPage}
                loading={loading}
                onPageChange={setPage}
                onPerPageChange={handlePerPageChange}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
            />

            {/* Add/Edit Modal */}
            <UserModal
                isOpen={isUserModalOpen}
                user={selectedUser}
                loading={modalSubmitting}
                onClose={() => setIsUserModalOpen(false)}
                onSubmit={handleUserSubmit}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                user={userToDelete}
                loading={deleteSubmitting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
