"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, FileText, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import MedicinesList from '../../components/dashboard/MedicinesList';
import MedicineCard from '../../components/dashboard/MedicineCard';

// Helper for realistic pricing
const getRealisticPrice = (name) => {
    const lowerName = name.toLowerCase();
    const prices = {
        'amoxicillin': '12.99',
        'ibuprofen': '8.50',
        'paracetamol': '5.99',
        'atorvastatin': '18.50',
        'metformin': '4.00',
        'lisinopril': '7.50',
        'amlodipine': '6.25',
        'levothyroxine': '11.20',
        'azithromycin': '24.00',
        'metoprolol': '9.00',
        'omeprazole': '15.00',
        'simvastatin': '10.00',
        'losartan': '14.50',
        'albuterol': '25.00',
        'gabapentin': '16.75',
        'hydrochlorothiazide': '5.50',
        'sertraline': '22.00',
        'furosemide': '8.00',
        'fluticasone': '35.00',
        'acetaminophen': '5.99',
        'aspirin': '6.50'
    };

    // Check for exact matches or partial matches
    for (const [key, value] of Object.entries(prices)) {
        if (lowerName.includes(key)) return value;
    }

    // Default fallback if unknown
    return (Math.random() * 40 + 10).toFixed(2);
};

export default function DashboardPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);

    // State
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('english');

    // Data
    const [medicines, setMedicines] = useState([]);
    const [patientName, setPatientName] = useState("");

    // Load data from local storage on mount (simulating persistence)
    useEffect(() => {
        const savedData = localStorage.getItem('prescriptionData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.medicines) setMedicines(parsed.medicines);
                if (parsed.patient) setPatientName(parsed.patient);
            } catch (e) {
                console.error("Failed to load saved data", e);
            }
        }
    }, []);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (file) await processFile(file);
    };

    const onDrop = async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await processFile(file);
    };

    const processFile = async (file) => {
        setIsProcessing(true);
        setUploadSuccess(false);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/ocr/extract', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error("Extraction Failed");

            const data = await response.json();

            // Transform Data for UI
            const newMedicines = (data.drug_candidates || []).map(drug => ({
                name: drug.drug,
                dosage: Array.isArray(drug.dosages) ? drug.dosages[0] : drug.dosages,
                type: drug.category || 'Medicine',
                usage: drug.description || 'No description available',
                instruction: drug.frequencies ? (Array.isArray(drug.frequencies) ? drug.frequencies[0] : drug.frequencies) : 'As directed',
                price: getRealisticPrice(drug.drug), // Realistic price lookup
                buyLink: `https://www.google.com/search?q=${encodeURIComponent(drug.drug)}+price+buy+online` // Dynamic Buy Link
            }));

            setMedicines(newMedicines);
            setPatientName(data.patient_name || "Guest");
            setUploadSuccess(true);

            // Save for persistence across reloads
            localStorage.setItem('prescriptionData', JSON.stringify({
                patient: data.patient_name,
                medicines: newMedicines
            }));

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* TOP ROW: NEW SCAN + MEDICINES LIST */}
            <div className="grid grid-cols-12 gap-8 lg:min-h-[500px]">

                {/* LEFT: SCAN AREA (8 cols) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">New Scan</h2>
                            <p className="text-slate-500">Securely digitize and translate medical records with AI precision.</p>
                        </section>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            System Operational
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1 flex flex-col">
                        {/* Language Selectors Row */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Source Language</label>
                                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                    <option>Auto-Detect</option>
                                    <option>English</option>
                                </select>
                            </div>
                            <div className="flex items-center text-slate-300 pt-6">
                                <ArrowRight />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Target Language</label>
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="english">English</option>
                                    <option value="hindi">Hindi</option>
                                    <option value="tamil">Tamil</option>
                                    <option value="telugu">Telugu</option>
                                </select>
                            </div>
                        </div>

                        {/* Drop Zone */}
                        <div
                            className={`flex-1 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${isDragOver ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={onDrop}
                        >
                            {/* Scanning Laser Animation */}
                            {isProcessing && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                    <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
                                    <p className="font-bold text-emerald-800 animate-pulse">Analyzing Prescription...</p>
                                </div>
                            )}

                            {!isProcessing && uploadSuccess && (
                                <div className="absolute inset-0 bg-emerald-50/90 z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <p className="font-bold text-emerald-900 text-lg">Scan Complete</p>
                                    <button
                                        onClick={() => setUploadSuccess(false)}
                                        className="mt-4 px-6 py-2 bg-white text-emerald-700 font-bold rounded-lg shadow-sm border border-emerald-100 hover:bg-emerald-50"
                                    >
                                        Scan Another
                                    </button>
                                </div>
                            )}

                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-lg shadow-emerald-100">
                                <Upload size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Medical Record</h3>
                            <p className="text-slate-500 mb-8 max-w-xs text-center">Drag & drop files here, or click to browse. Supports PDF, JPG, PNG.</p>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Camera size={20} /> Select File
                            </button>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileSelect} />
                        </div>
                    </div>
                </div>

                {/* RIGHT: MEDICINES LIST (4 cols) */}
                <div className="col-span-12 lg:col-span-4 h-full pt-[60px]"> {/* pt to align with card top */}
                    <MedicinesList medicines={medicines} />
                </div>
            </div>

            {/* BOTTOM ROW: DETAILS GRID */}
            <div className="mt-20">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Scanned Medicine Details</h3>
                    <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All Products</button>
                </div>

                {medicines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {medicines.map((med, idx) => (
                            <div key={idx} className="h-[300px]">
                                <MedicineCard medicine={med} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <p>No medicines scanned yet.</p>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
