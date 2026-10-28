import { BookOpen, ExternalLink, Layers, Sparkles } from "lucide-react";
import UserPage from "./pages/user";

export default function App() {
    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-800 antialiased">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-slate-900">
                                Laravel + React Starter
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                                Fullstack REST API &amp; Dashboard
                            </span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Pengguna</span>
                        </span>

                        <a
                            href="http://localhost:8000/docs/api"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                            <span>Dokumentasi API</span>
                            <ExternalLink className="h-3 w-3 text-slate-400" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <UserPage />
            </main>
        </div>
    );
}