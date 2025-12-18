"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Plus, Camera } from 'lucide-react';
import HistoryCarouselItem from '../../../components/dashboard/HistoryCarouselItem';

export default function HistoryPage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mock Data matching screenshot context
    const historyData = [
        {
            id: 1,
            name: "Amoxicillin 500mg",
            date: "Oct 24, 2023",
            time: "10:30 AM",
            status: "Translated",
            from: "FR",
            to: "EN",
            gradient: "from-yellow-100 to-yellow-600 bg-[#C8C278]" // Amoxicillin yellowish gradient
        },
        {
            id: 2,
            name: "Ibuprofen Gel",
            date: "Oct 20, 2023",
            time: "02:15 PM",
            status: "Translated",
            from: "ES",
            to: "EN",
            gradient: "from-blue-100 to-blue-400"
        },
        {
            id: 3,
            name: "Herbal Cough Syrup",
            date: "Oct 15, 2023",
            time: "09:00 AM",
            status: "Review",
            from: "DE",
            to: "EN",
            gradient: "from-green-700 to-green-900"
        },
        {
            id: 4,
            name: "Paracetamol 500mg",
            date: "Oct 12, 2023",
            time: "06:45 PM",
            status: "Translated",
            from: "FR",
            to: "EN",
            gradient: "from-orange-100 to-orange-200"
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === historyData.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? historyData.length - 1 : prev - 1));
    };

    return (
        <div className="space-y-8 flex flex-col min-h-[calc(100vh-140px)] pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Scan History</h1>
                    <p className="text-emerald-600 font-medium">Review your past translations one by one.</p>
                </div>
                <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-cyan-100 hover:bg-cyan-300 transition-colors">
                    <Camera size={20} />
                    New Scan
                </Link>
            </div>

            {/* Filter Bar - Simplified */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="relative w-96 max-w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by medicine name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    />
                </div>

                <div className="flex items-center gap-4 pr-2">
                    <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-700">
                        Date: All time
                        <ChevronDown size={16} className="text-slate-400" />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-emerald-600 transition-colors">
                        <Filter size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* CAROUSEL AREA */}
            <div className="flex-1 flex items-center justify-center relative">

                {/* Prev Button */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 xl:-left-12 z-10 w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:scale-110 transition-all hidden md:flex"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* Main Card */}
                <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500 key={currentIndex}">
                    <HistoryCarouselItem scan={historyData[currentIndex]} />
                </div>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className="absolute right-0 xl:-right-12 z-10 w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:scale-110 transition-all hidden md:flex"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Pagination Design */}
            <div className="flex items-center justify-between px-4 pb-4">
                <span className="text-slate-500 font-bold text-sm">
                    Showing result <span className="text-slate-900">{currentIndex + 1}</span> of {historyData.length}
                </span>

                <div className="flex gap-3">
                    {historyData.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-cyan-400 w-8' : 'bg-slate-200 hover:bg-slate-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
