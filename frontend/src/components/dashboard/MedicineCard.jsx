"use client";
import React from 'react';
import { ShoppingCart, Pill, Activity } from 'lucide-react';

export default function MedicineCard({ medicine }) {
    // Generate a pseudo-random price for the mockup if not present
    const price = medicine.price || (Math.random() * (40 - 10) + 10).toFixed(2);
    const retailPrice = (parseFloat(price) * 1.4).toFixed(2);

    // Determine icon and badge based on medicine type/name (mock logic)
    const isInjection = medicine.name.toLowerCase().includes('injection') || medicine.name.toLowerCase().includes('sulfate');
    const isPill = !isInjection;

    const badgeText = isInjection ? "Low Stock" : "Available";
    const badgeColor = isInjection ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";
    const iconColor = isInjection ? "text-blue-500" : "text-emerald-600";
    const Icon = isInjection ? Activity : Pill; // Using Activity as proxy for Syringe/Injection if unavailable or Pill

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center ${iconColor}`}>
                    {medicine.name.includes("Sulfate") ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-syringe"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /></svg>
                        :
                        <Pill size={28} />
                    }
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-lg ${badgeColor}`}>
                    {badgeText}
                </span>
            </div>

            <div className="mb-4 flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">{medicine.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {medicine.usage || "Generic description available. Used to treat common symptoms."}
                </p>
            </div>

            <div className="pt-4 mt-auto">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-slate-900">${price}</span>
                    <span className="text-sm text-slate-400 line-through">${retailPrice}</span>
                </div>

                <a
                    href={medicine.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
                >
                    <ShoppingCart size={20} />
                    Buy Now
                </a>
            </div>
        </div>
    );
}
