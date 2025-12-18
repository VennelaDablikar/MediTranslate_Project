"use client";

import React from "react";
import { Pill, AlertCircle, ShoppingCart, Volume2, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { useAudioPlayer } from "../context/AudioContext";

interface AnalysisCardProps {
    icon: React.ReactNode;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    stockStatus: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
    targetLanguage?: string;
}

export default function AnalysisCard({
    icon,
    name,
    description,
    price,
    originalPrice,
    stockStatus,
    targetLanguage = "English",
}: AnalysisCardProps) {
    const isLowStock = stockStatus === "LOW STOCK";
    const [isPlaying, setIsPlaying] = useState(false);

    const { playAudio } = useAudioPlayer();

    const handlePlayAudio = async () => {
        try {
            setIsPlaying(true);
            const response = await fetch("http://localhost:8000/audio/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `${name}. ${description}`,
                    language: targetLanguage
                }),
            });

            if (!response.ok) throw new Error("Audio generation failed");

            const data = await response.json();
            const audioUrl = `data:audio/mp3;base64,${data.audio_base64}`;

            await playAudio(audioUrl, () => setIsPlaying(false));
        } catch (error) {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
            alert("Could not play audio. Please try again.");
        }
    };


    return (
        <div className="bg-card p-6 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-border flex flex-col justify-between h-full group">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span
                    className={clsx(
                        "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide",
                        isLowStock
                            ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50"
                            : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                    )}
                >
                    {stockStatus}
                </span>
            </div>

            <div className="space-y-4 flex-1">
                <h3 className="text-xl font-bold text-foreground">{name}</h3>

                <div className="flex items-start gap-2">
                    <AlertCircle className="text-muted-foreground mt-1 shrink-0" size={16} />
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {description}
                    </p>
                    <button
                        onClick={handlePlayAudio}
                        disabled={isPlaying}
                        className="text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10 transition-colors"
                        title="Read aloud"
                    >
                        {isPlaying ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                    </button>
                </div>

                <div className="flex flex-col pt-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Jan Aushadhi Price</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">₹{price}</span>
                        {originalPrice && (
                            <span className="text-sm text-muted-foreground line-through decoration-muted-foreground">
                                ₹{originalPrice}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
                <button
                    onClick={() => window.open(`https://www.1mg.com/search/all?name=${encodeURIComponent(name)}`, '_blank')}
                    className="bg-teal-50 text-teal-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-100 transition-colors border border-teal-200"
                >
                    Buy on 1mg
                    <ShoppingCart size={14} />
                </button>
                <button
                    onClick={() => window.open(`https://www.google.com/search?q=buy+${encodeURIComponent(name)}+online`, '_blank')}
                    className="bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    Search Online
                    <ShoppingCart size={14} />
                </button>
            </div>
        </div>
    );
}
