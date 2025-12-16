"use client";
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Globe, Save, Lock, Download, Trash2, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                <User className="text-blue-600" /> Profile Settings
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">

                {/* Personal Info */}
                <section className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Personal Information</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    defaultValue={user?.user_metadata?.full_name || "User"}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    defaultValue={user?.email || ""}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Preferences</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Translation Language</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                                <select className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                    <option>English</option>
                                    <option>Hindi (हिंदी)</option>
                                    <option>Tamil (தமிழ்)</option>
                                    <option>Telugu (తెలుగు)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Interface Language</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                                <select className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                    <option>English</option>
                                    <option>Hindi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition flex items-center gap-2">
                        <Save size={18} /> Save Changes
                    </button>
                </div>

                {/* Account Actions */}
                <section className="space-y-4 pt-8 border-t border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Account Actions</h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
                            <Lock size={16} /> Change Password
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
                            <Download size={16} /> Download Data
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition text-sm font-medium">
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>

                    <div className="pt-4">
                        <button onClick={() => signOut()} className="text-slate-500 hover:text-red-600 font-medium flex items-center gap-2 transition">
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
}
