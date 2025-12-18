"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export default function DoctorCard() {
    return (
        <div className="bg-primary text-white p-8 rounded-3xl shadow-xl shadow-teal-900/10 flex flex-col justify-between h-full relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>

            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Need a Doctor?</h3>
                <p className="text-teal-100 text-sm mb-8 leading-relaxed">
                    Connect with a specialist to discuss your medication results.
                </p>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-teal-200 uppercase tracking-widest">Department</label>
                        <div className="relative">
                            <select className="w-full bg-teal-800/50 border border-teal-700 text-white rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-teal-400 focus:outline-none cursor-pointer hover:bg-teal-800 transition-colors">
                                <option>General Practice</option>
                                <option>Cardiology</option>
                                <option>Dermatology</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-300 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-teal-200 uppercase tracking-widest">Doctor</label>
                        <div className="relative">
                            <select className="w-full bg-teal-800/50 border border-teal-700 text-white rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-teal-400 focus:outline-none cursor-pointer hover:bg-teal-800 transition-colors">
                                <option>Dr. Sarah Smith</option>
                                <option>Dr. John Doe</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-300 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            <button className="w-full mt-8 bg-white text-primary py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg shadow-teal-900/20 active:scale-95 transform duration-100">
                Book Appointment
            </button>
        </div>
    );
}
