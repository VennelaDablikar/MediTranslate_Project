"use client";

import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin, ArrowRight, MessageSquare, Send } from "lucide-react";
import React from "react";

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-[#ecfeff] text-foreground font-sans selection:bg-teal-100 pb-20">
            <Navbar />

            <section className="max-w-7xl mx-auto px-8 mt-12">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
                        Contact Support
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Get in touch with us
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Have questions about MediTranslate? Our team is ready to help you with translations, technical support, or enterprise inquiries.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Contact Cards */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Chat Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-start gap-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Chat with us</h3>
                                <p className="text-slate-500 text-sm mb-3">Speak to our friendly team via email.</p>
                                <a href="mailto:support@meditranslate.com" className="text-teal-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    support@meditranslate.com <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Call Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-start gap-6">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Call us</h3>
                                <p className="text-slate-500 text-sm mb-3">Mon-Fri from 8am to 5pm EST.</p>
                                <a href="tel:+15550000000" className="text-teal-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    +1 (555) 000-0000 <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Visit Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-start gap-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Visit us</h3>
                                <p className="text-slate-500 text-sm mb-3">Come say hello at our office HQ.</p>
                                <p className="text-teal-700 font-bold text-sm leading-relaxed">
                                    100 Medical Plaza, Suite 400 <br />
                                    Innovation City, CA 94063
                                </p>
                            </div>
                        </div>

                        {/* FAQ Banner */}
                        <div className="bg-teal-800 rounded-3xl p-8 text-white relative overflow-hidden mt-8">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Check our FAQ</h3>
                                <p className="text-teal-100 text-sm mb-6 max-w-xs">
                                    Find quick answers to common questions about document scanning and pricing.
                                </p>
                                <button className="text-white font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                                    View Help Center <ArrowRight size={16} />
                                </button>
                            </div>
                            {/* Decorative Circle */}
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-700 rounded-full opacity-50"></div>
                        </div>

                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h2>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Dr. Sarah"
                                            className="w-full bg-transparent border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Johnson"
                                            className="w-full bg-transparent border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="sarah@hospital.com"
                                        className="w-full bg-transparent border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-0 outline-none transition-colors"
                                    />
                                </div>



                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                                    <textarea
                                        placeholder="How can we help you today?"
                                        rows={4}
                                        className="w-full bg-transparent border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-0 outline-none transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <button type="button" className="w-full bg-teal-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-all flex items-center justify-center gap-2 mt-4">
                                    Send Message <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
