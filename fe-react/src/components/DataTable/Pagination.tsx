import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    page: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
}

export default function Pagination({
    page,
    lastPage,
    total,
    perPage,
    onPageChange,
    onPerPageChange,
}: PaginationProps) {
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    // Calculate visible page range (up to 5 buttons)
    const getVisiblePages = (): number[] => {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        const end = Math.min(lastPage, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Info summary */}
            <div className="text-xs text-slate-500 sm:text-sm">
                Menampilkan <span className="font-medium text-slate-900">{from}</span>-
                <span className="font-medium text-slate-900">{to}</span> dari{" "}
                <span className="font-medium text-slate-900">{total}</span> pengguna
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* Per page selector */}
                <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                    <span>Baris per halaman:</span>
                    <select
                        aria-label="Pilih jumlah baris per halaman"
                        value={perPage}
                        onChange={(event) => {
                            onPerPageChange(Number(event.target.value));
                        }}
                        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                    >
                        {[5, 10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Page Navigation */}
                <nav
                    role="navigation"
                    aria-label="Navigasi Halaman"
                    className="flex items-center gap-1"
                >
                    <button
                        type="button"
                        aria-label="Halaman Pertama"
                        disabled={page <= 1}
                        onClick={() => onPageChange(1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Halaman Sebelumnya"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 px-1">
                        {visiblePages.map((pageNumber) => {
                            const isActive = pageNumber === page;
                            return (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    aria-label={`Halaman ${pageNumber}`}
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={() => onPageChange(pageNumber)}
                                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition-all sm:text-sm ${
                                        isActive
                                            ? "bg-indigo-600 font-semibold text-white shadow-xs"
                                            : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        aria-label="Halaman Berikutnya"
                        disabled={page >= lastPage}
                        onClick={() => onPageChange(page + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Halaman Terakhir"
                        disabled={page >= lastPage}
                        onClick={() => onPageChange(lastPage)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </nav>
            </div>
        </div>
    );
}
