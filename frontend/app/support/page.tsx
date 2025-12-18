"use client";

import PublicHeader from "../components/PublicHeader";
import { Mail, Phone, MapPin, ArrowRight, MessageSquare, Send } from "lucide-react";
import React from "react";

export default function SupportPage() {
    return (

        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 pb-20">
            <PublicHeader />

            <section className="max-w-7xl mx-auto px-8 mt-12">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
                        Contact Support
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Get in touch with us
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Have questions about MediTranslate? Our team is ready to help you with translations, technical support, or enterprise inquiries.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Contact Cards */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Chat Card */}
                        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border flex items-start gap-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground mb-1">Chat with us</h3>
                                <p className="text-muted-foreground text-sm mb-3">Speak to our friendly team via email.</p>
                                <a href="mailto:support@meditranslate.com" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    support@meditranslate.com <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Call Card */}
                        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border flex items-start gap-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground mb-1">Call us</h3>
                                <p className="text-muted-foreground text-sm mb-3">Mon-Fri from 8am to 5pm IST.</p>
                                <a href="tel:+15550000000" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    +91 123456790 <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Visit Card */}
                        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border flex items-start gap-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground mb-1">Visit us</h3>
                                <p className="text-muted-foreground text-sm mb-3">Come say hello at our office HQ.</p>
                                <p className="text-primary font-bold text-sm leading-relaxed">
                                    JITS <br />
                                    Thimmapur,Karimnagar, TG 50005
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
                        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-border h-full">
                            <h2 className="text-2xl font-bold text-foreground mb-8">Send us a message</h2>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Vennela"
                                            className="w-full bg-transparent border-2 border-border rounded-xl px-4 py-3 text-foreground font-medium focus:border-primary focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Dablikar"
                                            className="w-full bg-transparent border-2 border-border rounded-xl px-4 py-3 text-foreground font-medium focus:border-primary focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="vennela.dablikar@gmail.com"
                                        className="w-full bg-transparent border-2 border-border rounded-xl px-4 py-3 text-foreground font-medium focus:border-primary focus:ring-0 outline-none transition-colors"
                                    />
                                </div>



                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message</label>
                                    <textarea
                                        placeholder="How can we help you today?"
                                        rows={4}
                                        className="w-full bg-transparent border-2 border-border rounded-xl px-4 py-3 text-foreground font-medium focus:border-primary focus:ring-0 outline-none transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <button type="button" className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4">
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
