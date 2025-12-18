"use client";

import Link from "next/link";
import { Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-600 rounded-md"></div>
                    <span className="text-slate-900 font-bold text-lg">MediTranslate</span>
                </div>

                <p className="text-slate-400 text-sm">
                    © {new Date().getFullYear()} MediTranslate Inc. All rights reserved.
                </p>

                <div className="flex items-center gap-6">
                    <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors">
                        <Twitter size={20} />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors">
                        <Linkedin size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
