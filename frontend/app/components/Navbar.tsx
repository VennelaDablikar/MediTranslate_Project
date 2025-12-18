"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, User } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        return `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
            ? "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20 backdrop-blur-sm"
            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            }`;
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-background/70 backdrop-blur-md border-b border-border/40 transition-all">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary/25">
                    <Plus size={20} />
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">
                    MediTranslate
                </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
                <Link href="/" className={getLinkClass("/")}>
                    Dashboard
                </Link>
                <Link href="/history" className={getLinkClass("/history")}>
                    History
                </Link>
                <Link href="/settings" className={getLinkClass("/settings")}>
                    Settings
                </Link>
                <Link href="/support" className={getLinkClass("/support")}>
                    Support
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {/* Right side elements removed as requested */}
            </div>
        </nav>
    );
}
