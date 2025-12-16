"use client";
import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import uiTranslations from '../../data/ui-translations.json';
import { findMedicineInDb } from '../../utils/medicineMatcher';
import { supabase } from '../../lib/supabaseClient';
import { Upload, X, FileText, Volume2, Mic, CheckCircle, AlertCircle, Loader2, History } from 'lucide-react';

export default function UploadPage() {
    const { language } = useLanguage();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stage, setStage] = useState('idle'); // idle, analyzing, complete
    const [error, setError] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [savedId, setSavedId] = useState(null);
    const fileInputRef = useRef(null);

    const t = (key) => uiTranslations[key]?.[language] || uiTranslations[key]?.english || key;

    const handleFileSelect = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
            setError(null);
        } else {
            setError('Please upload a valid image file (JPG, PNG).');
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const processImage = async () => {
        if (!file) return;
        setIsProcessing(true);
        setStage('analyzing');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Call OCR/Gemini API directly
            const res = await fetch('/api/ocr', { method: 'POST', body: formData });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            // Extract candidates (works for both Gemini and Vision OCR formats)
            const candidates = data.drug_candidates || [];

            const matchedMedicines = candidates.map(c => {
                const name = c.drug;
                const match = findMedicineInDb(name);
                return match ? { ...match, originalName: name, found: true } : { originalName: name, found: false };
            });

            setMedicines(matchedMedicines);
            setStage('complete');

            // Save to Supabase logic
            if (matchedMedicines.length > 0) {
                const { data: savedData, error: dbError } = await supabase
                    .from('prescriptions')
                    .insert([
                        {
                            ocr_text: data.raw_ocr_text || '',
                            medicines: matchedMedicines,
                            language: language
                        }
                    ])
                    .select();

                if (!dbError && savedData) {
                    setSavedId(savedData[0].id);
                }
            }

        } catch (err) {
            console.error(err);
            setError('Analysis failed. Please try again.');
            setStage('idle');
        } finally {
            setIsProcessing(false);
        }
    };

    const speakText = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Default to English for medical terms
        window.speechSynthesis.speak(utterance);
    };

    const playAllAudio = () => {
        if (medicines.length === 0) return;
        const fullText = medicines.map(m =>
            `${m.found ? m[language].name : m.originalName}. ${m.found ? m[language].explanation : ''}`
        ).join('. Next medicine: ');
        speakText(fullText);
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setMedicines([]);
        setStage('idle');
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">MediTranslate</h1>
                    <div className="flex gap-4">
                        <button onClick={() => window.location.href = '/history'} className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600">
                            <History size={18} /> {t('history')}
                        </button>
                        <button onClick={() => window.location.href = '/'} className="text-blue-600 font-medium hover:underline">
                            Change Language
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-slate-800">
                                {stage === 'analyzing' ? 'Analyzing Prescription...' :
                                    stage === 'complete' ? t('medicines_detected') :
                                        'Upload Prescription'}
                            </h2>
                            {stage === 'complete' && medicines.length > 0 && (
                                <button
                                    onClick={playAllAudio}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition"
                                >
                                    <Volume2 size={18} /> Listen to All
                                </button>
                            )}
                        </div>
                        {(stage === 'complete' || preview) && (
                            <button onClick={reset} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                                <X size={16} /> {t('try_again')}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        {/* LEFT COLUMN: UPLOAD / IMAGE PREVIEW */}
                        <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 min-h-[400px] flex flex-col items-center justify-center">
                            {!preview ? (
                                <div
                                    className={`text-center cursor-pointer w-full h-full flex flex-col items-center justify-center p-8 transition-colors ${isDragOver ? 'bg-blue-50 border-blue-500' : ''}`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                    onDragLeave={() => setIsDragOver(false)}
                                    onDrop={onDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} />
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                                        <Upload size={32} />
                                    </div>
                                    <p className="text-slate-600 font-medium mb-1">{t('upload_prescription')}</p>
                                    <p className="text-slate-400 text-sm">{t('drag_drop_text')}</p>
                                </div>
                            ) : (
                                <>
                                    <img src={preview} alt="Prescription" className="w-full h-full object-contain" />
                                    {stage === 'idle' && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <button onClick={processImage} className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg flex items-center gap-2">
                                                <CheckCircle size={20} /> Read Prescription
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                            {error && <div className="absolute bottom-4 left-4 right-4 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}
                        </div>

                        {/* RIGHT COLUMN: RESULTS / PLACEHOLDER */}
                        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 min-h-[400px] flex flex-col p-4 overflow-y-auto max-h-[600px]">
                            {stage === 'analyzing' && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                                    <p>Identifying medicines with AI...</p>
                                </div>
                            )}

                            {stage === 'idle' && !preview && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <FileText size={48} className="mb-4 opacity-50" />
                                    <p>Ready to analyze</p>
                                </div>
                            )}

                            {stage === 'complete' && medicines.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-orange-500">
                                    <AlertCircle size={48} className="mb-4 opacity-80" />
                                    <p>{t('no_medicines_found')}</p>
                                </div>
                            )}

                            {stage === 'complete' && medicines.map((med, idx) => (
                                <div key={idx} className={`p-4 mb-3 rounded-xl border ${med.found ? 'bg-white border-blue-100 shadow-sm' : 'bg-slate-100 border-slate-200'} transition`}>
                                    <div className="flex justify-between items-start gap-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{med.found ? med[language].name : med.originalName}</h3>
                                            {med.found ? (
                                                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{med[language].explanation}</p>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 mt-1 text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">
                                                    <AlertCircle size={10} /> Not in database
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => speakText(`${med.found ? med[language].name : med.originalName}. ${med.found ? med[language].explanation : ''}`)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition shrink-0">
                                            <Volume2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
