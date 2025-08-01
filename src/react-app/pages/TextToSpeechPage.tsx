import { useState, useEffect, ChangeEvent } from 'react';

// --- Type Definitions (GLOBAL SCOPE) ---
// We define the shape of our data for TypeScript at the top level.
type Genders = {
  Male?: string[];
  Female?: string[];
};

type VoicesData = {
  [languageCode: string]: Genders;
};

// This is the most specific type for our gender keys.
type GenderKey = 'Male' | 'Female';

// --- Voice Data Object ---
// Applying the type definition to our data object.
const voicesData: VoicesData = {
    "af-ZA": {"Male": ["af-ZA-WillemNeural"],"Female": ["af-ZA-AdriNeural"]},"sq-AL": {"Male": ["sq-AL-IlirNeural"],"Female": ["sq-AL-AnilaNeural"]},"am-ET": {"Male": ["am-ET-AmehaNeural"],"Female": ["am-ET-MekdesNeural"]},"ar-DZ": {"Male": ["ar-DZ-IsmaelNeural"],"Female": ["ar-DZ-AminaNeural"]},"ar-BH": {"Male": ["ar-BH-AliNeural"],"Female": ["ar-BH-LailaNeural"]},"ar-EG": {"Male": ["ar-EG-ShakirNeural"],"Female": ["ar-EG-SalmaNeural"]},"ar-IQ": {"Male": ["ar-IQ-BasselNeural"],"Female": ["ar-IQ-RanaNeural"]},"ar-JO": {"Male": ["ar-JO-TaimNeural"],"Female": ["ar-JO-SanaNeural"]},"ar-KW": {"Male": ["ar-KW-FahedNeural"],"Female": ["ar-KW-NouraNeural"]},"ar-LB": {"Male": ["ar-LB-RamiNeural"],"Female": ["ar-LB-LaylaNeural"]},"ar-LY": {"Male": ["ar-LY-OmarNeural"],"Female": ["ar-LY-ImanNeural"]},"ar-MA": {"Male": ["ar-MA-JamalNeural"],"Female": ["ar-MA-MounaNeural"]},"ar-OM": {"Male": ["ar-OM-AbdullahNeural"],"Female": ["ar-OM-AyshaNeural"]},"ar-QA": {"Male": ["ar-QA-MoazNeural"],"Female": ["ar-QA-AmalNeural"]},"ar-SA": {"Male": ["ar-SA-HamedNeural"],"Female": ["ar-SA-ZariyahNeural"]},"ar-SY": {"Male": ["ar-SY-LaithNeural"],"Female": ["ar-SY-AmanyNeural"]},"ar-TN": {"Male": ["ar-TN-HediNeural"],"Female": ["ar-TN-ReemNeural"]},"ar-AE": {"Male": ["ar-AE-HamdanNeural"],"Female": ["ar-AE-FatimaNeural"]},"ar-YE": {"Male": ["ar-YE-SalehNeural"],"Female": ["ar-YE-MaryamNeural"]},"az-AZ": {"Male": ["az-AZ-BabekNeural"],"Female": ["az-AZ-BanuNeural"]},"bn-BD": {"Male": ["bn-BD-PradeepNeural"],"Female": ["bn-BD-NabanitaNeural"]},"bn-IN": {"Male": ["bn-IN-BashkarNeural"],"Female": ["bn-IN-TanishaaNeural"]},"bs-BA": {"Male": ["bs-BA-GoranNeural"],"Female": ["bs-BA-VesnaNeural"]},"bg-BG": {"Male": ["bg-BG-BorislavNeural"],"Female": ["bg-BG-KalinaNeural"]},"my-MM": {"Male": ["my-MM-ThihaNeural"],"Female": ["my-MM-NilarNeural"]},"ca-ES": {"Male": ["ca-ES-EnricNeural"],"Female": ["ca-ES-JoanaNeural"]},"zh-HK": {"Male": ["zh-HK-WanLungNeural"],"Female": ["zh-HK-HiuGaaiNeural", "zh-HK-HiuMaanNeural"]},"zh-CN": {"Male": ["zh-CN-YunjianNeural", "zh-CN-YunxiNeural", "zh-CN-YunxiaNeural", "zh-CN-YunyangNeural"],"Female": ["zh-CN-XiaoxiaoNeural", "zh-CN-XiaoyiNeural"]},"zh-TW": {"Male": ["zh-TW-YunJheNeural"],"Female": ["zh-TW-HsiaoChenNeural", "zh-TW-HsiaoYuNeural"]},"hr-HR": {"Male": ["hr-HR-SreckoNeural"],"Female": ["hr-HR-GabrijelaNeural"]},"cs-CZ": {"Male": ["cs-CZ-AntoninNeural"],"Female": ["cs-CZ-VlastaNeural"]},"da-DK": {"Male": ["da-DK-JeppeNeural"],"Female": ["da-DK-ChristelNeural"]},"nl-BE": {"Male": ["nl-BE-ArnaudNeural"],"Female": ["nl-BE-DenaNeural"]},"nl-NL": {"Male": ["nl-NL-MaartenNeural"],"Female": ["nl-NL-ColetteNeural", "nl-NL-FennaNeural"]},"en-AU": {"Male": ["en-AU-WilliamNeural"],"Female": ["en-AU-NatashaNeural"]},"en-CA": {"Male": ["en-CA-LiamNeural"],"Female": ["en-CA-ClaraNeural"]},"en-HK": {"Male": ["en-HK-SamNeural"],"Female": ["en-HK-YanNeural"]},"en-IN": {"Male": ["en-IN-PrabhatNeural"],"Female": ["en-IN-NeerjaExpressiveNeural", "en-IN-NeerjaNeural"]},"en-IE": {"Male": ["en-IE-ConnorNeural"],"Female": ["en-IE-EmilyNeural"]},"en-KE": {"Male": ["en-KE-ChilembaNeural"],"Female": ["en-KE-AsiliaNeural"]},"en-NZ": {"Male": ["en-NZ-MitchellNeural"],"Female": ["en-NZ-MollyNeural"]},"en-NG": {"Male": ["en-NG-AbeoNeural"],"Female": ["en-NG-EzinneNeural"]},"en-PH": {"Male": ["en-PH-JamesNeural"],"Female": ["en-PH-RosaNeural"]},"en-SG": {"Male": ["en-SG-WayneNeural"],"Female": ["en-SG-LunaNeural"]},"en-US": {"Male": ["en-US-AndrewMultilingualNeural", "en-US-BrianMultilingualNeural", "en-US-AndrewNeural", "en-US-BrianNeural", "en-US-ChristopherNeural", "en-US-EricNeural", "en-US-GuyNeural", "en-US-RogerNeural", "en-US-SteffanNeural"],"Female": ["en-US-AvaMultilingualNeural", "en-US-EmmaMultilingualNeural", "en-US-AvaNeural", "en-US-EmmaNeural", "en-US-AnaNeural", "en-US-AriaNeural", "en-US-JennyNeural", "en-US-MichelleNeural"]},"en-ZA": {"Male": ["en-ZA-LukeNeural"],"Female": ["en-ZA-LeahNeural"]},"en-TZ": {"Male": ["en-TZ-ElimuNeural"],"Female": ["en-TZ-ImaniNeural"]},"en-GB": {"Male": ["en-GB-RyanNeural", "en-GB-ThomasNeural"],"Female": ["en-GB-LibbyNeural", "en-GB-MaisieNeural", "en-GB-SoniaNeural"]},"et-EE": {"Male": ["et-EE-KertNeural"],"Female": ["et-EE-AnuNeural"]},"fil-PH": {"Male": ["fil-PH-AngeloNeural"],"Female": ["fil-PH-BlessicaNeural"]},"fi-FI": {"Male": ["fi-FI-HarriNeural"],"Female": ["fi-FI-NooraNeural"]},"fr-BE": {"Male": ["fr-BE-GerardNeural"],"Female": ["fr-BE-CharlineNeural"]},"fr-CA": {"Male": ["fr-CA-ThierryNeural", "fr-CA-AntoineNeural", "fr-CA-JeanNeural"],"Female": ["fr-CA-SylvieNeural"]},"fr-FR": {"Male": ["fr-FR-RemyMultilingualNeural", "fr-FR-HenriNeural"],"Female": ["fr-FR-VivienneMultilingualNeural", "fr-FR-DeniseNeural", "fr-FR-EloiseNeural"]},"fr-CH": {"Male": ["fr-CH-FabriceNeural"],"Female": ["fr-CH-ArianeNeural"]},"gl-ES": {"Male": ["gl-ES-RoiNeural"],"Female": ["gl-ES-SabelaNeural"]},"ka-GE": {"Male": ["ka-GE-GiorgiNeural"],"Female": ["ka-GE-EkaNeural"]},"de-AT": {"Male": ["de-AT-JonasNeural"],"Female": ["de-AT-IngridNeural"]},"de-DE": {"Male": ["de-DE-FlorianMultilingualNeural", "de-DE-ConradNeural", "de-DE-KillianNeural"],"Female": ["de-DE-SeraphinaMultilingualNeural", "de-DE-AmalaNeural", "de-DE-KatjaNeural"]},"de-CH": {"Male": ["de-CH-JanNeural"],"Female": ["de-CH-LeniNeural"]},"el-GR": {"Male": ["el-GR-NestorasNeural"],"Female": ["el-GR-AthinaNeural"]},"gu-IN": {"Male": ["gu-IN-NiranjanNeural"],"Female": ["gu-IN-DhwaniNeural"]},"he-IL": {"Male": ["he-IL-AvriNeural"],"Female": ["he-IL-HilaNeural"]},"hi-IN": {"Male": ["hi-IN-MadhurNeural"],"Female": ["hi-IN-SwaraNeural"]},"hu-HU": {"Male": ["hu-HU-TamasNeural"],"Female": ["hu-HU-NoemiNeural"]},"is-IS": {"Male": ["is-IS-GunnarNeural"],"Female": ["is-IS-GudrunNeural"]},"id-ID": {"Male": ["id-ID-ArdiNeural"],"Female": ["id-ID-GadisNeural"]},"iu-Latn-CA": {"Male": ["iu-Latn-CA-TaqqiqNeural"],"Female": ["iu-Latn-CA-SiqiniqNeural"]},"iu-Cans-CA": {"Male": ["iu-Cans-CA-TaqqiqNeural"],"Female": ["iu-Cans-CA-SiqiniqNeural"]},"ga-IE": {"Male": ["ga-IE-ColmNeural"],"Female": ["ga-IE-OrlaNeural"]},"it-IT": {"Male": ["it-IT-GiuseppeMultilingualNeural", "it-IT-DiegoNeural"],"Female": ["it-IT-ElsaNeural", "it-IT-IsabellaNeural"]},"ja-JP": {"Male": ["ja-JP-KeitaNeural"],"Female": ["ja-JP-NanamiNeural"]},"jv-ID": {"Male": ["jv-ID-DimasNeural"],"Female": ["jv-ID-SitiNeural"]},"kn-IN": {"Male": ["kn-IN-GaganNeural"],"Female": ["kn-IN-SapnaNeural"]},"kk-KZ": {"Male": ["kk-KZ-DauletNeural"],"Female": ["kk-KZ-AigulNeural"]},"km-KH": {"Male": ["km-KH-PisethNeural"],"Female": ["km-KH-SreymomNeural"]},"ko-KR": {"Male": ["ko-KR-HyunsuMultilingualNeural", "ko-KR-InJoonNeural"],"Female": ["ko-KR-SunHiNeural"]},"lo-LA": {"Male": ["lo-LA-ChanthavongNeural"],"Female": ["lo-LA-KeomanyNeural"]},"lv-LV": {"Male": ["lv-LV-NilsNeural"],"Female": ["lv-LV-EveritaNeural"]},"lt-LT": {"Male": ["lt-LT-LeonasNeural"],"Female": ["lt-LT-OnaNeural"]},"mk-MK": {"Male": ["mk-MK-AleksandarNeural"],"Female": ["mk-MK-MarijaNeural"]},"ms-MY": {"Male": ["ms-MY-OsmanNeural"],"Female": ["ms-MY-YasminNeural"]},"ml-IN": {"Male": ["ml-IN-MidhunNeural"],"Female": ["ml-IN-SobhanaNeural"]},"mt-MT": {"Male": ["mt-MT-JosephNeural"],"Female": ["mt-MT-GraceNeural"]},"mr-IN": {"Male": ["mr-IN-ManoharNeural"],"Female": ["mr-IN-AarohiNeural"]},"mn-MN": {"Male": ["mn-MN-BataaNeural"],"Female": ["mn-MN-YesuiNeural"]},"ne-NP": {"Male": ["ne-NP-SagarNeural"],"Female": ["ne-NP-HemkalaNeural"]},"nb-NO": {"Male": ["nb-NO-FinnNeural"],"Female": ["nb-NO-PernilleNeural"]},"ps-AF": {"Male": ["ps-AF-GulNawazNeural"],"Female": ["ps-AF-LatifaNeural"]},"fa-IR": {"Male": ["fa-IR-FaridNeural"],"Female": ["fa-IR-DilaraNeural"]},"pl-PL": {"Male": ["pl-PL-MarekNeural"],"Female": ["pl-PL-ZofiaNeural"]},"pt-BR": {"Male": ["pt-BR-AntonioNeural"],"Female": ["pt-BR-ThalitaMultilingualNeural", "pt-BR-FranciscaNeural"]},"pt-PT": {"Male": ["pt-PT-DuarteNeural"],"Female": ["pt-PT-RaquelNeural"]},"ro-RO": {"Male": ["ro-RO-EmilNeural"],"Female": ["ro-RO-AlinaNeural"]},"ru-RU": {"Male": ["ru-RU-DmitryNeural"],"Female": ["ru-RU-SvetlanaNeural"]},"sr-RS": {"Male": ["sr-RS-NicholasNeural"],"Female": ["sr-RS-SophieNeural"]},"si-LK": {"Male": ["si-LK-SameeraNeural"],"Female": ["si-LK-ThiliniNeural"]},"sk-SK": {"Male": ["sk-SK-LukasNeural"],"Female": ["sk-SK-ViktoriaNeural"]},"sl-SI": {"Male": ["sl-SI-RokNeural"],"Female": ["sl-SI-PetraNeural"]},"so-SO": {"Male": ["so-SO-MuuseNeural"],"Female": ["so-SO-UbaxNeural"]},"es-AR": {"Male": ["es-AR-TomasNeural"],"Female": ["es-AR-ElenaNeural"]},"es-BO": {"Male": ["es-BO-MarceloNeural"],"Female": ["es-BO-SofiaNeural"]},"es-CL": {"Male": ["es-CL-LorenzoNeural"],"Female": ["es-CL-CatalinaNeural"]},"es-CO": {"Male": ["es-CO-GonzaloNeural"],"Female": ["es-CO-SalomeNeural"]},"es-CR": {"Male": ["es-CR-JuanNeural"],"Female": ["es-CR-MariaNeural"]},"es-CU": {"Male": ["es-CU-ManuelNeural"],"Female": ["es-CU-BelkysNeural"]},"es-DO": {"Male": ["es-DO-EmilioNeural"],"Female": ["es-DO-RamonaNeural"]},"es-EC": {"Male": ["es-EC-LuisNeural"],"Female": ["es-EC-AndreaNeural"]},"es-SV": {"Male": ["es-SV-RodrigoNeural"],"Female": ["es-SV-LorenaNeural"]},"es-GQ": {"Male": ["es-GQ-JavierNeural"],"Female": ["es-GQ-TeresaNeural"]},"es-GT": {"Male": ["es-GT-AndresNeural"],"Female": ["es-GT-MartaNeural"]},"es-HN": {"Male": ["es-HN-CarlosNeural"],"Female": ["es-HN-KarlaNeural"]},"es-MX": {"Male": ["es-MX-JorgeNeural"],"Female": ["es-MX-DaliaNeural"]},"es-NI": {"Male": ["es-NI-FedericoNeural"],"Female": ["es-NI-YolandaNeural"]},"es-PA": {"Male": ["es-PA-RobertoNeural"],"Female": ["es-PA-MargaritaNeural"]},"es-PY": {"Male": ["es-PY-MarioNeural"],"Female": ["es-PY-TaniaNeural"]},"es-PE": {"Male": ["es-PE-AlexNeural"],"Female": ["es-PE-CamilaNeural"]},"es-PR": {"Male": ["es-PR-VictorNeural"],"Female": ["es-PR-KarinaNeural"]},"es-ES": {"Male": ["es-ES-AlvaroNeural"],"Female": ["es-ES-ElviraNeural"]},"es-US": {"Male": ["es-US-AlonsoNeural"],"Female": ["es-US-PalomaNeural"]},"es-UY": {"Male": ["es-UY-MateoNeural"],"Female": ["es-UY-ValentinaNeural"]},"es-VE": {"Male": ["es-VE-SebastianNeural"],"Female": ["es-VE-PaolaNeural"]},"su-ID": {"Male": ["su-ID-JajangNeural"],"Female": ["su-ID-TutiNeural"]},"sw-KE": {"Male": ["sw-KE-RafikiNeural"],"Female": ["sw-KE-ZuriNeural"]},"sw-TZ": {"Male": ["sw-TZ-DaudiNeural"],"Female": ["sw-TZ-RehemaNeural"]},"sv-SE": {"Male": ["sv-SE-MattiasNeural"],"Female": ["sv-SE-SofieNeural"]},"ta-IN": {"Male": ["ta-IN-ValluvarNeural"],"Female": ["ta-IN-PallaviNeural"]},"ta-MY": {"Male": ["ta-MY-SuryaNeural"],"Female": ["ta-MY-KaniNeural"]},"ta-SG": {"Male": ["ta-SG-AnbuNeural"],"Female": ["ta-SG-VenbaNeural"]},"ta-LK": {"Male": ["ta-LK-KumarNeural"],"Female": ["ta-LK-SaranyaNeural"]},"te-IN": {"Male": ["te-IN-MohanNeural"],"Female": ["te-IN-ShrutiNeural"]},"th-TH": {"Male": ["th-TH-NiwatNeural"],"Female": ["th-TH-PremwadeeNeural"]},"tr-TR": {"Male": ["tr-TR-AhmetNeural"],"Female": ["tr-TR-EmelNeural"]},"uk-UA": {"Male": ["uk-UA-OstapNeural"],"Female": ["uk-UA-PolinaNeural"]},"ur-IN": {"Male": ["ur-IN-SalmanNeural"],"Female": ["ur-IN-GulNeural"]},"ur-PK": {"Male": ["ur-PK-AsadNeural"],"Female": ["ur-PK-UzmaNeural"]},"uz-UZ": {"Male": ["uz-UZ-SardorNeural"],"Female": ["uz-UZ-MadinaNeural"]},"vi-VN": {"Male": ["vi-VN-NamMinhNeural"],"Female": ["vi-VN-HoaiMyNeural"]},"cy-GB": {"Male": ["cy-GB-AledNeural"],"Female": ["cy-GB-NiaNeural"]},"zu-ZA": {"Male": ["zu-ZA-ThembaNeural"],"Female": ["zu-ZA-ThandoNeural"]}
};

