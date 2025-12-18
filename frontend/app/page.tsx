"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AnalysisCard from "./components/AnalysisCard";
import DoctorCard from "./components/DoctorCard";
import { Pill, AlertCircle, ShoppingCart, ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { PrescriptionResponse, DrugCandidate } from "./types/api";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PrescriptionResponse | null>(null);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setResults(null);
  };

  const handleAnalysisComplete = (data: PrescriptionResponse) => {
    setIsAnalyzing(false);
    setResults(data);
  };

  // Helper to generate a placeholder price for demo purposes
  const getDemoPrice = (score: number = 0) => {
    return (10 + (score % 50)).toFixed(2);
  };

  return (
    <main className="min-h-screen bg-[#ecfeff] text-foreground font-sans selection:bg-teal-100 pb-20">
      <Navbar />

      <HeroSection
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        isAnalyzing={isAnalyzing}
      />

      <section className="max-w-7xl mx-auto px-8 mt-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {results ? "Analysis Results" : "Recent Analysis"}
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              {results
                ? `Found ${results.drug_candidates.length} medications for ${results.patient_name || "Unknown Patient"}`
                : "Structured data from your latest medical scans."}
            </p>
          </div>
          <Link
            href="#"
            className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all hover:text-teal-900"
          >
            View Full History <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {results ? (
            // Render API Results
            results.drug_candidates.map((drug, index) => (
              <AnalysisCard
                key={index}
                icon={<Pill size={24} />}
                name={drug.drug}
                description={drug.description || drug.category || "No description available."}
                price={getDemoPrice(drug.score)}
                // Mocking stock status randomly for demo
                stockStatus={index % 2 === 0 ? "IN STOCK" : "LOW STOCK"}
              />
            ))
          ) : (
            // Empty State
            <div className="col-span-full md:col-span-2 flex flex-col items-center justify-center p-12 bg-white/50 rounded-3xl border-2 border-dashed border-teal-100 text-center">
              <div className="p-4 bg-teal-50 rounded-full mb-4">
                <AlertCircle className="text-teal-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No Recent Analysis</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
                Upload a prescription above to see detailed medication analysis here.
              </p>
            </div>
          )}

          <DoctorCard />
        </div>
      </section>
    </main>
  );
}
