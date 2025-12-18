"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PublicHeader from "./components/PublicHeader";
import LandingHero from "./components/LandingHero";
import FeaturesSection from "./components/FeaturesSection";
import ScannerSection from "./components/ScannerSection";
import AnalysisCard from "./components/AnalysisCard";
import Dashboard from "./components/Dashboard";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import { Pill, AlertCircle, ShoppingCart, ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { PrescriptionResponse, DrugCandidate } from "./types/api";

import { useAuth } from "./context/AuthContext";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PrescriptionResponse | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("English");

  const { user, loading } = useAuth();
  const isLoggedIn = !!user;

  // Sync targetLanguage with user preference
  useEffect(() => {
    if (user?.user_metadata?.preferred_language) {
      setTargetLanguage(user.user_metadata.preferred_language);
    }
  }, [user]);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setResults(null);
  };

  const handleAnalysisComplete = async (data: PrescriptionResponse, file?: File) => {
    setIsAnalyzing(false);
    setResults(data);

    if (user) {
      try {
        const { saveScanToSupabase } = await import("./services/api");
        await saveScanToSupabase(user.id, data, file);
      } catch (error) {
        console.error("Failed to auto-save scan:", error);
      }
    }
  };

  // Helper to generate a placeholder price for demo purposes
  const getDemoPrice = (score: number = 0) => {
    return (10 + (score % 50)).toFixed(2);
  };

  const handleExportPDF = async () => {
    if (!results) return;

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
      doc.text(`Patient Name: ${results.patient_name || "Unknown"}`, 14, 32);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
      doc.text(`Language: ${targetLanguage}`, 14, 44);

      // Table
      const tableData = results.drug_candidates.map(drug => [
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

      doc.save(`MediTranslate_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (results) {
    return (
      <main className="min-h-screen bg-background font-sans">
        {/* Navbar only visible if logged in, otherwise Show PublicHeader */}
        {isLoggedIn ? <Navbar /> : <PublicHeader />}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="mb-8">
            <button
              onClick={() => setResults(null)}
              className="group flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors mb-6"
            >
              <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
              Back to Scanner
            </button>

            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Analysis Results
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                  Found {results.drug_candidates.length} medications for {results.patient_name || "Unknown Patient"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-card border border-border text-foreground font-bold rounded-lg hover:bg-muted transition-colors shadow-sm"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {results.drug_candidates.map((drug, index) => (
              <AnalysisCard
                key={index}
                icon={<Pill size={24} />}
                name={drug.drug}
                description={drug.description || drug.category || "No description available."}
                price={getDemoPrice(drug.score)}
                stockStatus={index % 2 === 0 ? "IN STOCK" : "LOW STOCK"}
                targetLanguage={targetLanguage}
              />
            ))}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-background font-sans">
        <Navbar />
        {/* Pass down props to Dashboard so the scanner works */}
        <Dashboard
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
          isAnalyzing={isAnalyzing}
          targetLanguage={targetLanguage}
          setTargetLanguage={setTargetLanguage}
        />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <PublicHeader />

      {/* 1. Marketing Hero */}
      <LandingHero />

      {/* 2. Features Grid */}
      <FeaturesSection />

      {/* 3. The Functional Scanner ("How it Works") */}
      <div id="scanner">
        <ScannerSection
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
          isAnalyzing={isAnalyzing}
          targetLanguage={targetLanguage}
          setTargetLanguage={setTargetLanguage}
        />
      </div>

      {/* 5. CTA Section */}
      <CTASection />

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}