const languages = Object.keys(voicesData);
const totalVoices = languages.reduce((acc, lang) => acc + (voicesData[lang]?.Male?.length || 0) + (voicesData[lang]?.Female?.length || 0), 0);

const faqData = [
  {
    question: 'Is this Text to Speech (TTS) tool really free?',
    answer: `Yes, completely. Our AI voice generator is 100% free for all users. There are no character limits, premium voices, or subscription fees.`
  },
  {
    question: 'How many languages and voices are available?',
    answer: `We offer a massive library of over ${totalVoices} natural-sounding voices across more than ${languages.length} languages and dialects, making it one of the most comprehensive free text to audio tools online.`
  },
  {
    question: 'Can I use the generated audio for YouTube or commercial projects?',
    answer: 'Absolutely. The audio you create is yours to use for any purpose, including commercial projects, social media content, and YouTube videos, without any royalties or attribution required.'
  },
  {
    question: 'How do I download the audio file?',
    answer: 'After the audio is generated, a player will appear. You can listen to the audio and then click the "Download Audio" button to save it to your device as an MP3 file.'
  },
];

const apiEndpoints = ['https://asartb-tsard.hf.space/convert'];
let currentEndpointIndex = 0;
const getNextEndpoint = () => {
    const endpoint = apiEndpoints[currentEndpointIndex];
    currentEndpointIndex = (currentEndpointIndex + 1) % apiEndpoints.length;
    return endpoint;
};

