"use client";
import React, { useState } from 'react';
import { Languages, Sliders, Shield, AlertTriangle } from 'lucide-react';

export default function GeneralSettingsPage() {
    // State for toggles
    const [autoDetect, setAutoDetect] = useState(true);
    const [medicalDict, setMedicalDict] = useState(true);
    const [instantProcess, setInstantProcess] = useState(false);
    const [autoDelete, setAutoDelete] = useState(false);

    // Toggle Component
    const Toggle = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-cyan-400' : 'bg-slate-200'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">General Settings</h1>
                    <p className="text-emerald-600 font-medium max-w-2xl">
                        Manage your default language preferences, application behavior, and regional settings for better translation accuracy.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                        Reset
                    </button>
                    <button className="px-6 py-2.5 bg-cyan-400 text-slate-900 font-bold rounded-xl hover:bg-cyan-300 shadow-lg shadow-cyan-100 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* 1. Scan Defaults */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                    <Languages size={20} className="text-cyan-500" />
                    <h2 className="text-lg font-bold text-slate-900">Scan Defaults</h2>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Default Source Language</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                <option>English (US)</option>
                                <option>French (FR)</option>
                                <option>Spanish (ES)</option>
                            </select>
                            <p className="text-xs text-slate-400 mt-2">The primary language of your medical documents.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Default Target Language</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                <option>Spanish (ES)</option>
                                <option>English (US)</option>
                                <option>German (DE)</option>
                            </select>
                            <p className="text-xs text-slate-400 mt-2">The language you most frequently translate into.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div>
                            <h3 className="font-bold text-slate-900">Auto-detect Language</h3>
                            <p className="text-sm text-slate-500">Automatically detect source language from uploaded scans.</p>
                        </div>
                        <Toggle checked={autoDetect} onChange={setAutoDetect} />
                    </div>
                </div>
            </div>



            {/* 4. Danger Zone */}
            <div className="bg-red-50 rounded-[24px] border border-red-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-red-100 flex items-center gap-3">
                    <AlertTriangle size={20} className="text-red-600" />
                    <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
                </div>

                <div className="p-8 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="font-bold text-slate-900">Delete Account</h3>
                        <p className="text-sm text-slate-500">Permanently remove your account and all associated data.</p>
                    </div>
                    <button className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
