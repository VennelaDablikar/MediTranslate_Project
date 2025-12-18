"use client";
import React from 'react';
import { Share2, Bookmark, CheckCircle, ArrowRight, Camera, Pill, Activity } from 'lucide-react';

export default function HistoryCarouselItem({ scan }) {
    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-100 flex flex-col lg:flex-row min-h-[600px] w-full max-w-6xl mx-auto">
            {/* LEFT: IMAGE SECTION */}
            <div className={`lg:w-1/2 relative p-8 flex flex-col justify-between bg-gradient-to-br ${scan.gradient}`}>
                {/* Top Badge */}
                <span className="self-start px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm z-10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {scan.status} Successfully
                </span>

                {/* Central Image Placeholder - Mimicking the 3D Box */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl skew-y-6 rotate-[-6deg] flex items-center justify-center">
                        <Pill size={80} className="text-white drop-shadow-md opacity-80" />
                    </div>
                </div>

                {/* Bottom Source Info */}
                <div className="text-white z-10">
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-2">SOURCE IMAGE</p>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Camera size={18} />
                        Captured via Mobile Camera
                    </div>
                </div>
            </div>

            {/* RIGHT: DETAILS SECTION */}
            <div className="lg:w-1/2 p-10 flex flex-col relative">

                {/* Header: Date & Actions */}
                <div className="flex justify-between items-start mb-6">
                    <p className="text-slate-400 font-bold text-sm">
                        {scan.date} • {scan.time}
                    </p>
                    <div className="flex gap-4 text-slate-300">
                        <Bookmark className="hover:text-emerald-500 cursor-pointer transition-colors" size={24} />
                        <Share2 className="hover:text-emerald-500 cursor-pointer transition-colors" size={24} />
                    </div>
                </div>

                {/* Title & Category */}
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-3">{scan.name}</h2>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-lg">
                        <Pill size={20} fill="currentColor" className="text-emerald-500/20" />
                        <span>Antibiotic • Capsule</span>
                    </div>
                </div>

                {/* Translation Flow & Match */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="px-6 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 font-bold text-slate-700">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase">FROM</span>
                            <span>French (FR)</span>
                        </div>
                        <ArrowRight size={18} className="text-slate-300" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase">TO</span>
                            <span>English (EN)</span>
                        </div>
                    </div>

                    <div className="px-4 py-3 bg-green-50 rounded-xl text-green-700 font-bold flex items-center gap-2 border border-green-100">
                        <CheckCircle size={18} fill="currentColor" className="text-green-500/20" />
                        98% Match
                    </div>
                </div>

                {/* Detected Info Box */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex-1">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">DETECTED INFORMATION</p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        Detected text indicates this is an antibiotic medication used to treat bacterial infections.
                        The label contains instructions for dosage and warnings about allergic reactions.
                    </p>
                    <p className="text-slate-500 italic font-medium">
                        "Take one capsule three times a day with a full glass of water."
                    </p>
                </div>

                {/* Action Button */}
                <button className="w-full py-4 bg-cyan-400 text-slate-900 rounded-xl font-bold text-lg shadow-lg shadow-cyan-200 hover:bg-cyan-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    View Scan Details <ArrowRight size={20} />
                </button>

            </div>
        </div>
    );
}
