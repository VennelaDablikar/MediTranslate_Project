"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

interface AudioContextType {
    playAudio: (url: string, onEnded?: () => void) => Promise<void>;
    stopAudio: () => void;
    isPlaying: boolean;
}

const AudioPlayerContext = createContext<AudioContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const onEndedRef = useRef<(() => void) | undefined>(undefined);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            // Call the cleanup callback of the previous audio if it exists
            if (onEndedRef.current) {
                onEndedRef.current();
                onEndedRef.current = undefined;
            }
        }
    }, []);

    const playAudio = useCallback(async (url: string, onEnded?: () => void) => {
        stopAudio(); // Stop any currently playing audio

        const audio = new Audio(url);
        audioRef.current = audio;
        onEndedRef.current = onEnded;

        audio.onended = () => {
            setIsPlaying(false);
            if (onEnded) onEnded();
            onEndedRef.current = undefined;
        };

        audio.onerror = (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
            if (onEnded) onEnded();
            onEndedRef.current = undefined;
        };

        try {
            await audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.error("Failed to play audio:", error);
            setIsPlaying(false);
            if (onEnded) onEnded();
        }
    }, [stopAudio]);

    return (
        <AudioPlayerContext.Provider value={{ playAudio, stopAudio, isPlaying }}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

export function useAudioPlayer() {
    const context = useContext(AudioPlayerContext);
    if (context === undefined) {
        throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
    }
    return context;
}
