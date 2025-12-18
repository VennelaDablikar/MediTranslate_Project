"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HistoryCard({ scan }) {
    // Status Badge Logic
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'translated': return 'bg-emerald-100 text-emerald-800';
            case 'review': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-orange-100 text-orange-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-full">
            {/* Image Section */}
            <div className="h-48 bg-slate-100 relative overflow-hidden">
                {/* Mock Image Gradient placeholders if no image provided */}
                <div className={`w-full h-full bg-gradient-to-br ${scan.gradient || 'from-slate-200 to-slate-300'}`}></div>

                {/* Status Badge */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(scan.status)}`}>
                    {scan.status}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{scan.name}</h3>
                <p className="text-xs text-slate-500 mb-6">{scan.date} • {scan.time}</p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <span>{scan.from}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                        <span>{scan.to}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
