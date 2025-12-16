import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Result() {
  const router = useRouter();
  const { text } = router.query;
  const [activeTab, setActiveTab] = useState('ocr');
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState('');
  const [data, setData] = useState({
    extracted_text: '',
    corrected_text: '',
    entities: [],
    translation: '',
    explanation: '',
    dosages: [],
    audio_url: '',
  });

  useEffect(() => {
    if (!text) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        // Simulate processing; replace with real API calls
        setData({
          extracted_text: text,
          corrected_text: 'Aspirin 500mg, twice daily with food. Take for headache pain.',
          entities: [
            { name: 'Aspirin', type: 'MEDICINE', confidence: 0.95 },
            { name: '500mg', type: 'DOSAGE', confidence: 0.92 },
            { name: 'twice daily', type: 'FREQUENCY', confidence: 0.88 },
            { name: 'food', type: 'INSTRUCTION', confidence: 0.85 },
          ],
          translation: 'Take Aspirin 500mg twice daily with food for headache pain relief.',
          explanation: 'Aspirin is a common pain reliever. Take it twice a day (morning and evening) with meals to reduce stomach upset. Use for mild to moderate pain.',
          dosages: ['500mg', 'Twice daily'],
          audio_url: 'sample_audio.mp3',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setUploadedImage(localStorage.getItem('uploadedImage') || '');
      }
    };

    fetchData();
  }, [text]);

  if (!text) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No prescription data found</p>
          <Link href="/upload">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Upload Prescription
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">MediTranslate</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/upload" className="text-gray-700 hover:text-indigo-600 font-medium">
                Upload New
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Prescription Analysis Results</h1>
        <p className="text-gray-600 mb-8">Complete medical prescription breakdown and translation</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing prescription...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {[
                { id: 'ocr', label: '🔍 OCR', icon: '📄' },
                { id: 'ner', label: '🏷️ NER', icon: '🔖' },
                { id: 'translation', label: '🌐 Translation', icon: '🗣️' },
                { id: 'audio', label: '🔊 Audio', icon: '🎵' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-4 font-semibold text-center transition ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* OCR Tab */}
              {activeTab === 'ocr' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📄 OCR - Extracted Text</h2>
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-600">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{data.extracted_text}</p>
                  </div>
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>Corrected:</strong> {data.corrected_text}
                    </p>
                  </div>
                </div>
              )}

              {/* NER Tab */}
              {activeTab === 'ner' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🏷️ NER - Named Entities Recognition</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.entities.map((entity, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">{entity.name}</p>
                            <p className="text-sm text-gray-600">Type: {entity.type}</p>
                          </div>
                          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {(entity.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Translation Tab */}
              {activeTab === 'translation' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🌐 Translation & Explanation</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Simple Translation</h3>
                    <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                      <p className="text-gray-700 text-lg">{data.translation}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Easy Explanation</h3>
                    <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-600">
                      <p className="text-gray-700 text-lg leading-relaxed">{data.explanation}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">💊 Dosage Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {data.dosages.map((dosage, idx) => (
                        <div key={idx} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-purple-900 font-semibold">{dosage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Audio Tab */}
              {activeTab === 'audio' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🔊 Text-to-Speech Audio</h2>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200">
                    <div className="flex flex-col items-center">
                      <div className="text-6xl mb-6">🎵</div>
                      <p className="text-gray-700 mb-6 text-center">Listen to the prescription translation</p>
                      <div className="w-full max-w-md bg-white rounded-lg p-4 shadow-md">
                        <audio
                          controls
                          className="w-full"
                          src={data.audio_url}
                          onError={() => {
                            console.log('No audio file available');
                          }}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Audio player ready. Click play to listen to the prescription in your language.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Image */}
            {uploadedImage && (
              <div className="mt-8 p-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📷 Uploaded Image</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <img src={uploadedImage} alt="Uploaded prescription" className="max-w-full h-auto rounded-lg shadow-md" />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-gray-50 px-8 py-6 flex gap-4">
              <Link href="/upload" className="flex-1">
                <button className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                  📤 Upload Another
                </button>
              </Link>
              <Link href="/" className="flex-1">
                <button className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition">
                  🏠 Back Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
