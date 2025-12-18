"use client";

import Navbar from "../components/Navbar";
import AnalysisCard from "../components/AnalysisCard";
import { Pill, Tablet, FlaskConical, Syringe, MoreHorizontal } from "lucide-react";

export default function HistoryPage() {
    // Real history integration pending
    // For now, we show an empty state as requested
    const historyItems: any[] = [];

    return (
        <main className="min-h-screen bg-[#ecfeff] text-foreground font-sans selection:bg-teal-100 pb-20">
            <Navbar />

            <section className="max-w-7xl mx-auto px-8 mt-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Scan History
                        </h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium">
                            Structured data from your past medical scans.
                        </p>
                    </div>

                    {/* Filter/More options placeholder */}
                    <button className="text-gray-400 hover:text-teal-900 transition-colors">
                        <MoreHorizontal size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {historyItems.length > 0 ? (
                        historyItems.map((item) => (
                            <div key={item.id} className="relative group h-full">
                                <AnalysisCard
                                    icon={item.icon}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    stockStatus={item.stockStatus as any}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                                <FlaskConical className="text-teal-200" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No History Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-2">
                                You haven't scanned any prescriptions yet. Go to the dashboard to start a new session.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
