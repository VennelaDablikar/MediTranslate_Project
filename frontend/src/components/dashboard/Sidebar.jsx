"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, FileText, Book, Settings, Activity } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Scan', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Scan History', href: '/dashboard/history', icon: History },


    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
                    <Activity size={24} fill="currentColor" />
                </div>
                <div>
                    <h1 className="font-bold text-slate-900 text-lg leading-none">MediTranslate</h1>
                    <span className="text-xs text-slate-400 font-medium tracking-wider">AI MEDICAL SUITE</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 space-y-4">
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 transition-colors font-medium">
                    <Settings size={20} />
                    Settings
                </Link>

                {/* User Profile Snippet */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                        DS
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Dr. Sarah L.</p>
                        <p className="text-xs text-slate-500">Cardiology</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
