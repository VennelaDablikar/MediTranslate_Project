import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">About MediTranslate</h1>
                    <p className="text-xl text-slate-600">Bridging the gap between medical prescriptions and patient understanding.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Medical prescriptions can be difficult to read and understand, especially when language barriers exist.
                            MediTranslate uses advanced AI to digitize handwritten prescriptions and translate the instructions
                            into your native language (Hindi, Tamil, Telugu, and English).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">How It Works</h2>
                        <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2">
                            <li>Upload a clear photo of your prescription.</li>
                            <li>Our AI reads the handwriting and identifies the medicines.</li>
                            <li>We provide instant translation of dosages and instructions.</li>
                            <li>You can listen to the instructions using our Text-to-Speech feature.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Privacy First</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We process images securely and prioritize your data privacy. No personal health information is shared
                            with third parties without consent.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
