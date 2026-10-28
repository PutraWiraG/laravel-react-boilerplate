import { AlertTriangle, Loader2, X } from "lucide-react";
import type { User } from "../../../interfaces/user.interface";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    user: User | null;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({
    isOpen,
    user,
    loading,
    onClose,
    onConfirm,
}: DeleteConfirmModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                        <AlertTriangle className="h-6 w-6" />
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

                <div className="mt-4">
                    <h3 id="delete-modal-title" className="text-base font-semibold text-slate-900">
                        Hapus Pengguna?
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        Apakah Anda yakin ingin menghapus akun{" "}
                        <span className="font-semibold text-slate-900">{user.name}</span> (
                        <span className="text-slate-500">{user.email}</span>)? Tindakan ini
                        tidak dapat dibatalkan.
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => void onConfirm()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-98 disabled:opacity-60"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <span>Ya, Hapus</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

