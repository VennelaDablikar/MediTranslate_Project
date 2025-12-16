"use client";
import React from 'react';
import Link from 'next/link';
import { FileText, Camera, Brain, Globe, CheckCircle, Smartphone, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* 2. HERO SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Text */}
                    <div className="space-y-8">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                            Understand Your Medicine in <span className="text-blue-600">Your Language</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            MediTranslate helps you translate medical prescriptions from English
                            to Hindi, Tamil, Telugu with audio explanations. Break language
                            barriers in healthcare.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all text-center">
                                Get Started →
                            </Link>
                        </div>

                        <div className="flex gap-6 pt-4 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Free to use</div>
                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> 90% accuracy</div>
                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> 4 languages</div>
                        </div>
                    </div>

                    {/* Right Side - Illustration */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50"></div>
                        <div className="relative bg-white border border-slate-100 p-6 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Mockup UI */}
                            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                                <div className="h-4 w-1/3 bg-slate-200 rounded mb-2"></div>
                                <div className="h-32 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center">
                                    <Camera className="text-blue-300" size={48} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex gap-3">
                                    <div className="bg-green-100 p-2 rounded-full h-fit"><Brain size={16} className="text-green-600" /></div>
                                    <div>
                                        <div className="h-4 w-24 bg-green-200 rounded mb-1"></div>
                                        <div className="h-3 w-48 bg-green-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-full h-fit"><Globe size={16} className="text-indigo-600" /></div>
                                    <div>
                                        <div className="h-4 w-20 bg-indigo-200 rounded mb-1"></div>
                                        <div className="h-3 w-40 bg-indigo-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS SECTION */}
            <section id="how-it-works" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Translate your prescription in 4 simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Globe, title: "1. Select Language", desc: "Choose Hindi, Tamil, or Telugu" },
                            { icon: Camera, title: "2. Upload", desc: "Take photo or upload image" },
                            { icon: Brain, title: "3. Extract", desc: "AI extracts medicine names" },
                            { icon: Smartphone, title: "4. Translate", desc: "Read & hear in your language" }
                        ].map((step, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <step.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. FEATURES SECTION */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need</h2>
                        <p className="text-slate-600">Powerful features to help you understand your health</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <FeatureCard icon={Zap} title="High Accuracy" desc="70-90% OCR accuracy using advanced AI models" />
                        <FeatureCard icon={Globe} title="Multi-Language" desc="Supports English, Hindi, Tamil, and Telugu" />
                        <FeatureCard icon={Smartphone} title="Voice Output" desc="Listen to instructions in your own language" />
                        <FeatureCard icon={Shield} title="Free to Use" desc="No hidden charges. Accessible to everyone." />
                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Translate Your Prescription?</h2>
                    <p className="text-blue-100 text-lg mb-8">Join thousands of users who trust MediTranslate for their healthcare needs.</p>
                    <Link href="/signup" className="inline-block px-10 py-4 bg-white text-blue-700 rounded-full font-bold text-lg shadow-xl hover:bg-blue-50 transition-colors">
                        Sign Up Free →
                    </Link>
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <Brain className="text-blue-500" />
                            <span className="font-bold text-xl">MediTranslate</span>
                        </div>
                        <p className="text-sm max-w-xs">Helping you understand your medications with the power of AI.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
                            <li><Link href="/#features" className="hover:text-blue-400">Features</Link></li>
                            <li><Link href="/login" className="hover:text-blue-400">Log In</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-blue-400">Privacy Policy</Link></li>
                            <li><Link href="/" className="hover:text-blue-400">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-sm">
                    &copy; {new Date().getFullYear()} MediTranslate. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-lg transition-all">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Icon size={24} />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600">{desc}</p>
            </div>
        </div>
    );
}
