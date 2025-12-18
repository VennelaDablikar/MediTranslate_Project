"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, ShieldCheck, Zap } from "lucide-react";

export default function LandingHero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -z-10 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-white to-white opacity-70"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                            New: AI Voice Translation
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                            Break Language <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                                Barriers in Healthcare
                            </span>
                        </h1>

                        <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                            Instantly scan and translate medical documents, prescriptions, and
                            patient records with HIPAA-compliant AI precision.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/signup"
                                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 hover:-translate-y-1"
                            >
                                Sign Up Free
                                <ArrowRight size={18} />
                            </Link>

                        </div>

                        <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-teal-500" />
                                HIPAA Compliant
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={18} className="text-teal-500" />
                                Instant Results
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Visual Mockup */}
                    <div className="relative group perspective-1000">
                        {/* Abstract blobs */}
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob"></div>
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000"></div>

                        {/* Glass Card Mockup */}
                        <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl transform transition-transform hover:scale-[1.02] duration-500 border-t-white/80">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                {/* Mock Browser Header */}
                                <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                    </div>
                                    <div className="w-full max-w-[200px] h-6 bg-white rounded-md mx-4 shadow-sm"></div>
                                </div>

                                {/* Mock Content */}
                                <div className="p-8 space-y-6">
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                    </div>

                                    {/* Floating Action Card */}
                                    <div className="relative bg-teal-900 text-white p-6 rounded-2xl shadow-xl shadow-teal-900/20 transform translate-x-4 -translate-y-2">
                                        <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                                            Translated to English
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">Diagnosis: Acute Bronchitis</h3>
                                        <p className="text-teal-100 text-sm opacity-90 leading-relaxed">
                                            Patient presents with persistent cough lasting 5 days.
                                            Mild fever reported. Recommend rest and hydration.
                                        </p>
                                        <div className="mt-4 flex gap-2">
                                            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium">Antibiotics</span>
                                            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium">Rest</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 animate-pulse opacity-50">
                                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                        <div className="h-4 bg-slate-100 rounded w-4/5"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
