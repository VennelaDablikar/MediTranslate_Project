"use client";

import { Scan, ShieldCheck, Sparkles } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            icon: <Scan size={28} className="text-teal-600" />,
            title: "Instant OCR Scanning",
            description: "Upload photos or scans of medical documents. Our advanced OCR engine recognizes medical terminology in over 40 languages instantly."
        },
        {
            icon: <ShieldCheck size={28} className="text-teal-600" />,
            title: "Secure & HIPAA Compliant",
            description: "Your patient data is encrypted end-to-end. We adhere to the strictest global privacy standards ensuring total confidentiality."
        },
        {
            icon: <Sparkles size={28} className="text-teal-600" />,
            title: "AI-Powered Context",
            description: "Our AI is trained on millions of medical records to understand context, reducing errors in pharmaceutical and diagnostic translation."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                        Everything you need for seamless care
                    </h2>
                    <p className="text-slate-500">
                        MediTranslate isn't just a translator. It's a complete medical communication platform designed for healthcare professionals.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-teal-200 transition-colors group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
