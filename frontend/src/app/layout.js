import "./globals.css";
import { Inter } from "next/font/google";
import { LanguageProvider } from "../context/LanguageContext";
import { AuthProvider } from "../context/AuthContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "MediTranslate",
    description: "Multilingual Medical Prescription Translator",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <LanguageProvider>
                    <AuthProvider>

                        <div className="min-h-screen bg-slate-50">
                            {children}
                        </div>
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
