"use client";
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">MediTranslate</h1>
                <p className="text-xl text-slate-600 mb-8">Medical Suite Dashboard Restored.</p>

                <Link
                    href="/dashboard"
                    className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all"
                >
                    Enter Dashboard →
                </Link>
            </div>
        </div>
    )
}
