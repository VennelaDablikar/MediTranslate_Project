"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, User, Bell, Lock, Puzzle, CreditCard, ChevronLeft } from 'lucide-react';

export default function SettingsSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'General', href: '/settings', icon: Settings },
        { name: 'Account', href: '/settings/account', icon: User },
        { name: 'Privacy & Security', href: '/settings/privacy', icon: Lock },
    ];

    return (
        <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Header / Profile */}
            <div className="p-8 pb-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 mb-6 text-sm font-bold transition-colors">
                    <ChevronLeft size={16} /> Back to Dashboard
                </Link>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-100">
                        {/* Placeholder Avatar */}
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">DS</div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">Dr. Sarah Smith</h3>
                        <p className="text-xs text-emerald-600 font-bold">Cardiology Dept.</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Settings</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                                ? 'bg-cyan-50 text-cyan-700 font-bold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>


        </aside>
    );
}
