"use client";

import Navbar from "../components/Navbar";
import {
    User, Bell, Lock, Globe, CreditCard, LogOut,
    ChevronDown, Save, Languages, Moon, Check
} from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Account");

    // Toggle State
    const [autoTranslate, setAutoTranslate] = useState(true);
    const [saveLocally, setSaveLocally] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    // Checkbox State
    const [notifications, setNotifications] = useState({
        scanCompletions: false,
        priceAlerts: true,
        securityAlerts: true,
        productUpdates: false
    });

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const navItems = [
        { name: "Account", icon: <User size={18} /> },
        { name: "Privacy & Security", icon: <Lock size={18} /> },
        { name: "Language & Region", icon: <Globe size={18} /> },
    ];

    return (
        <main className="min-h-screen bg-[#ecfeff] text-foreground font-sans selection:bg-teal-100 pb-20">
            <Navbar />

            <section className="max-w-7xl mx-auto px-8 mt-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Settings</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Manage your account preferences, notifications, and privacy settings.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 last:mb-0",
                                        activeTab === item.name
                                            ? "bg-teal-50 text-teal-800"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {item.icon}
                                    {item.name}
                                </button>
                            ))}

                            <div className="h-px bg-slate-100 my-2 mx-2"></div>

                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut size={18} />
                                Log Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">

                        {/* ACCOUNT TAB */}
                        {activeTab === "Account" && (
                            <>
                                {/* Profile Information */}
                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">Profile Information</h2>
                                        <button className="text-sm font-bold text-teal-600 hover:text-teal-700">Edit Profile</button>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-24 h-24 rounded-full bg-teal-50 border-4 border-white shadow-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {/* Initials Avatar */}
                                            <div className="text-3xl font-bold text-teal-700">SJ</div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue="Dr. Sarah Johnson"
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                                <input
                                                    type="email"
                                                    defaultValue="sarah.johnson@meditranslate.com"
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    defaultValue="+1 (555) 123-4567"
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                                                <div className="relative">
                                                    <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none appearance-none cursor-pointer">
                                                        <option>Female</option>
                                                        <option>Male</option>
                                                        <option>Other</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
                                                <input
                                                    type="number"
                                                    defaultValue="32"
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* App Preferences */}
                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                    <h2 className="text-xl font-bold text-slate-800 mb-2">App Preferences</h2>
                                    <p className="text-slate-500 text-sm mb-6">Customize your translation and scanning experience.</p>

                                    <div className="space-y-6">
                                        {/* Toggle Item */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                                    <Moon size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-sm">Dark Mode</h3>
                                                    <p className="text-xs text-slate-400">Switch between light and dark themes.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setDarkMode(!darkMode)}
                                                className={clsx("w-12 h-7 rounded-full transition-colors relative", darkMode ? "bg-teal-600" : "bg-slate-200")}
                                            >
                                                <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform", darkMode ? "left-6" : "left-1")}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* PRIVACY & SECURITY TAB */}
                        {activeTab === "Privacy & Security" && (
                            <>
                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6">Security Settings</h2>

                                    <div className="space-y-8">
                                        {/* Change Password */}
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-slate-800">Change Password</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-teal-100 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors">
                                                Update Password
                                            </button>
                                        </div>

                                        <div className="h-px bg-slate-100"></div>

                                        {/* Save History Locally (moved from prefs) */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                                    <Save size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-sm">Save History Locally</h3>
                                                    <p className="text-xs text-slate-400">Keep a local copy of scanned documents on this device.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSaveLocally(!saveLocally)}
                                                className={clsx("w-12 h-7 rounded-full transition-colors relative", saveLocally ? "bg-teal-600" : "bg-slate-200")}
                                            >
                                                <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform", saveLocally ? "left-6" : "left-1")}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Account */}
                                <div className="bg-red-50 rounded-3xl border border-red-100 p-8 shadow-sm">
                                    <h2 className="text-xl font-bold text-red-800 mb-2">Delete Account</h2>
                                    <p className="text-red-600/80 text-sm mb-6 max-w-xl">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                    <button className="px-6 py-3 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                                        Delete My Account
                                    </button>
                                </div>
                            </>
                        )}

                        {/* LANGUAGE & REGION TAB */}
                        {activeTab === "Language & Region" && (
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Language Preferences</h2>
                                {/* Auto-Translate (moved from prefs) */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Languages size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">Auto-Translate Scans</h3>
                                            <p className="text-xs text-slate-400">Automatically translate recognized text.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAutoTranslate(!autoTranslate)}
                                        className={clsx("w-12 h-7 rounded-full transition-colors relative", autoTranslate ? "bg-teal-600" : "bg-slate-200")}
                                    >
                                        <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform", autoTranslate ? "left-6" : "left-1")}></div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer only on Account tab? or all? Let's keep it generally relevant or move inside tabs. Keeping it outside for now but mainly relevant to forms. */}
                        {activeTab === "Account" && (
                            <div className="flex justify-end gap-4 pt-4">
                                <button className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700">Discard Changes</button>
                                <button className="px-8 py-3 bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-900/10 hover:bg-teal-800 flex items-center gap-2">
                                    <Check size={18} />
                                    Save Preferences
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </section>
        </main>
    );
}
