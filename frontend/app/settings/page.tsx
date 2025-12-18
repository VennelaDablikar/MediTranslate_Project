"use client";

import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import {
    User, Bell, Lock, Globe, CreditCard, LogOut,
    ChevronDown, Save, Languages, Moon, Check
} from "lucide-react";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";

import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
    const { user, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("You must be logged in to delete your account.");
                return;
            }

            const response = await fetch("http://localhost:8000/auth/delete-account", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to delete account");
            }

            await signOut();
            router.push("/");
            alert("Your account has been deleted.");
        } catch (error: any) {
            console.error("Delete account error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    // UI State
    const [activeTab, setActiveTab] = useState("Account");
    const [mounted, setMounted] = useState(false);

    // Form State (Default to user metadata if available)
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [mobile, setMobile] = useState(user?.user_metadata?.mobile || "");
    const [gender, setGender] = useState(user?.user_metadata?.gender || "");
    const [dob, setDob] = useState(user?.user_metadata?.dob || "");
    const [preferredLanguage, setPreferredLanguage] = useState(user?.user_metadata?.preferred_language || "English");

    // Toggle State
    const [autoTranslate, setAutoTranslate] = useState(true);
    const [saveLocally, setSaveLocally] = useState(true);

    // Checkbox State
    const [notifications, setNotifications] = useState({
        scanCompletions: false,
        priceAlerts: true,
        securityAlerts: true,
        productUpdates: false
    });

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Ensure theme is mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update state when user loads
    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata.full_name || "");
            setEmail(user.email || "");
            setMobile(user.user_metadata.mobile || "");
            setGender(user.user_metadata.gender || "");
            setDob(user.user_metadata.dob || "");
            setPreferredLanguage(user.user_metadata.preferred_language || "English");
        }
    }, [user]);

    const isDark = theme === 'dark';
    const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const navItems = [
        { name: "Account", icon: <User size={18} /> },
        { name: "Privacy & Security", icon: <Lock size={18} /> },
        { name: "Language & Region", icon: <Globe size={18} /> },
    ];

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 pb-20">
            <Navbar />

            <section className="max-w-7xl mx-auto px-8 mt-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1 font-medium">
                        Manage your account preferences, notifications, and privacy settings.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
                        <div className="bg-card rounded-2xl shadow-sm border border-border p-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 last:mb-0",
                                        activeTab === item.name
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {item.icon}
                                    {item.name}
                                </button>
                            ))}

                            <div className="h-px bg-border my-2 mx-2"></div>

                            <button
                                onClick={signOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                            >
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
                                <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
                                        <button className="text-sm font-bold text-primary hover:text-primary/80">Edit Profile</button>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-card shadow-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {/* Initials Avatar */}
                                            <div className="text-3xl font-bold text-primary">
                                                {fullName ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "User"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full bg-input border-none rounded-xl px-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-ring outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    readOnly
                                                    className="w-full bg-muted border-none rounded-xl px-4 py-3 text-muted-foreground font-medium focus:outline-none cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    value={mobile}
                                                    onChange={(e) => setMobile(e.target.value)}
                                                    className="w-full bg-input border-none rounded-xl px-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-ring outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
                                                <div className="relative">
                                                    <select
                                                        value={gender}
                                                        onChange={(e) => setGender(e.target.value)}
                                                        className="w-full bg-input border-none rounded-xl px-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-ring outline-none appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={dob}
                                                    onChange={(e) => setDob(e.target.value)}
                                                    className="w-full bg-input border-none rounded-xl px-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-ring outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* App Preferences */}
                                <div className="bg-card rounded-3xl border border-border p-8 shadow-sm flex flex-col gap-6 mt-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground mb-2">App Preferences</h2>
                                        <p className="text-muted-foreground text-sm">Customize your translation and scanning experience.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Toggle Item */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                    <Moon size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-foreground text-sm">Dark Mode</h3>
                                                    <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleTheme}
                                                className={clsx("w-12 h-7 rounded-full transition-colors relative", isDark ? "bg-primary" : "bg-muted")}
                                            >
                                                <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform", isDark ? "left-6" : "left-1")}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* PRIVACY & SECURITY TAB */}
                        {activeTab === "Privacy & Security" && (
                            <>
                                <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                                    <h2 className="text-xl font-bold text-foreground mb-6">Security Settings</h2>

                                    <div className="space-y-8">
                                        {/* Change Password */}
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-foreground">Change Password</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full bg-input border-none rounded-xl px-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-ring outline-none"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full bg-input border-none rounded-xl px-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-ring outline-none"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    if (!newPassword || !confirmPassword) {
                                                        alert("Please fill in both password fields.");
                                                        return;
                                                    }
                                                    if (newPassword !== confirmPassword) {
                                                        alert("Passwords do not match.");
                                                        return;
                                                    }
                                                    if (newPassword.length < 6) {
                                                        alert("Password must be at least 6 characters long.");
                                                        return;
                                                    }

                                                    try {
                                                        const { error } = await supabase.auth.updateUser({
                                                            password: newPassword
                                                        });

                                                        if (error) throw error;

                                                        alert("Password updated successfully!");
                                                        setNewPassword("");
                                                        setConfirmPassword("");
                                                    } catch (error: any) {
                                                        console.error("Error updating password:", error);
                                                        alert(error.message || "Failed to update password.");
                                                    }
                                                }}
                                                className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm"
                                            >
                                                Update Password
                                            </button>
                                        </div>

                                        <div className="h-px bg-border"></div>

                                        {/* Save History Locally */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Save size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-foreground text-sm">Save History Locally</h3>
                                                    <p className="text-xs text-muted-foreground">Keep a local copy of scanned documents on this device.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSaveLocally(!saveLocally)}
                                                className={clsx("w-12 h-7 rounded-full transition-colors relative", saveLocally ? "bg-primary" : "bg-muted")}
                                            >
                                                <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform", saveLocally ? "left-6" : "left-1")}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Account */}
                                <div className="bg-destructive/10 rounded-3xl border border-destructive/20 p-8 shadow-sm mt-6">
                                    <h2 className="text-xl font-bold text-destructive mb-2">Delete Account</h2>
                                    <p className="text-destructive/80 text-sm mb-6 max-w-xl">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-6 py-3 bg-white text-destructive border border-destructive/20 font-bold rounded-xl hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                                    >
                                        Delete My Account
                                    </button>
                                </div>
                            </>
                        )}

                        {/* LANGUAGE & REGION TAB */}
                        {activeTab === "Language & Region" && (
                            <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-foreground mb-6">Language Preferences</h2>

                                {/* Preferred Language */}
                                <div className="mb-8">
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Preferred Translation Language</label>
                                    <div className="relative">
                                        <select
                                            value={preferredLanguage}
                                            onChange={(e) => setPreferredLanguage(e.target.value)}
                                            className="w-full bg-input border-none rounded-xl px-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-ring outline-none appearance-none cursor-pointer"
                                        >
                                            <option>English</option>
                                            <option>Hindi</option>
                                            <option>Telugu</option>
                                            <option>Tamil</option>
                                            <option>Kannada</option>
                                            <option>Malayalam</option>
                                            <option>Marathi</option>
                                            <option>Gujarati</option>
                                            <option>Bengali</option>
                                            <option>Punjabi</option>
                                            <option>Urdu</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Default language for new scans and audio read-aloud.</p>
                                </div>

                                <div className="h-px bg-border my-6"></div>

                                {/* Auto-Translate */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                            <Languages size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground text-sm">Auto-Translate Scans</h3>
                                            <p className="text-xs text-muted-foreground">Automatically translate recognized text.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAutoTranslate(!autoTranslate)}
                                        className={clsx("w-12 h-7 rounded-full transition-colors relative", autoTranslate ? "bg-primary" : "bg-muted")}
                                    >
                                        <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform", autoTranslate ? "left-6" : "left-1")}></div>
                                    </button>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={async () => {
                                            const { error } = await supabase.auth.updateUser({
                                                data: { preferred_language: preferredLanguage }
                                            });
                                            if (error) alert("Failed to update language settings");
                                            else alert("Language settings updated successfully");
                                        }}
                                        className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/90 flex items-center gap-2 text-sm"
                                    >
                                        <Check size={16} />
                                        Save Language Settings
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer (Save Preferences) */}
                        {activeTab === "Account" && (
                            <div className="flex justify-end gap-4 pt-4">
                                <button className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground">Discard Changes</button>
                                <button
                                    onClick={async () => {
                                        const { error } = await supabase.auth.updateUser({
                                            data: { full_name: fullName, mobile, gender, dob }
                                        });
                                        if (error) alert("Failed to update profile");
                                        else alert("Profile updated successfully");
                                    }}
                                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/90 flex items-center gap-2"
                                >
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
