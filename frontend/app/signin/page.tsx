"use client";

import Link from "next/link";
import { Mail, Lock, Check, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-screen bg-[#ecfeff] flex items-center justify-center relative overflow-hidden font-sans p-6">

            {/* Background Patterns */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-[0.03]"></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 relative z-10 border border-slate-100">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-teal-800 font-bold text-xl mb-8 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg text-white flex items-center justify-center">
                            <span className="text-lg font-bold">+</span>
                        </div>
                        MediTranslate
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500 text-sm">Sign in securely to access your medical translations.</p>
                </div>

                <form className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                placeholder="name@meditranslate.com"
                                className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            <a href="#" className="text-xs font-bold text-teal-600 hover:text-teal-700">Forgot Password?</a>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-12 py-3.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none transition-all placeholder:text-slate-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="button" className="w-full bg-teal-700 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-all flex items-center justify-center gap-2 mt-2">
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account? <Link href="/signup" className="text-teal-700 font-bold hover:underline">Create Account</Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Lock size={10} /> Secure HIPAA Compliant Environment
                    </p>
                </div>

            </div>

            <div className="absolute top-8 right-8 hidden md:block">
                <a href="#" className="text-teal-700 font-bold text-sm hover:underline">Need Help?</a>
            </div>
        </main>
    );
}
