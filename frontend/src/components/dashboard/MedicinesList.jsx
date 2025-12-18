"use client";
import React from 'react';
import { Pill, ArrowRight, Clock } from 'lucide-react';

export default function MedicinesList({ medicines = [] }) {
    if (!medicines || medicines.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Pill size={32} />
                </div>
                <h3 className="text-slate-900 font-bold mb-1">No Medicines Yet</h3>
                <p className="text-slate-500 text-sm">Upload a prescription to see extracted medicines here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wider text-xs">Medicines</h3>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={14} />
                </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {medicines.map((med, idx) => (
                    <div key={idx} className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-md hover:bg-white transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Pill size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">{med.name}</h4>
                            <p className="text-xs text-slate-500 mb-2 truncate">{med.dosage} • {med.type}</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wide">
                                    {med.instruction || "As directed"}
                                </span>
                                <span className="text-sm font-bold text-slate-900">${med.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
