"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Search, FileText, Eye, Share2, Trash2 } from 'lucide-react';

export default function HistoryPage() {
    const { user } = useAuth();

    const history = [
        { id: 1, date: '14 December 2025', medicines: ['Paracetamol', 'Azithromycin', 'Metformin'], count: 3, confidence: 92 },
        { id: 2, date: '10 December 2025', medicines: ['Amlodipine', 'Aspirin'], count: 2, confidence: 88 },
        { id: 3, date: '05 December 2025', medicines: ['Ibuprofen', 'Cetirizine', 'Ranitidine', 'Amoxicillin'], count: 4, confidence: 95 },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800"> Prescription History</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition">
                        <div className="flex gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 h-fit">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{item.date}</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    💊 {item.count} Medicines: {item.medicines.join(', ')}
                                </p>
                                <p className="text-xs text-green-600 font-medium mt-2 bg-green-50 w-fit px-2 py-1 rounded">
                                    Confidence: {item.confidence}%
                                </p>
                            </div>
                        </div>

                        <div className="flex md:flex-col justify-end gap-2 shrink-0">
                            <Link href={`/results/${item.id}`} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                                <Eye size={16} /> View
                            </Link>
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                                    <Share2 size={16} /> Share
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-200 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
