import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) setUser(userEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f6ff] via-[#dff0ff] to-white">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-md flex items-center justify-center text-white font-bold">MT</div>
            <h1 className="text-2xl font-extrabold text-slate-800">MediTranslate</h1>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex gap-6 text-slate-600">
              <Link href="/upload">Upload</Link>
              <Link href="/history">History</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-700">{user}</span>
                <button onClick={handleLogout} className="text-sm text-slate-600">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-slate-700 hidden sm:inline">Log In</Link>
                <Link href="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600">Log In</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-5xl font-extrabold text-slate-900 leading-tight mb-4">Medical Prescription Translation</h2>
            <p className="text-lg text-slate-700 mb-8">Upload a prescription image and get instant translation, dosage extraction and simple explanations.</p>

            <div className="relative bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-8 shadow-sm">
              <div className="absolute -top-4 right-6">
                <select className="rounded-md border px-3 py-2 bg-white text-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Hindi</option>
                </select>
              </div>

              <div className="flex flex-col items-center text-center py-12">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-4xl mb-4">📷</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Prescription</h3>
                <p className="text-slate-600 mb-6">Drag and drop a prescription, or use the buttons below</p>

                <div className="flex gap-3">
                  <Link href="/upload" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">Browse File</Link>
                  <Link href="/upload" className="px-4 py-2 bg-white border rounded-lg">Take Photo</Link>
                  <Link href="/upload?demo=1" className="px-4 py-2 bg-white border rounded-lg">Try Demo</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-2xl p-8 shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl mb-2">🔎</div>
                  <h4 className="font-semibold">High Accuracy</h4>
                  <p className="text-sm text-slate-600">Accurate DCR and medical translations</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl mb-2">🌐</div>
                  <h4 className="font-semibold">Multi-Language</h4>
                  <p className="text-sm text-slate-600">Translate into 100 languages</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl mb-2">🔊</div>
                  <h4 className="font-semibold">Voice Output</h4>
                  <p className="text-sm text-slate-600">Listen to medicine instructions</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl mb-2">🎁</div>
                  <h4 className="font-semibold">Free</h4>
                  <p className="text-sm text-slate-600">Accessible to everyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Recent Uploads</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-lg shadow flex items-center justify-center">
                <div className="text-3xl">🧾</div>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Features */}
        <section className="mt-12 bg-white rounded-lg p-6 shadow">
          <h4 className="text-xl font-semibold mb-4">Advanced Features</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <h5 className="font-semibold">Named Entity Recognition</h5>
              <p className="text-sm text-slate-600">Identify medicines, dosages and instructions</p>
            </div>
            <div className="p-4 border rounded">
              <h5 className="font-semibold">NLP Explanations</h5>
              <p className="text-sm text-slate-600">Simple explanations for medical terms</p>
            </div>
            <div className="p-4 border rounded">
              <h5 className="font-semibold">Audio Output</h5>
              <p className="text-sm text-slate-600">Text-to-speech playback for instructions</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-600">
          <p>&copy; {new Date().getFullYear()} MediTranslate. Helping you understand your medications.</p>
        </div>
      </footer>
    </div>
  );
}
