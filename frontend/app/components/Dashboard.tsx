"use client";

import React from "react";
import Link from "next/link";
import HeroSection from "./HeroSection";
import AnalysisCard from "./AnalysisCard";
import { Pill, FlaskConical, ArrowRight } from "lucide-react";
import { PrescriptionResponse } from "../types/api";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "./Skeleton";

interface DashboardProps {
    onAnalysisStart: () => void;
    onAnalysisComplete: (data: PrescriptionResponse) => void;
    isAnalyzing: boolean;
    targetLanguage: string;
    setTargetLanguage: (lang: string) => void;
}

export default function Dashboard({
    onAnalysisStart,
    onAnalysisComplete,
    isAnalyzing,
    targetLanguage,
    setTargetLanguage
}: DashboardProps) {

    // Dummy data for visual matching with the screenshot if actual results aren't there yet
    // Or we can just use this structure to hold the "Recent Analysis" section.
    // In the screenshot, "Recent Analysis" seems to be history items, not necessarily the *current* result.
    // For now, I'll hardcode the items from the screenshot as "Recent Analysis".

    const { user } = useAuth();
    const [scans, setScans] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadScans() {
            if (!user) return;
            try {
                const { fetchUserScans } = await import("../services/api");
                const data = await fetchUserScans(user.id);
                setScans(data || []);
            } catch (error) {
                console.error("Failed to load scans", error);
            } finally {
                setLoading(false);
            }
        }
        loadScans();
    }, [user]);

    // Map scans to the display format
    const recentItems = scans.map(scan => {
        const drug = scan.results.drug_candidates?.[0]; // Get the first drug
        return {
            name: drug?.drug || "Unknown Medication",
            description: drug?.description || drug?.category || "No description available",
            price: (drug?.score ? (10 + (drug.score % 50)).toFixed(2) : "0.00"), // Dynamic fallback price
            stockStatus: "IN STOCK" as const, // Placeholder logic for now
            icon: <Pill size={24} className="text-blue-500" />
        };
    }).slice(0, 3); // Show top 3

    return (
        <div className="animate-in fade-in duration-500">
            {/* 1. Dashboard specific styling for Hero (Scanner) */}
            {/* The screenshot shows a lighter background maybe? Or just the same. 
                HeroSection has its own max-width and internal styling. 
                We might need to adjust HeroSection to accept fewer paddings if needed, 
                but based on image it looks spacious.
            */}

            <HeroSection
                onAnalysisStart={onAnalysisStart}
                onAnalysisComplete={onAnalysisComplete}
                isAnalyzing={isAnalyzing}
                targetLanguage={targetLanguage}
                setTargetLanguage={setTargetLanguage}
            />

            {/* 2. Recent Analysis Text & Link */}
            <div className="max-w-7xl mx-auto px-8 mt-4 mb-6 flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Recent Analysis</h3>
                    <p className="text-slate-500 text-sm mt-1">Structured data from your latest medical scans.</p>
                </div>
                <Link href="/history" className="text-teal-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    View Full History <ArrowRight size={16} />
                </Link>
            </div>

            {/* 3. Grid for Cards */}
            <div className="max-w-7xl mx-auto px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {loading ? (
                        // Skeleton Loaders
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-full space-y-4">
                                <div className="flex items-start justify-between">
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                </div>
                                <div className="pt-4 mt-auto">
                                    <Skeleton className="h-8 w-1/3 rounded-lg" />
                                </div>
                            </div>
                        ))
                    ) : recentItems.length > 0 ? (
                        recentItems.map((item, idx) => (
                            <AnalysisCard
                                key={idx}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                stockStatus={item.stockStatus}
                                icon={item.icon}
                                targetLanguage={targetLanguage}
                            />
                        ))
                    ) : (
                        <div className="col-span-full bg-slate-100 rounded-3xl p-12 text-center border border-dashed border-slate-300">
                            <div className="mx-auto w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                <FlaskConical size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">No Recent Scans</h3>
                            <p className="text-slate-400 text-sm mt-1">Upload a prescription above to see results here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
