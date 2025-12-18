"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface ScannerSectionProps {
    onAnalysisStart: () => void;
    onAnalysisComplete: (data: any, file?: File) => void;
    isAnalyzing: boolean;
    targetLanguage: string;
    setTargetLanguage: (lang: string) => void;
}

import { useRef, useState } from "react";
import { CloudUpload, ScanLine, Loader2 } from "lucide-react";
import { uploadPrescription } from "../services/api";

export default function ScannerSection({
    onAnalysisStart,
    onAnalysisComplete,
    isAnalyzing,
    targetLanguage,
    setTargetLanguage
}: ScannerSectionProps) {
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
            const data = await uploadPrescription(file, targetLanguage);
            onAnalysisComplete(data, file);
        } catch (error) {
            console.error("Analysis failed:", error);
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

    const steps = [
        {
            num: "1",
            title: "Upload Document",
            desc: "Take a photo or upload a PDF of the medical record."
        },
        {
            num: "2",
            title: "Select Language",
            desc: "Choose from 40+ languages for instant translation."
        },
        {
            num: "3",
            title: "Review & Export",
            desc: "Get a side-by-side view and export as a secure PDF."
        }
    ];

    return (
        <section className="py-24 bg-[#ecfeff]/30 border-y border-teal-100/50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side: Steps */}
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-12 tracking-tight">
                            How MediTranslate Works
                        </h2>

                        <div className="space-y-10">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-6">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-700/20">
                                        {step.num}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-slate-500 leading-relaxed font-medium">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-10 flex items-center gap-2 text-teal-600 font-bold hover:gap-3 transition-all">
                            Start a translation <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Right Side: The Functional Scanner */}
                    <div className="relative">
                        {/* Decorative dotted border */}
                        <div className="absolute -inset-4 border-2 border-dashed border-slate-200 rounded-[2.5rem] -z-10"></div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50">
                            <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                                Try it out right now
                            </h3>

                            {/* Language Selector in Scanner */}
                            <div className="mb-6 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Translate To</label>
                                    <select
                                        value={targetLanguage}
                                        onChange={(e) => setTargetLanguage(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm font-bold text-slate-700 cursor-pointer"
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

                            {/* Dropzone */}
                            <div
                                className={`relative border-3 border-dashed rounded-3xl h-64 flex flex-col items-center justify-center text-center p-8 transition-all cursor-pointer overflow-hidden ${dragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {/* Scanning Animation Overlay */}
                                {isAnalyzing && (
                                    <div className="absolute inset-0 z-20 pointer-events-none">
                                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_20px_rgba(20,184,166,0.5)] animate-scan"></div>
                                        <div className="absolute inset-0 bg-teal-500/5"></div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                />

                                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-600 relative z-10">
                                    {isAnalyzing ? (
                                        <Loader2 className="animate-spin w-8 h-8" />
                                    ) : (
                                        <CloudUpload className="w-8 h-8" />
                                    )}
                                </div>

                                <p className="text-slate-500 font-medium relative z-10">
                                    {isAnalyzing ? "Processing..." : "Drop your file here to test"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
