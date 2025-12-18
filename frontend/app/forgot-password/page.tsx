"use client";

import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { supabase } from "../services/supabase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#ecfeff] flex items-center justify-center relative overflow-hidden font-sans p-6">

            {/* Background Patterns */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-[0.03]"></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 relative z-10 border border-slate-100">

                <div className="mb-8">
                    <Link href="/signin" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-700 font-bold text-sm transition-colors mb-6">
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>

                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Forgot Password?</h1>
                    <p className="text-slate-500 text-sm">
                        Don't worry! It happens. Please enter the email associated with your account.
                    </p>
                </div>

                {!success ? (
                    <form className="space-y-6" onSubmit={handleReset}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                                <AlertCircle size={16} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Check your mail</h3>
                        <p className="text-slate-500 text-sm mb-8">
                            We have sent a password recover instructions to your email.
                        </p>
                        <Link
                            href="/signin"
                            className="w-full block bg-teal-700 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-all text-center"
                        >
                            Back to Sign In
                        </Link>

                        <div className="mt-6 text-sm text-slate-400">
                            Did not receive the email? <button onClick={() => setSuccess(false)} className="text-teal-600 font-bold hover:underline">Click to resend</button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
