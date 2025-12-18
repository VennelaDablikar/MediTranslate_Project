"use client";


import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Check, ChevronDown, Smartphone, Calendar, User, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { supabase } from "../services/supabase";

export default function SignUpPage() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        mobile,
                        gender,
                        dob,
                    },
                },
            });
            if (error) throw error;
            setSuccess(true);
            setFullName("");
            setEmail("");
            setMobile("");
            setGender("");
            setDob("");
            setPassword("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStrength = (pass: string) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const strength = getStrength(password);

    const getStrengthColor = (s: number) => {
        if (s === 0) return "bg-slate-200";
        if (s <= 2) return "bg-red-400";
        if (s === 3) return "bg-yellow-400";
        return "bg-teal-500";
    };

    return (
        <main className="min-h-screen bg-white flex">

            {/* Left Sidebar (Dark) */}
            <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 to-slate-900/0 z-0 pointer-events-none"></div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-xl mb-8 opacity-90 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg text-white flex items-center justify-center">
                            <span className="text-lg font-bold">+</span>
                        </div>
                        MediTranslate
                    </Link>

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-1.5 inline-flex items-center gap-2 border border-slate-700 mb-8">
                        <span className="flex w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-teal-100 tracking-wider uppercase">Secure Portal</span>
                    </div>

                    <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
                        Accurate Medical Translation
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                        Join thousands of healthcare professionals using MediTranslate to bridge communication gaps and improve patient care.
                    </p>
                </div>

                {/* Testimonial */}
                <div className="relative z-10 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl mt-auto">
                    <div className="flex gap-1 text-yellow-400 mb-3">
                        <span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span>
                    </div>
                    <p className="text-slate-300 italic text-sm mb-4">
                        "Essential for my daily practice. The scan accuracy for prescriptions is unmatched."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-teal-200 border border-teal-700">
                            {/* Placeholder Avatar */}
                            <span className="font-bold text-xs">EC</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Dr. Emily Chen</p>
                            <p className="text-slate-500 text-xs font-medium">Chief Resident</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content (Form) */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 overflow-y-auto">
                <div className="max-w-xl mx-auto w-full">

                    <div className="flex justify-end mb-8 lg:mb-12">
                        <p className="text-sm text-slate-500 font-medium">
                            Already a member? <Link href="/signin" className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1">Log In <ArrowRight size={14} /></Link>
                        </p>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-500">Enter your details to get started.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSignup}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-teal-50 text-teal-700 p-4 rounded-xl text-sm font-medium border border-teal-100 flex items-start gap-2">
                                <Check size={16} className="mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold">Account created successfully!</p>
                                    <p>Please check your email to verify your account before logging in.</p>
                                </div>
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                            <input
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                type="text"
                                placeholder="e.g. vennela dablikar"
                                className="w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                            <input
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="vennela.dablikar@gmail.com"
                                className="w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Mobile & Gender Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        required
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        type="tel"
                                        placeholder="+91 1234567890"
                                        className="w-full bg-transparent border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <select
                                        required
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full bg-transparent border border-slate-300 rounded-xl pl-12 pr-10 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none appearance-none cursor-pointer bg-white"
                                    >
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* DOB */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    type="date"
                                    className="w-full bg-transparent border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Password with Strength */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a secure password"
                                    className="w-full bg-transparent border border-slate-300 rounded-xl pl-12 pr-12 py-3 text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-all placeholder:text-slate-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Strength Indicator */}
                            <div className="flex gap-1 h-1 mt-2">
                                <div className={`flex-1 rounded-full ${strength >= 1 ? getStrengthColor(strength) : "bg-slate-100"} transition-all duration-300`}></div>
                                <div className={`flex-1 rounded-full ${strength >= 2 ? getStrengthColor(strength) : "bg-slate-100"} transition-all duration-300`}></div>
                                <div className={`flex-1 rounded-full ${strength >= 3 ? getStrengthColor(strength) : "bg-slate-100"} transition-all duration-300`}></div>
                                <div className={`flex-1 rounded-full ${strength >= 4 ? getStrengthColor(strength) : "bg-slate-100"} transition-all duration-300`}></div>
                            </div>
                            <p className="text-[10px] text-slate-400 text-right font-medium">
                                {strength === 0 && "Start typing..."}
                                {strength === 1 && "Weak"}
                                {strength === 2 && "Fair"}
                                {strength === 3 && "Good"}
                                {strength === 4 && "Strong"}
                            </p>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <div className="relative flex items-center">
                                <input
                                    required
                                    type="checkbox"
                                    id="terms"
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:bg-teal-600 checked:border-teal-600"
                                />
                                <Check size={12} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" strokeWidth={4} />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                                I agree to the <a href="#" className="font-bold text-teal-700 hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-teal-700 hover:underline">Privacy Policy</a>.
                            </label>
                        </div>

                        <button disabled={loading} type="submit" className="w-full bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-700 transition-all flex items-center justify-center gap-2">
                            {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={18} />
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                <Lock size={10} /> Protected by HIPAA compliance standards
                            </p>
                        </div>

                    </form>

                </div>
            </div>

        </main>
    );
}
