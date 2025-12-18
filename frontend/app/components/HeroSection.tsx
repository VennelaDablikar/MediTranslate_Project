"use client";

import React, { useRef, useState } from "react";
import { CloudUpload, ScanLine, ArrowRight, Loader2 } from "lucide-react";
import { uploadPrescription } from "../services/api";
import { PrescriptionResponse } from "../types/api";

interface HeroSectionProps {
    onAnalysisStart: () => void;
    onAnalysisComplete: (data: PrescriptionResponse) => void;
    isAnalyzing: boolean;
    targetLanguage: string;
    setTargetLanguage: (lang: string) => void;
}

export default function HeroSection({
    onAnalysisStart,
    onAnalysisComplete,
    isAnalyzing,
    targetLanguage,
    setTargetLanguage
}: HeroSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            await processFile(event.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        try {
            onAnalysisStart();
            const data = await uploadPrescription(file);
            onAnalysisComplete(data);
        } catch (error) {
            console.error("Analysis failed:", error);
            // Ideally expose error to user here
            alert("Failed to analyze prescription. Please try again.");
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 px-8 max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    AI-Powered Analysis
                </div>

                <h1 className="text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                    Scan & <br />
                    <span className="text-primary">Translate</span> <br />
                    Medication
                </h1>

                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                    Instantly digitize and translate medical records with AI precision.
                    Upload your prescription or medication packaging to get detailed
                    insights, pricing, and purchase options.
                </p>

                <div className="bg-card p-2 rounded-2xl shadow-lg shadow-teal-900/5 max-w-xl transition-all hover:shadow-xl border border-border">
                    <div className="flex items-center gap-4 p-2">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1 ml-2">
                                Translate From
                            </label>
                            <select className="w-full bg-muted border-none rounded-lg p-3 text-sm font-semibold text-foreground focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-muted/80 transition-colors">
                                <option>Auto-Detect</option>
                                <option>English</option>
                            </select>
                        </div>

                        <ArrowRight className="text-muted-foreground" size={20} />

                        <div className="flex-1">
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1 ml-2">
                                Translate To
                            </label>
                            <select
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                className="w-full bg-muted border-none rounded-lg p-3 text-sm font-semibold text-foreground focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-muted/80 transition-colors"
                            >
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Telugu</option>
                                <option>Tamil</option>
                                <option>Kannada</option>
                                <option>Malayalam</option>
                                <option>Marathi</option>
                                <option>Gujarati</option>
                                <option>Bengali</option>
                                <option>Punjabi</option>
                                <option>Urdu</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                        className="w-full mt-2 bg-primary text-primary-foreground p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <ScanLine className="group-hover:scale-110 transition-transform" />
                        )}
                        {isAnalyzing ? "Analyzing..." : "Start Scanning"}
                    </button>
                </div>
            </div>

            {/* Right Content - Upload Card */}
            <div className="relative">
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform -translate-y-4"></div>

                <div
                    className={`relative bg-card rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/10 border-4 backdrop-blur-sm transition-all overflow-hidden ${dragActive ? 'border-primary bg-primary/5' : 'border-card dark:border-muted'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {/* Scanning Animation Overlay */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_20px_rgba(20,184,166,0.5)] animate-scan"></div>
                            <div className="absolute inset-0 bg-teal-500/5"></div>
                        </div>
                    )}

                    <div
                        className="border-2 border-dashed border-border rounded-[2rem] p-12 flex flex-col items-center justify-center text-center space-y-6 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group h-80 relative z-10"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                        />

                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {isAnalyzing ? (
                                <Loader2 className="text-primary w-10 h-10 animate-spin" />
                            ) : (
                                <CloudUpload className="text-primary w-10 h-10" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-foreground">
                                {isAnalyzing ? "Analyzing Request..." : "Drop File Here"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                PDF, JPG, PNG, DICOM supported
                            </p>
                        </div>

                        <button className="px-6 py-2 bg-muted text-foreground font-semibold rounded-full text-sm hover:bg-muted/80 transition-colors">
                            Browse Files
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
