"use client";
import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';


export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* 1. Fixed Sidebar */}
            <Sidebar />

            {/* 2. Main Content Area */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">


                <div className="flex-1 p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
