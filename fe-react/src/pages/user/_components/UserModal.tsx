import { useState } from "react";
import { Loader2, Lock, Mail, User as UserIcon, X } from "lucide-react";
import type { CreateUserPayload, UpdateUserPayload, User } from "../../../interfaces/user.interface";

interface UserModalProps {
    isOpen: boolean;
    user: User | null; // null = Mode Tambah, User = Mode Edit
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<boolean>;
}

export default function UserModal({
    isOpen,
    user,
    loading,
    onClose,
    onSubmit,
}: UserModalProps) {
    if (!isOpen) return null;

    return (
        <UserModalDialog
            key={user ? user.id : "create-new-user"}
            user={user}
            loading={loading}
            onClose={onClose}
            onSubmit={onSubmit}
        />
    );
}

function UserModalDialog({
    user,
    loading,
    onClose,
    onSubmit,
}: Omit<UserModalProps, "isOpen">) {
    const isEdit = Boolean(user);
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [password, setPassword] = useState("");
    const [clientError, setClientError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setClientError("");

        if (!name.trim()) {
            setClientError("Nama tidak boleh kosong.");
            return;
        }

        if (!email.trim()) {
            setClientError("Email tidak boleh kosong.");
            return;
        }

        if (!isEdit && (!password || password.length < 8)) {
            setClientError("Password minimal harus 8 karakter.");
            return;
        }

        if (isEdit && password && password.length < 8) {
            setClientError("Password baru minimal harus 8 karakter.");
            return;
        }

        let payload: CreateUserPayload | UpdateUserPayload;
        if (isEdit) {
            payload = {
                name: name.trim(),
                email: email.trim(),
                ...(password ? { password } : {}),
            };
        } else {
            payload = {
                name: name.trim(),
                email: email.trim(),
                password,
            };
        }

        const success = await onSubmit(payload);
        if (success) {
            onClose();
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Dialog Card */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h3 id="modal-title" className="text-lg font-semibold text-slate-900">
                            {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {isEdit
                                ? "Perbarui informasi nama, email, atau password pengguna."
                                : "Isi data formulir berikut untuk mendaftarkan pengguna baru."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup modal"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {clientError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-medium text-rose-700">
                            {clientError}
                        </div>
                    )}

                    {/* Nama */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                        >
                            Nama Lengkap
                        </label>
                        <div className="relative mt-1.5 rounded-xl shadow-2xs">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Contoh: John Doe"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                        >
                            Email
                        </label>
                        <div className="relative mt-1.5 rounded-xl shadow-2xs">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@perusahaan.com"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                        >
                            {isEdit ? "Password Baru (Opsional)" : "Password"}
                        </label>
                        <div className="relative mt-1.5 rounded-xl shadow-2xs">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={
                                    isEdit
                                        ? "Kosongkan jika tidak ingin mengubah"
                                        : "Minimal 8 karakter"
                                }
                                required={!isEdit}
                                minLength={8}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>{isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
