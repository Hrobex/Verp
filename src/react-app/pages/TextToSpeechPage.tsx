import { useState, useEffect, ChangeEvent } from 'react';

type Genders = { Male?: string[]; Female?: string[]; };
type LanguageData = { code: string; name: string; genders: Genders; };
type GenderKey = 'Male' | 'Female';

function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-US');
  const [selectedGender, setSelectedGender] = useState<GenderKey>('Female');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voicesData, setVoicesData] = useState<LanguageData[]>([]);
  const [genders, setGenders] = useState<GenderKey[]>([]);
  const [voices, setVoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoicesData = async () => {
      try {
        const response = await fetch('/api/tts-voices');
        if (!response.ok) throw new Error('Could not load voice data.');
        
        const data = await response.json();
        const fetchedVoices: LanguageData[] = data.voices;
        
        setVoicesData(fetchedVoices); 
        
        const initialLang = fetchedVoices.find(lang => lang.code === 'en-US');
        if (initialLang?.genders.Female?.[0]) {
            setSelectedVoice(initialLang.genders.Female[0]);
        }
      } catch (err) {
        setError('Failed to load available voices. Please refresh the page.');
      }
    };
    fetchVoicesData();
  }, []);

  useEffect(() => {
    if (voicesData.length === 0) return;
    const currentLanguage = voicesData.find(lang => lang.code === selectedLanguageCode);
    const availableGenders = currentLanguage ? Object.keys(currentLanguage.genders) as GenderKey[] : [];
    setGenders(availableGenders);
    if (availableGenders.length > 0) {
      const currentSelectedGenderExists = availableGenders.includes(selectedGender);
      setSelectedGender(currentSelectedGenderExists ? selectedGender : availableGenders[0]);
    }
  }, [selectedLanguageCode, voicesData, selectedGender]); // أضفت selectedGender هنا لتحسين المنطق

  useEffect(() => {
    if (voicesData.length === 0) return;
    const currentLanguage = voicesData.find(lang => lang.code === selectedLanguageCode);
    if (currentLanguage && selectedGender && currentLanguage.genders[selectedGender]) {
      const availableVoices = currentLanguage.genders[selectedGender] || [];
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0] || '');
    } else {
      setVoices([]);
      setSelectedVoice('');
    }
  }, [selectedLanguageCode, selectedGender, voicesData]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= 1500) {
      setText(newText);
    }
  };
  
  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(e.target.value as GenderKey);
  };

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAudioURL(null);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('language', selectedLanguageCode);
    formData.append('gender', selectedGender);
    formData.append('voice', selectedVoice);
    formData.append('rate', rate.toString());
    formData.append('pitch', pitch.toString());

    try {
      const response = await fetch('/api/tts-generate', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to generate audio. The service may be busy. Please try again.');
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalVoices = voicesData.reduce((acc, lang) => acc + (lang.genders.Male?.length || 0) + (lang.genders.Female?.length || 0), 0);
  const totalLanguages = voicesData.length;

const faqData = [
  { question: 'Is this Text to Speech (TTS) tool really free?', answer: `Yes, completely. Our AI voice generator is 100% free for all users. There are no character limits, premium voices, or subscription fees.`},
  { question: 'How many languages and voices are available?', answer: `We offer a massive library of over ${totalVoices} natural-sounding voices across more than ${totalLanguages} languages and dialects, making it one of the most comprehensive free text to audio tools online.`},
  { question: 'Can I use the generated audio for YouTube or commercial projects?', answer: 'Absolutely. The audio you create is yours to use for any purpose, including commercial projects, social media content, and YouTube videos, without any royalties or attribution required.'},
  { question: 'How do I download the audio file?', answer: 'After the audio is generated, a player will appear. You can listen to the audio and then click the "Download Audio" button to save it to your device as an MP3 file.'},
];
  
  return (
    <>
      <title>Free AI Text to Speech (TTS) - AI Voice Generator</title>
      <meta name="description" content={`Generate realistic, natural-sounding audio from text with our free AI Voice Generator. Supports ${totalLanguages}+ languages and ${totalVoices}+ voices. No sign-up required.`} />
      <link rel="canonical" href="https://aiconvert.online/text-to-speech" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/text-to-speech" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/text-to-speech" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/text-to-speech" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Free AI Text to Speech Generator",
            "description": "A free AI text-to-speech tool that converts text into natural-sounding audio.",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        `}
      </script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Free AI Text to Speech Voice Generator
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Bring your text to life. Convert any text into natural-sounding audio with our free AI voice generator, supporting hundreds of voices and languages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-5">
              
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">1. Enter Your Text</label>
                <div className="relative">
                  <textarea
                    id="text-input" value={text} onChange={handleTextChange} placeholder="Type or paste your text here..."
                    className="w-full h-40 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  <p className="absolute bottom-2 right-3 text-xs text-gray-400">{1500 - text.length} characters remaining</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">2. Select a Voice</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select id="language" value={selectedLanguageCode} onChange={(e) => setSelectedLanguageCode(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500">
                        {voicesData.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                    <select id="gender" value={selectedGender} onChange={handleGenderChange} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500" disabled={genders.length === 0}>
                        {genders.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                    </select>
                    <select id="voice" value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500" disabled={voices.length === 0}>
                       {voices.map(voice => <option key={voice} value={voice}>{voice.split('-').slice(2).join('-').replace('Neural', '')}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">3. Adjust Voice Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label htmlFor="rate-slider" className="w-16">Speed</label>
                    <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <span className="w-8 text-center">{rate.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="pitch-slider" className="w-16">Pitch</label>
                    <input id="pitch-slider" type="range" min="0.5" max="1.5" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <span className="w-8 text-center">{pitch.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateAudio} disabled={isLoading || !selectedVoice}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 rounded-lg hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'Generating Audio...' : 'Generate Audio'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto">
              {isLoading && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                  <p className="text-gray-400">Converting text to natural speech...</p>
                </div>
              )}
              {!isLoading && !audioURL && (
                <div className="text-center text-gray-500 p-4">
                  <p className="text-lg">Your generated audio will appear here</p>
                  <p className="text-sm mt-2">Ready to download as an MP3 file</p>
                </div>
              )}
              {audioURL && (
                <div className="w-full flex flex-col items-center gap-6">
                  <audio controls src={audioURL} className="w-full">Your browser does not support the audio element.</audio>
                  <a href={audioURL} download="generated-audio.mp3" className="w-full py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                    Download Audio (MP3)
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-24">
            <section className="text-center">
    <h2 className="text-3xl font-bold mb-4">A Powerful AI Voice Generator at Your Fingertips</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">Completely Free</h3>
            <p className="text-gray-300">Unlimited text-to-speech conversion without any cost. No subscriptions, no hidden fees.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">315+ Natural Voices</h3>
            <p className="text-gray-300">Access a huge library of high-quality, human-like voices for any project or purpose.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">{totalLanguages}+ Languages & Dialects</h3>
            <p className="text-gray-300">From English and Spanish to Arabic and Mandarin, create audio for a global audience.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">Full Voice Control</h3>
            <p className="text-gray-300">Fine-tune the speech rate and pitch to match the exact tone and style you need for your content.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">No Sign-Up Required</h3>
            <p className="text-gray-300">Generate and download your audio instantly. We value your time and privacy.</p>
        </div>
    </div>
</section>
              
            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">How to Convert Text to Speech in 3 Easy Steps</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        Our intuitive online tool makes creating high-quality audio from text simple for everyone, from content creators to students.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">1. Enter Your Text</p>
                        <p className="text-gray-300">
                            Type or paste the text you want to convert into the text box. You can write anything from a short sentence to a longer paragraph.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">2. Choose Your Voice</p>
                        <p className="text-gray-300">
                            Select the language, gender, and specific voice you prefer. You can also fine-tune the speed and pitch to get the perfect tone for your audio.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">3. Generate & Download</p>
                        <p className="text-gray-300">
                            Click the "Generate Audio" button. In just a moment, your text-to-audio file will be ready to play and download as a high-quality MP3.
                        </p>
                    </div>
                </div>
            </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-red-400 mb-2">{faq.question}</h3>
                              <div className="text-gray-300 leading-relaxed">{faq.answer}</div>
                          </div>
                      ))}
                  </div>
              </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default TextToSpeechPage;