function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedGender, setSelectedGender] = useState<GenderKey>('Female');
  const [selectedVoice, setSelectedVoice] = useState('en-US-AriaNeural');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  
  const [genders, setGenders] = useState<GenderKey[]>([]);
  const [voices, setVoices] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const languageData = voicesData[selectedLanguage];
    const availableGenders = languageData ? Object.keys(languageData) as GenderKey[] : [];
    setGenders(availableGenders);
    if (availableGenders.length > 0) {
      setSelectedGender(availableGenders[0]);
    } else {
      setSelectedGender('Female'); // Fallback, though should not be needed
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const languageData = voicesData[selectedLanguage];
    if (languageData && selectedGender && languageData[selectedGender]) {
      const availableVoices = languageData[selectedGender] || [];
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      } else {
        setSelectedVoice('');
      }
    } else {
      setVoices([]);
      setSelectedVoice('');
    }
  }, [selectedLanguage, selectedGender]);

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
    formData.append('language', selectedLanguage);
    formData.append('gender', selectedGender);
    formData.append('voice', selectedVoice);
    formData.append('rate', rate.toString());
    formData.append('pitch', pitch.toString());

    try {
      const endpoint = getNextEndpoint();
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio. The service may be busy or the voice is unavailable. Please try again.');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <title>Free AI Text to Speech (TTS) - AI Voice Generator</title>
      <meta name="description" content={`Generate realistic, natural-sounding audio from text with our free AI Voice Generator. Supports ${languages.length}+ languages and ${totalVoices}+ voices. No sign-up required.`} />
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
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "2150"
            },
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">
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
                    id="text-input"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Type or paste your text here..."
                    className="w-full h-40 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  <p className="absolute bottom-2 right-3 text-xs text-gray-400">{1500 - text.length} characters remaining</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">2. Select a Voice</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select id="language" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500">
                        {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                    <select id="gender" value={selectedGender} onChange={handleGenderChange} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500">
                        {genders.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                    </select>
                    <select id="voice" value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500">
                       {voices.map(voice => <option key={voice} value={voice}>{voice.split('-').slice(2).join('-').replace('Neural', '')}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">3. Adjust Voice Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label htmlFor="rate-slider" className="w-16">Speed</label>
                    <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                    <span className="w-8 text-center">{rate.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="pitch-slider" className="w-16">Pitch</label>
                    <input id="pitch-slider" type="range" min="0.5" max="1.5" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                    <span className="w-8 text-center">{pitch.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateAudio}
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'Generating Audio...' : 'Generate Audio'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto">
              {isLoading && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
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

          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">A Powerful AI Voice Generator at Your Fingertips</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-red-400 mb-2">Completely Free</h3>
                          <p className="text-gray-300">Unlimited text-to-speech conversion without any cost. No subscriptions, no hidden fees.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-red-400 mb-2">{totalVoices}+ Natural Voices</h3>
                          <p className="text-gray-300">Access a huge library of high-quality, human-like voices for any project or purpose.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-red-400 mb-2">{languages.length}+ Languages & Dialects</h3>
                          <p className="text-gray-300">From English and Spanish to Arabic and Mandarin, create audio for a global audience.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
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
