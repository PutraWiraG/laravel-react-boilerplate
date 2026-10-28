import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
    Calendar,
    Check,
    Copy,
    Mail,
    Pencil,
    Trash2,
} from "lucide-react";
import type { User } from "../../../interfaces/user.interface";
import DataTable from "../../../components/DataTable";

interface UserTableProps {
    data: User[];
    page: number;
    lastPage: number;
    total: number;
    perPage: number;
    loading: boolean;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

const columnHelper = createColumnHelper<User>();

function getInitials(name: string): string {
    const parts = name.trim().split(" ");
    if (parts.length >= 2 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

// Generate deterministic background color for avatar based on name
function getAvatarGradient(name: string): string {
    const gradients = [
        "from-indigo-500 to-purple-600",
        "from-blue-500 to-cyan-600",
        "from-emerald-500 to-teal-600",
        "from-rose-500 to-pink-600",
        "from-amber-500 to-orange-600",
        "from-violet-500 to-fuchsia-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index] ?? gradients[0]!;
}

function UuidBadge({ id }: { id: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        void navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const truncated = id.length > 13 ? `${id.slice(0, 8)}...${id.slice(-4)}` : id;

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={`Salin UUID: ${id}`}
            className="group/badge inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-100/70 px-2 py-0.5 text-xs font-mono text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-200/60 active:scale-95"
        >
            <span>{truncated}</span>
            {copied ? (
                <Check className="h-3 w-3 text-emerald-600" />
            ) : (
                <Copy className="h-3 w-3 text-slate-400 group-hover/badge:text-slate-600" />
            )}
            {copied && (
                <span className="text-[10px] font-sans font-medium text-emerald-600">
                    Tersalin!
                </span>
            )}
        </button>
    );
}

export default function UserTable({
    data,
    page,
    lastPage,
    total,
    perPage,
    loading,
    onPageChange,
    onPerPageChange,
    onEdit,
    onDelete,
}: UserTableProps) {
    const columns = [
        columnHelper.accessor("name", {
            header: "Pengguna",
            cell: (info) => {
                const user = info.row.original;
                const gradient = getAvatarGradient(user.name);
                const initials = getInitials(user.name);

                return (
                    <div className="flex items-center gap-3.5">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${gradient} text-xs font-bold text-white shadow-xs`}
                        >
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {user.name}
                            </span>
                            <div className="mt-1">
                                <UuidBadge id={user.id} />
                            </div>
                        </div>
                    </div>
                );
            },
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="font-medium text-slate-700">
                        {info.getValue()}
                    </span>
                </div>
            ),
        }),
        columnHelper.accessor("created_at", {
            header: "Tanggal Terdaftar",
            cell: (info) => {
                const dateStr = info.getValue();
                const formatted = new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }).format(new Date(dateStr));

                return (
                    <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{formatted}</span>
                    </div>
                );
            },
        }),
        columnHelper.display({
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(row.original)}
                        aria-label={`Edit ${row.original.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600 active:scale-95"
                    >
                        <Pencil className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-indigo-600" />
                        <span>Edit</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(row.original)}
                        aria-label={`Hapus ${row.original.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 shadow-2xs transition-all hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-700 active:scale-95"
                    >
                        <Trash2 className="h-3.5 w-3.5 text-rose-400 transition-colors" />
                        <span>Hapus</span>
                    </button>
                </div>
            ),
        }),
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            page={page}
            lastPage={lastPage}
            total={total}
            perPage={perPage}
            loading={loading}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
        />
    );
}
