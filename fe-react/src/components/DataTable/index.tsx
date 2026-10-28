import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type TableOptions,
} from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import Pagination from "./Pagination";

interface DataTableProps<TData> {
    columns: TableOptions<TData>["columns"];
    data: TData[];
    page: number;
    lastPage: number;
    total: number;
    perPage: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    ariaLabel?: string;
}

export default function DataTable<TData>({
    columns,
    data,
    page,
    lastPage,
    total,
    perPage,
    loading = false,
    onPageChange,
    onPerPageChange,
    ariaLabel = "Tabel Data Pengguna",
}: DataTableProps<TData>) {
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: lastPage,
    });

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all">
            {/* Scrollable table container with keyboard accessibility per modern-web-guidance */}
            <div
                tabIndex={0}
                role="region"
                aria-label={ariaLabel}
                className="max-h-[640px] overflow-auto focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
                <table className="w-full border-separate border-spacing-0 text-left text-sm">
                    {/* Sticky column header */}
                    <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        className="border-b border-slate-200 px-6 py-4"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            // Modern skeleton rows instead of plain text
                            Array.from({ length: Math.min(perPage, 5) }).map((_, index) => (
                                <tr key={`skeleton-${index}`} className="animate-pulse">
                                    {columns.map((_, colIndex) => (
                                        <td
                                            key={`skeleton-cell-${colIndex}`}
                                            className="px-6 py-4.5"
                                        >
                                            <div
                                                className={`h-4.5 rounded-md bg-slate-200/70 ${
                                                    colIndex === 0
                                                        ? "w-16"
                                                        : colIndex === 1
                                                        ? "w-44"
                                                        : colIndex === 2
                                                        ? "w-36"
                                                        : "w-24"
                                                }`}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                            <Inbox className="h-7 w-7" />
                                        </div>
                                        <h3 className="mt-4 text-base font-medium text-slate-800">
                                            Tidak ada data ditemukan
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Coba ubah kata kunci pencarian Anda atau tambahkan data pengguna baru.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="group transition-colors duration-150 hover:bg-slate-50/70"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 text-slate-700"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                lastPage={lastPage}
                total={total}
                perPage={perPage}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
            />
        </div>
    );
}
