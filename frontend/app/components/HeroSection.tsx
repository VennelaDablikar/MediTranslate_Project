"use client";

import React, { useRef, useState } from "react";
import { CloudUpload, ScanLine, ArrowRight, Loader2 } from "lucide-react";
import { uploadPrescription } from "../services/api";
import { PrescriptionResponse } from "../types/api";

interface HeroSectionProps {
    onAnalysisStart: () => void;
    onAnalysisComplete: (data: PrescriptionResponse) => void;
    isAnalyzing: boolean;
}

export default function HeroSection({ onAnalysisStart, onAnalysisComplete, isAnalyzing }: HeroSectionProps) {
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

                <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                    Instantly digitize and translate medical records with AI precision.
                    Upload your prescription or medication packaging to get detailed
                    insights, pricing, and purchase options.
                </p>

                <div className="bg-white p-2 rounded-2xl shadow-lg shadow-teal-900/5 max-w-xl transition-all hover:shadow-xl">
                    <div className="flex items-center gap-4 p-2">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-2">
                                Translate From
                            </label>
                            <select className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-slate-100 transition-colors">
                                <option>Auto-Detect</option>
                                <option>English</option>
                            </select>
                        </div>

                        <ArrowRight className="text-gray-300" size={20} />

                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-2">
                                Translate To
                            </label>
                            <select className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-slate-100 transition-colors">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>Hindi</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                        className="w-full mt-2 bg-primary text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-teal-900 transition-colors group disabled:opacity-70 disabled:cursor-not-allowed"
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
                    className={`relative bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/10 border-4 backdrop-blur-sm transition-all ${dragActive ? 'border-primary bg-teal-50' : 'border-white/50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div
                        className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center space-y-6 hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer group h-80"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                        />

                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                            <p className="text-sm text-gray-400">
                                PDF, JPG, PNG, DICOM supported
                            </p>
                        </div>

                        <button className="px-6 py-2 bg-slate-100 text-teal-900 font-semibold rounded-full text-sm hover:bg-teal-100 transition-colors">
                            Browse Files
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
