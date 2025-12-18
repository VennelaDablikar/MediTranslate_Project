"use client";
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Activity, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab');
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide Navbar on Dashboard pages as they have their own Sidebar/TopBar
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const isActive = (path, tab) => {
    if (tab) {
      return pathname === path && activeTab === tab
        ? "bg-blue-600 text-white shadow-md transform scale-105"
        : "text-slate-600 hover:text-blue-600 hover:bg-blue-50";
    }
    return pathname === path && !activeTab
      ? "bg-blue-600 text-white shadow-md transform scale-105"
      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50";
  };

  const MobileLink = ({ href, children }) => (
    <Link
      href={href}
      onClick={() => setIsMenuOpen(false)}
      className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white group-hover:shadow-lg transition">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">MediTranslate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            {user ? (
              // LOGGED IN MENU
              <div className="flex items-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
                <Link href="/dashboard" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive('/dashboard')}`}>
                  Upload
                </Link>
                <Link href="/results/demo?tab=ocr" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive('/results/demo', 'ocr')}`}>
                  Breakdown
                </Link>
                <Link href="/results/demo?tab=translation" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive('/results/demo', 'translation')}`}>
                  Translation
                </Link>
                <Link href="/results/demo?tab=audio" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive('/results/demo', 'audio')}`}>
                  Audio
                </Link>
                <Link href="/about" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive('/about')}`}>
                  About
                </Link>
              </div>
            ) : (
              // PUBLIC MENU - Showing functionality preview
              <div className="flex items-center space-x-1 mr-4">
                <Link href="/dashboard" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-medium transition">Upload</Link>
                <Link href="/results/demo?tab=ocr" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-medium transition">Breakdown</Link>
                <Link href="/results/demo?tab=translation" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-medium transition">Translation</Link>
                <Link href="/results/demo?tab=audio" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-medium transition">Audio</Link>
                <Link href="/about" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-medium transition">About</Link>
              </div>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 hidden xl:inline">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-slate-600 font-semibold hover:text-indigo-600 transition">
                  Log In
                </Link>
                <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl p-4 flex flex-col space-y-2">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-slate-500 border-b border-slate-100 mb-2">Signed in as {user.email}</div>
              <MobileLink href="/dashboard">Upload</MobileLink>
              <MobileLink href="/results/demo?tab=ocr">Breakdown</MobileLink>
              <MobileLink href="/results/demo?tab=translation">Translation</MobileLink>
              <MobileLink href="/results/demo?tab=audio">Audio</MobileLink>
              <MobileLink href="/about">About</MobileLink>
              <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium">
                Log Out
              </button>
            </>
          ) : (
            <>
              <MobileLink href="/dashboard">Upload</MobileLink>
              <MobileLink href="/results/demo?tab=ocr">Breakdown</MobileLink>
              <MobileLink href="/results/demo?tab=translation">Translation</MobileLink>
              <MobileLink href="/results/demo?tab=audio">Audio</MobileLink>
              <MobileLink href="/about">About</MobileLink>
              <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-2">
                <MobileLink href="/login">Log In</MobileLink>
                <MobileLink href="/signup">Sign Up</MobileLink>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-24 bg-white shadow-sm" />}>
      <NavbarContent />
    </Suspense>
  );
}
