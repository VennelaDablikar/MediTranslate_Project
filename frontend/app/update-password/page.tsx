"use client";

import Link from "next/link";
import { Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Check if we have a session (handled by Supabase auth listener automatically)
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                // User is in password recovery mode
            }
        });
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            // First ensure we have a session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("Session expired or missing. Please try the reset link again.");
            }

            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => {
                router.push("/signin");
            }, 3000);
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
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Set New Password</h1>
                    <p className="text-slate-500 text-sm">
                        Please enter your new password below.
                    </p>
                </div>

                {!success ? (
                    <form className="space-y-6" onSubmit={handleUpdate}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                                <AlertCircle size={16} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 characters"
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

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                            <Check size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Password Updated!</h3>
                        <p className="text-slate-500 text-sm mb-8">
                            Your password has been successfully reset. You will be redirected to the sign in page shortly.
                        </p>
                        <Link
                            href="/signin"
                            className="w-full block bg-teal-700 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-800 transition-all text-center"
                        >
                            Sign In Now
                        </Link>
                    </div>
                )}

            </div>
        </main>
    );
}
