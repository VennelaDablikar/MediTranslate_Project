"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Camera, FileText, Loader2, Play } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const { user, loading } = useAuth();
    const { language, setLanguage } = useLanguage();
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessing(true);

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Call Backend API
                const response = await fetch('http://localhost:8000/ocr/extract', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Extraction Failed");
                }

                const data = await response.json();

                // Convert image to blob url for display
                const imageUrl = URL.createObjectURL(file);

                // Store in localStorage for Results page to pick up
                localStorage.setItem('prescriptionData', JSON.stringify({
                    id: 'uploaded',
                    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    imageUrl: imageUrl,
                    doctor: 'Dr. (Not Detected)',
                    patient: data.patient_name || 'Patient',
                    confidence: 95, // Mock confidence or derive from data
                    extractedText: data.raw_ocr_text,
                    medicines: data.drug_candidates.map(drug => ({
                        name: drug.drug,
                        dosage: Array.isArray(drug.dosages) ? drug.dosages.join(', ') : drug.dosages, // Handle missing/array
                        type: drug.category || 'Medicine',
                        usage: drug.description || 'No description available',
                        instruction: drug.frequencies ? (Array.isArray(drug.frequencies) ? drug.frequencies.join(', ') : drug.frequencies) : 'As directed',
                        time: 'See instruction'
                    }))
                }));

                router.push('/results/uploaded?tab=ocr');

            } catch (error) {
                console.error("Upload failed", error);
                alert("Upload failed: " + error.message);
                setIsProcessing(false);
            }
        }
    };

    const onDrop = async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];

        if (file) {
            setIsProcessing(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:8000/ocr/extract', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error("Extraction Failed");

                const data = await response.json();
                const imageUrl = URL.createObjectURL(file);

                localStorage.setItem('prescriptionData', JSON.stringify({
                    id: 'uploaded',
                    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    imageUrl: imageUrl,
                    doctor: 'Dr. (Not Detected)',
                    patient: data.patient_name || 'Patient',
                    confidence: 95,
                    extractedText: data.raw_ocr_text,
                    medicines: data.drug_candidates.map(drug => ({
                        name: drug.drug,
                        dosage: Array.isArray(drug.dosages) ? drug.dosages.join(', ') : drug.dosages,
                        type: drug.category || 'Medicine',
                        usage: drug.description || 'No description available',
                        instruction: drug.frequencies ? (Array.isArray(drug.frequencies) ? drug.frequencies.join(', ') : drug.frequencies) : 'As directed',
                        time: 'See instruction'
                    }))
                }));

                router.push('/results/uploaded?tab=ocr');
            } catch (error) {
                console.error("Upload failed", error);
                alert("Upload failed: " + error.message);
                setIsProcessing(false);
            }
        }
    };

    const languages = [
        { code: 'english', name: 'English', flag: '🇬🇧' },
        { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
        { code: 'telugu', name: 'Telugu', flag: '🇮🇳' }
    ];

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 1. Language Selector */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Select Your Language / अपनी भाषा चुनें</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${language === lang.code
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-200'
                                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-bold">{lang.name}</span>
                            {language === lang.code && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Upload Section */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 min-h-[500px] flex flex-col items-center justify-center p-8 relative">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Upload Prescription</h1>
                <p className="text-slate-500 mb-8 text-center max-w-lg">
                    Drag and drop your prescription image here, or use the buttons below to browse or take a photo.
                </p>

                <div
                    className={`w-full max-w-2xl border-3 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 ${isDragOver ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-200 bg-slate-50 hover:border-blue-400'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={onDrop}
                >
                    {isProcessing ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in">
                            <Loader2 size={64} className="text-blue-600 animate-spin mb-6" />
                            <p className="text-xl font-semibold text-slate-700">Processing Prescription...</p>
                            <p className="text-slate-500 mt-2">Extracting text and verifying medicines</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-6 text-blue-600">
                                <Upload size={40} strokeWidth={2.5} />
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center w-full">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <FileText size={20} /> Browse File
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />

                                <button className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <Camera size={20} /> Take Photo
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-200 w-full flex justify-center">
                                <Link href="/results/demo?tab=ocr" className="text-slate-500 hover:text-blue-600 font-medium flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-lg transition">
                                    <Play size={16} fill="currentColor" /> Try Demo Prescription
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
