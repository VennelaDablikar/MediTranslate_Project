"use client";
import React from 'react';
import Link from 'next/link';
import SettingsSidebar from '../../components/settings/SettingsSidebar';
import { Activity } from 'lucide-react';

export default function SettingsLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* 1. Settings Sidebar */}
            <SettingsSidebar />

            {/* 2. Main Content Area */}
            <main className="flex-1 ml-72 flex flex-col min-h-screen">
                {/* Top Header matching screenshot */}
                <header className="h-20 bg-white border-b border-slate-100 flex justify-between items-center px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        {/* Logo visible here if we want, but sidebar covers it. Screenshot shows logo top left. */}
                        {/* Depending on design, maybe just a title? */}
                        <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
                            <Activity size={20} fill="currentColor" />
                        </div>
                        <span className="font-bold text-slate-900 text-lg">MediTranslate</span>
                    </div>

                    <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
                        <Link href="/dashboard" className="hover:text-emerald-600">Dashboard</Link>
                        <Link href="/dashboard/history" className="hover:text-emerald-600">Scans</Link>
                        <Link href="/settings" className="text-emerald-600 font-bold">Settings</Link>
                        <Link href="/help" className="hover:text-emerald-600">Help</Link>

                        <Link href="/dashboard" className="px-5 py-2 bg-cyan-400 text-slate-900 font-bold rounded-lg hover:bg-cyan-300 transition-colors shadow-sm shadow-cyan-100">
                            New Scan
                        </Link>

                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                            {/* Avatar */}
                            <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">DS</div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-10 max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
