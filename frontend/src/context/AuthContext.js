"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            if (_event === 'SIGNED_OUT') {
                router.refresh();
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const value = {
        user,
        loading,
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signUp: (data) => supabase.auth.signUp(data),
        signOut: () => {
            if (user?.isGuest) {
                setUser(null);
                router.refresh();
                router.push('/');
                return Promise.resolve();
            }
            return supabase.auth.signOut();
        },
        loginAsGuest: () => {
            setUser({ id: 'guest', email: 'guest@meditranslate.com', isGuest: true, user_metadata: { full_name: 'Guest User' } });
            router.push('/dashboard');
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
