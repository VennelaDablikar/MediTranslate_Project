"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useAuth } from "../context/AuthContext";

// Force re-render for hydration fix
export default function PublicHeader() {
    const { user } = useAuth();

    return (
        <header className="absolute top-0 left-0 w-full z-50 px-8 py-6 bg-background/60 backdrop-blur-md border-b border-white/10 supports-[backdrop-filter]:bg-background/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-teal-700/20">
                        <Plus size={20} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                        MediTranslate
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link
                            href="/"
                            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-teal-700/20 hover:-translate-y-0.5"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-teal-700 hover:bg-teal-50/50 transition-all duration-300"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-teal-700/20 hover:-translate-y-0.5"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
