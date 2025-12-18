"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Calendar, Search, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "../components/Skeleton";

export default function HistoryPage() {
    const { user } = useAuth();
    const [scans, setScans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
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

    const filteredScans = scans.filter(scan =>
        scan.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.results.drug_candidates?.some((d: any) => d.drug.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (

        <main className="min-h-screen bg-background text-foreground font-sans pb-20">
            <Navbar />

            <section className="max-w-7xl mx-auto px-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Scan History
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1 font-medium">
                            View and manage your past prescription analyses.
                        </p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search patients or drugs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    </div>
                </div>

                <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full hidden md:block" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <Skeleton className="h-8 w-24 rounded-full hidden md:block" />
                                </div>
                            ))}
                        </div>
                    ) : filteredScans.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="p-6 font-bold text-xs text-muted-foreground uppercase tracking-wider">Date</th>
                                            <th className="p-6 font-bold text-xs text-muted-foreground uppercase tracking-wider">Patient Name</th>
                                            <th className="p-6 font-bold text-xs text-muted-foreground uppercase tracking-wider">Medications Found</th>
                                            <th className="p-6 font-bold text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                                            <th className="p-6 font-bold text-xs text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredScans.map((scan) => {
                                            const drugCount = scan.results.drug_candidates?.length || 0;
                                            const topDrug = scan.results.drug_candidates?.[0]?.drug || "Unknown Drug";

                                            return (
                                                <tr key={scan.id} className="hover:bg-muted/50 transition-colors group">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                                            <Calendar size={16} className="text-muted-foreground" />
                                                            {new Date(scan.created_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                                {(scan.patient_name || "U")[0].toUpperCase()}
                                                            </div>
                                                            {scan.patient_name || "Unknown Patient"}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="block">
                                                            <span className="text-foreground font-bold text-sm block">{topDrug}</span>
                                                            {drugCount > 1 && (
                                                                <span className="text-xs text-muted-foreground font-medium">
                                                                    + {drugCount - 1} more items
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                            Completed
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <a href={`/history/${scan.id}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary font-bold text-sm justify-end transition-colors cursor-pointer">
                                                            View Details
                                                        </a>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-border">
                                {filteredScans.map((scan) => {
                                    const drugCount = scan.results.drug_candidates?.length || 0;
                                    const topDrug = scan.results.drug_candidates?.[0]?.drug || "Unknown Drug";
                                    return (
                                        <div key={scan.id} className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                        {(scan.patient_name || "U")[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground text-sm">{scan.patient_name || "Unknown Patient"}</p>
                                                        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-0.5">
                                                            <Calendar size={12} />
                                                            {new Date(scan.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                    Completed
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Medication</span>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-foreground font-bold text-sm block">{topDrug}</span>
                                                        {drugCount > 1 && (
                                                            <span className="text-xs text-muted-foreground font-medium">
                                                                + {drugCount - 1} more items
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <a href={`/history/${scan.id}`} className="w-full flex items-center justify-center gap-2 bg-muted/50 text-foreground font-bold text-sm py-2.5 rounded-xl hover:bg-muted transition-colors">
                                                    View Details
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 mx-auto">
                                <FileText className="text-muted-foreground" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">No History Found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                Your scan history will appear here once you start analyzing prescriptions.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
