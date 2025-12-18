"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-24 bg-[#ecfeff]">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                    Ready to streamline your workflow?
                </h2>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Join over 10,000 healthcare professionals breaking down language barriers every day.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/signup"
                        className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl transition-all shadow-xl shadow-teal-900/10 hover:-translate-y-1"
                    >
                        Get Started for Free
                    </Link>

                </div>
            </div>
        </section>
    );
}
