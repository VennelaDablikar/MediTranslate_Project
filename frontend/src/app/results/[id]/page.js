"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Share2, Download, RefreshCw, Volume2, FileText, Pill, Languages, PlayCircle, StopCircle, CheckCircle } from 'lucide-react';

export default function ResultsPage({ params }) {
    const { id } = params;
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [isPlaying, setIsPlaying] = useState(false);

    // State for data
    const [data, setData] = useState(null);
    const [translatedData, setTranslatedData] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        if (id === 'uploaded') {
            const stored = localStorage.getItem('prescriptionData');
            if (stored) {
                setData(JSON.parse(stored));
            }
        } else {
            // Fallback for demo
            setData({
                id: id,
                date: '14 Dec 2025',
                imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Prescription+Image',
                doctor: 'Dr. John Smith',
                patient: user?.user_metadata?.full_name || 'Patient',
                confidence: 89,
                extractedText: "Patient: Srujana Sahu Niya\nAge: 24\nRx:\n1. Paracetamol 500mg - 1-0-1 (After Food)\n2. Azithromycin 500mg - 0-1-0 (After Food)\n3. Metformin 500mg - 1-0-1",
                medicines: [
                    { name: "Paracetamol", dosage: "500mg", type: "Tablet", usage: "Fever and pain relief", instruction: "Take after food", time: "Morning, Night" },
                    { name: "Azithromycin", dosage: "500mg", type: "Antibiotic", usage: "Bacterial infections", instruction: "Complete full course", time: "Afternoon" },
                    { name: "Metformin", dosage: "500mg", type: "Tablet", usage: "Blood sugar control", instruction: "Take with meals", time: "Morning, Night" }
                ]
            });
        }
    }, [id, user]);

    // Handle Translation
    const handleTranslate = async (targetLang = 'hi') => {
        if (!data || isTranslating) return;
        setIsTranslating(true);
        try {
            // We need to translate descriptions. 
            // For simplicity, we'll translate each medicine's usage and instruction

            const newMedicines = await Promise.all(data.medicines.map(async (med) => {
                const usageRes = await fetch('http://localhost:8000/translate/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: med.usage, target_lang: targetLang })
                });
                const usageData = await usageRes.json();

                const typeRes = await fetch('http://localhost:8000/translate/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: med.type, target_lang: targetLang })
                });
                const typeData = await typeRes.json();

                return {
                    ...med,
                    usage: usageData.translated_text,
                    type: typeData.translated_text
                };
            }));

            setTranslatedData({ ...data, medicines: newMedicines });
            setCurrentLang(targetLang);
        } catch (e) {
            console.error("Translation fail", e);
            alert("Translation failed");
        } finally {
            setIsTranslating(false);
        }
    };

    // Determine which data to show
    const displayData = (currentLang !== 'en' && translatedData) ? translatedData : data;

    if (!displayData) return <div className="p-8 text-center">Loading result...</div>; // Loading state

    const prescription = displayData;

    const handleSpeech = () => {
        setIsPlaying(!isPlaying);

        if (!isPlaying) {
            // Construct text from medicines
            const textToSpeak = prescription.medicines.map(med =>
                `${med.name}. ${med.type}. ${med.usage}. Instruction: ${med.instruction}.`
            ).join(' Next medicine: ');

            const utterance = new SpeechSynthesisUtterance(textToSpeak || "No medicines found to read.");
            // Set language if translated
            if (currentLang !== 'en') {
                utterance.lang = currentLang === 'hi' ? 'hi-IN' : currentLang;
            }

            window.speechSynthesis.speak(utterance);
            utterance.onend = () => setIsPlaying(false);
        } else {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-20 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-medium">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Save"><Download size={20} /></button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Share"><Share2 size={20} /></button>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Left Column: Image & OCR */}
                    <div className="space-y-6">
                        {/* Image Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Original Prescription</h3>
                                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{prescription.date}</span>
                            </div>
                            <div className="aspect-[3/4] bg-slate-100 relative">
                                <img
                                    src={prescription.imageUrl}
                                    alt="Prescription"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* OCR Text Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-500" /> Extracted Text
                                </h3>
                                <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                    {prescription.confidence}% Confidence
                                </span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-mono text-slate-700 whitespace-pre-line">
                                {prescription.extractedText}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Medicines & Analysis */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                <h2 className="text-xl font-bold mb-1">Analysis Results</h2>
                                <p className="text-blue-100 text-sm">3 medicines detected • English</p>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {prescription.medicines.map((med, index) => (
                                    <div key={index} className="p-6 hover:bg-slate-50 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Pill size={20} /></div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{med.name}</h3>
                                                    <p className="text-xs text-slate-500 font-medium">{med.dosage} • {med.type}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleSpeech()} className="text-slate-400 hover:text-blue-600 transition">
                                                <Volume2 size={20} />
                                            </button>
                                        </div>

                                        <div className="pl-12 space-y-2">
                                            <div className="text-slate-700 text-sm">
                                                <span className="font-semibold text-slate-900 block mb-1">Usage:</span>
                                                {med.usage}
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <span className="text-xs font-medium px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md">
                                                    ⚠️ {med.instruction}
                                                </span>
                                                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                                    🕒 {med.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    <PlayCircle size={18} /> Listen to AlI
                                </button>
                                <button
                                    onClick={() => handleTranslate('hi')}
                                    disabled={isTranslating}
                                    className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center gap-2"
                                    title="Translate to Hindi"
                                >
                                    <Languages size={18} /> {isTranslating ? '...' : (currentLang === 'hi' ? 'Show English' : 'Translate (Hindi)')}
                                </button>
                                <button className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center gap-2" title="Retry">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
