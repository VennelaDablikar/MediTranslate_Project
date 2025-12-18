"use client";

import React from "react";
import Link from "next/link";
import { Plus, User } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-transparent">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    <Plus size={20} />
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">
                    MediTranslate
                </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                <Link href="/" className="text-primary font-semibold">
                    Dashboard
                </Link>
                <Link href="/history" className="hover:text-primary transition-colors">
                    History
                </Link>
                <Link href="/settings" className="hover:text-primary transition-colors">
                    Settings
                </Link>
                <Link href="/support" className="hover:text-primary transition-colors">
                    Support
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-teal-900 transition-colors shadow-lg shadow-teal-900/20">
                    <Plus size={16} />
                    New Session
                </button>
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                    {/* Placeholder for avatar */}
                    <User className="text-gray-400" size={24} />
                </div>
            </div>
        </nav>
    );
}
