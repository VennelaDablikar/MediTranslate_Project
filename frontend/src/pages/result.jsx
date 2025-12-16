import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Result() {
  const router = useRouter();
  const { text } = router.query;

  const [corrected, setCorrected] = useState('');
  const [entities, setEntities] = useState([]);
  const [dosage, setDosage] = useState([]);
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    if (!text) return;

    setLoading(true);
    console.log('Processing text:', text);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

    // 1. Extract named entities (medical terms)
    fetch(`${backendUrl}/nlp/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('NLP data:', data);
        const ents = data.entities || [];
        setEntities(ents);
        setCorrected(ents.map((e) => e.text).join(', ') || 'No medical terms detected');
      })
      .catch((err) => console.error('NLP error:', err));

    // 2. Extract dosage patterns
    fetch(`${backendUrl}/dosage/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Dosage data:', data);
        setDosage(data.dosages || []);
      })
      .catch((err) => console.error('Dosage error:', err));

    // 3. Translate text
    fetch(`${backendUrl}/translate/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Translate data:', data);
        setTranslation(data.translated_text || 'Unable to translate');
      })
      .catch((err) => console.error('Translation error:', err))
      .finally(() => setLoading(false));
  }, [text]);

  useEffect(() => {
    setUploadedImage(localStorage.getItem('uploadedImage') || '');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">MediTranslate</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/upload" className="text-gray-700 hover:text-indigo-600">
                Upload New
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Translation Result</h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Processing prescription...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Uploaded Image */}
            {uploadedImage && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📷 Uploaded Image</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <img src={uploadedImage} alt="Uploaded prescription" className="max-w-full h-auto rounded-lg shadow-md" />
                </div>
              </div>
            )}

            {/* Extracted Text */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📄 Extracted Text</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
            </div>

            {/* Corrected Text */}
            {corrected && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">✓ Corrected / Summary</h3>
                <p className="text-gray-700">{corrected}</p>
              </div>
            )}

            {/* Named Entities (NER) */}
            {entities && entities.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🏷️ Extracted Entities</h3>
                <ul className="space-y-2">
                  {entities.map((ent, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-gray-700">{ent.text} <span className="text-sm text-gray-400">({ent.type})</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dosage Information */}
            {dosage.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">💊 Dosage Information</h3>
                <ul className="space-y-2">
                  {dosage.map((d, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-gray-700">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Translation */}
            {translation && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌐 Translation</h3>
                <p className="text-gray-700">{translation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link href="/upload" className="flex-1">
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Upload Another
                </button>
              </Link>
              <Link href="/" className="flex-1">
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Back Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
