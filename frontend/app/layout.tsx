import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediTranslate",
  description: "Scan & Translate Medication",
};

import { AuthProvider } from "./context/AuthContext";
import { AudioPlayerProvider } from "./context/AudioContext";
import { ThemeProvider } from "./components/ThemeProvider";

// ... existing code ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <AudioPlayerProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AudioPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
