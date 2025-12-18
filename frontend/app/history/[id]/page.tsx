"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../services/supabase";
import AnalysisCard from "../../components/AnalysisCard";
import { ArrowLeft, Pill, User, Calendar, FlaskConical } from "lucide-react";
import { PrescriptionResponse } from "../../types/api";

interface ScanEntry {
    id: string;
    created_at: string;
    patient_name: string;
    results: PrescriptionResponse;
}

export default function HistoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [scan, setScan] = useState<ScanEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScan() {
            if (!params.id) return;

            const { data, error } = await supabase
                .from('scans')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) {
                console.error("Error fetching scan:", error);
                // Optionally redirect to history if not found
            } else {
                setScan(data);
            }
            setLoading(false);
        }
        fetchScan();
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-400">Loading details...</div>
            </main>
        );
    }

    if (!scan) {
        return (
            <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <h1 className="text-xl font-bold text-slate-800">Scan not found</h1>
                <button onClick={() => router.back()} className="text-teal-600 font-bold hover:underline">
                    Go Back
                </button>
            </main>
        );
    }

    const handleExportPDF = async () => {
        try {
            const jsPDF = (await import("jspdf")).default;
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF();

            // Title
            doc.setFontSize(20);
            doc.setTextColor(13, 148, 136); // Teal color
            doc.text("MediTranslate Analysis Report", 14, 22);

            // Metadata
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Patient Name: ${scan.patient_name || "Unknown"}`, 14, 32);
            doc.text(`Date: ${new Date(scan.created_at).toLocaleDateString()}`, 14, 38);
            doc.text(`Analysis ID: ${scan.id.slice(0, 8)}`, 14, 44);

            // Table
            const tableData = scan.results.drug_candidates.map((drug: any) => [
                drug.drug,
                drug.category || "N/A",
                drug.dosages?.join(", ") || "-",
                drug.frequencies?.join(", ") || "-"
            ]);

            autoTable(doc, {
                head: [['Medication', 'Category', 'Dosage', 'Frequency']],
                body: tableData,
                startY: 50,
                theme: 'grid',
                headStyles: { fillColor: [13, 148, 136] },
                styles: { fontSize: 10, cellPadding: 3 },
            });

            doc.save(`MediTranslate_Report_${scan.created_at.split('T')[0]}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    return (

        <main className="min-h-screen bg-background font-sans pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-8 mt-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 font-bold text-sm transition-colors"
                >
                    <ArrowLeft size={16} /> Back to History
                </button>

                <div className="bg-card rounded-3xl border border-border shadow-sm p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Prescription Analysis
                            </h1>
                            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-primary" />
                                    {scan.patient_name || "Unknown Patient"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    {new Date(scan.created_at).toLocaleDateString()} at {new Date(scan.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-xs font-bold uppercase tracking-wide">
                                Completed
                            </span>
                            <button
                                onClick={handleExportPDF}
                                className="px-4 py-2 bg-card border border-border text-foreground font-bold rounded-lg hover:bg-muted transition-colors shadow-sm text-sm"
                            >
                                Export PDF
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <FlaskConical className="text-primary" />
                            Detected Medications
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {scan.results.drug_candidates?.map((drug, index) => (
                                <AnalysisCard
                                    key={index}
                                    icon={<Pill size={24} />}
                                    name={drug.drug}
                                    description={drug.description || drug.category || "No description available."}
                                    price={(drug.score ? (10 + (drug.score % 50)).toFixed(2) : "0.00")} // Consistent demo price logic
                                    stockStatus="IN STOCK" // Placeholder
                                // You can pass the original target language if stored, otherwise defaults to English
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
