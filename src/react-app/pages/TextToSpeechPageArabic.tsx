import { useState, useEffect, ChangeEvent } from 'react';

// --- Type Definitions (Identical to English version) ---
type Genders = { Male?: string[]; Female?: string[]; };
type LanguageData = { code: string; name: string; genders: Genders; };
type GenderKey = 'Male' | 'Female';

// --- Voice Data (English Names - for logic) ---
const voicesData: LanguageData[] = [
  { code: "af-ZA", name: "Afrikaans (South Africa)", genders: { Male: ["af-ZA-WillemNeural"], Female: ["af-ZA-AdriNeural"] } },
  { code: "sq-AL", name: "Albanian (Albania)", genders: { Male: ["sq-AL-IlirNeural"], Female: ["sq-AL-AnilaNeural"] } },
  { code: "am-ET", name: "Amharic (Ethiopia)", genders: { Male: ["am-ET-AmehaNeural"], Female: ["am-ET-MekdesNeural"] } },
  { code: "ar-DZ", name: "Arabic (Algeria)", genders: { Male: ["ar-DZ-IsmaelNeural"], Female: ["ar-DZ-AminaNeural"] } },
  { code: "ar-BH", name: "Arabic (Bahrain)", genders: { Male: ["ar-BH-AliNeural"], Female: ["ar-BH-LailaNeural"] } },
  { code: "ar-EG", name: "Arabic (Egypt)", genders: { Male: ["ar-EG-ShakirNeural"], Female: ["ar-EG-SalmaNeural"] } },
  { code: "ar-IQ", name: "Arabic (Iraq)", genders: { Male: ["ar-IQ-BasselNeural"], Female: ["ar-IQ-RanaNeural"] } },
  { code: "ar-JO", name: "Arabic (Jordan)", genders: { Male: ["ar-JO-TaimNeural"], Female: ["ar-JO-SanaNeural"] } },
  { code: "ar-KW", name: "Arabic (Kuwait)", genders: { Male: ["ar-KW-FahedNeural"], Female: ["ar-KW-NouraNeural"] } },
  { code: "ar-LB", name: "Arabic (Lebanon)", genders: { Male: ["ar-LB-RamiNeural"], Female: ["ar-LB-LaylaNeural"] } },
  { code: "ar-LY", name: "Arabic (Libya)", genders: { Male: ["ar-LY-OmarNeural"], Female: ["ar-LY-ImanNeural"] } },
  { code: "ar-MA", name: "Arabic (Morocco)", genders: { Male: ["ar-MA-JamalNeural"], Female: ["ar-MA-MounaNeural"] } },
  { code: "ar-OM", name: "Arabic (Oman)", genders: { Male: ["ar-OM-AbdullahNeural"], Female: ["ar-OM-AyshaNeural"] } },
  { code: "ar-QA", name: "Arabic (Qatar)", genders: { Male: ["ar-QA-MoazNeural"], Female: ["ar-QA-AmalNeural"] } },
  { code: "ar-SA", name: "Arabic (Saudi Arabia)", genders: { Male: ["ar-SA-HamedNeural"], Female: ["ar-SA-ZariyahNeural"] } },
  { code: "ar-SY", name: "Arabic (Syria)", genders: { Male: ["ar-SY-LaithNeural"], Female: ["ar-SY-AmanyNeural"] } },
  { code: "ar-TN", name: "Arabic (Tunisia)", genders: { Male: ["ar-TN-HediNeural"], Female: ["ar-TN-ReemNeural"] } },
  { code: "ar-AE", name: "Arabic (UAE)", genders: { Male: ["ar-AE-HamdanNeural"], Female: ["ar-AE-FatimaNeural"] } },
  { code: "ar-YE", name: "Arabic (Yemen)", genders: { Male: ["ar-YE-SalehNeural"], Female: ["ar-YE-MaryamNeural"] } },
  { code: "az-AZ", name: "Azerbaijani (Azerbaijan)", genders: { Male: ["az-AZ-BabekNeural"], Female: ["az-AZ-BanuNeural"] } },
  { code: "bn-BD", name: "Bengali (Bangladesh)", genders: { Male: ["bn-BD-PradeepNeural"], Female: ["bn-BD-NabanitaNeural"] } },
  { code: "bn-IN", name: "Bengali (India)", genders: { Male: ["bn-IN-BashkarNeural"], Female: ["bn-IN-TanishaaNeural"] } },
  { code: "bs-BA", name: "Bosnian (Bosnia and Herzegovina)", genders: { Male: ["bs-BA-GoranNeural"], Female: ["bs-BA-VesnaNeural"] } },
  { code: "bg-BG", name: "Bulgarian (Bulgaria)", genders: { Male: ["bg-BG-BorislavNeural"], Female: ["bg-BG-KalinaNeural"] } },
  { code: "my-MM", name: "Burmese (Myanmar)", genders: { Male: ["my-MM-ThihaNeural"], Female: ["my-MM-NilarNeural"] } },
  { code: "ca-ES", name: "Catalan (Spain)", genders: { Male: ["ca-ES-EnricNeural"], Female: ["ca-ES-JoanaNeural"] } },
  { code: "zh-HK", name: "Chinese (Cantonese, HK)", genders: { Male: ["zh-HK-WanLungNeural"], Female: ["zh-HK-HiuGaaiNeural", "zh-HK-HiuMaanNeural"] } },
  { code: "zh-CN", name: "Chinese (Mandarin, Simplified)", genders: { Male: ["zh-CN-YunjianNeural", "zh-CN-YunxiNeural", "zh-CN-YunxiaNeural", "zh-CN-YunyangNeural"], Female: ["zh-CN-XiaoxiaoNeural", "zh-CN-XiaoyiNeural"] } },
  { code: "zh-TW", name: "Chinese (Taiwanese Mandarin)", genders: { Male: ["zh-TW-YunJheNeural"], Female: ["zh-TW-HsiaoChenNeural", "zh-TW-HsiaoYuNeural"] } },
  { code: "hr-HR", name: "Croatian (Croatia)", genders: { Male: ["hr-HR-SreckoNeural"], Female: ["hr-HR-GabrijelaNeural"] } },
  { code: "cs-CZ", name: "Czech (Czech Republic)", genders: { Male: ["cs-CZ-AntoninNeural"], Female: ["cs-CZ-VlastaNeural"] } },
  { code: "da-DK", name: "Danish (Denmark)", genders: { Male: ["da-DK-JeppeNeural"], Female: ["da-DK-ChristelNeural"] } },
  { code: "nl-BE", name: "Dutch (Belgium)", genders: { Male: ["nl-BE-ArnaudNeural"], Female: ["nl-BE-DenaNeural"] } },
  { code: "nl-NL", name: "Dutch (Netherlands)", genders: { Male: ["nl-NL-MaartenNeural"], Female: ["nl-NL-ColetteNeural", "nl-NL-FennaNeural"] } },
  { code: "en-AU", name: "English (Australia)", genders: { Male: ["en-AU-WilliamNeural"], Female: ["en-AU-NatashaNeural"] } },
  { code: "en-CA", name: "English (Canada)", genders: { Male: ["en-CA-LiamNeural"], Female: ["en-CA-ClaraNeural"] } },
  { code: "en-HK", name: "English (Hong Kong)", genders: { Male: ["en-HK-SamNeural"], Female: ["en-HK-YanNeural"] } },
  { code: "en-IN", name: "English (India)", genders: { Male: ["en-IN-PrabhatNeural"], Female: ["en-IN-NeerjaExpressiveNeural", "en-IN-NeerjaNeural"] } },
  { code: "en-IE", name: "English (Ireland)", genders: { Male: ["en-IE-ConnorNeural"], Female: ["en-IE-EmilyNeural"] } },
  { code: "en-KE", name: "English (Kenya)", genders: { Male: ["en-KE-ChilembaNeural"], Female: ["en-KE-AsiliaNeural"] } },
  { code: "en-NZ", name: "English (New Zealand)", genders: { Male: ["en-NZ-MitchellNeural"], Female: ["en-NZ-MollyNeural"] } },
  { code: "en-NG", name: "English (Nigeria)", genders: { Male: ["en-NG-AbeoNeural"], Female: ["en-NG-EzinneNeural"] } },
  { code: "en-PH", name: "English (Philippines)", genders: { Male: ["en-PH-JamesNeural"], Female: ["en-PH-RosaNeural"] } },
  { code: "en-SG", name: "English (Singapore)", genders: { Male: ["en-SG-WayneNeural"], Female: ["en-SG-LunaNeural"] } },
  { code: "en-US", name: "English (United States)", genders: { Male: ["en-US-AndrewMultilingualNeural", "en-US-BrianMultilingualNeural", "en-US-AndrewNeural", "en-US-BrianNeural", "en-US-ChristopherNeural", "en-US-EricNeural", "en-US-GuyNeural", "en-US-RogerNeural", "en-US-SteffanNeural"], Female: ["en-US-AvaMultilingualNeural", "en-US-EmmaMultilingualNeural", "en-US-AvaNeural", "en-US-EmmaNeural", "en-US-AnaNeural", "en-US-AriaNeural", "en-US-JennyNeural", "en-US-MichelleNeural"] } },
  { code: "en-ZA", name: "English (South Africa)", genders: { Male: ["en-ZA-LukeNeural"], Female: ["en-ZA-LeahNeural"] } },
  { code: "en-TZ", name: "English (Tanzania)", genders: { Male: ["en-TZ-ElimuNeural"], Female: ["en-TZ-ImaniNeural"] } },
  { code: "en-GB", name: "English (United Kingdom)", genders: { Male: ["en-GB-RyanNeural", "en-GB-ThomasNeural"], Female: ["en-GB-LibbyNeural", "en-GB-MaisieNeural", "en-GB-SoniaNeural"] } },
  { code: "et-EE", name: "Estonian (Estonia)", genders: { Male: ["et-EE-KertNeural"], Female: ["et-EE-AnuNeural"] } },
  { code: "fil-PH", name: "Filipino (Philippines)", genders: { Male: ["fil-PH-AngeloNeural"], Female: ["fil-PH-BlessicaNeural"] } },
  { code: "fi-FI", name: "Finnish (Finland)", genders: { Male: ["fi-FI-HarriNeural"], Female: ["fi-FI-NooraNeural"] } },
  { code: "fr-BE", name: "French (Belgium)", genders: { Male: ["fr-BE-GerardNeural"], Female: ["fr-BE-CharlineNeural"] } },
  { code: "fr-CA", name: "French (Canada)", genders: { Male: ["fr-CA-ThierryNeural", "fr-CA-AntoineNeural", "fr-CA-JeanNeural"], Female: ["fr-CA-SylvieNeural"] } },
  { code: "fr-FR", name: "French (France)", genders: { Male: ["fr-FR-RemyMultilingualNeural", "fr-FR-HenriNeural"], Female: ["fr-FR-VivienneMultilingualNeural", "fr-FR-DeniseNeural", "fr-FR-EloiseNeural"] } },
  { code: "fr-CH", name: "French (Switzerland)", genders: { Male: ["fr-CH-FabriceNeural"], Female: ["fr-CH-ArianeNeural"] } },
  { code: "gl-ES", name: "Galician (Spain)", genders: { Male: ["gl-ES-RoiNeural"], Female: ["gl-ES-SabelaNeural"] } },
  { code: "ka-GE", name: "Georgian (Georgia)", genders: { Male: ["ka-GE-GiorgiNeural"], Female: ["ka-GE-EkaNeural"] } },
  { code: "de-AT", name: "German (Austria)", genders: { Male: ["de-AT-JonasNeural"], Female: ["de-AT-IngridNeural"] } },
  { code: "de-DE", name: "German (Germany)", genders: { Male: ["de-DE-FlorianMultilingualNeural", "de-DE-ConradNeural", "de-DE-KillianNeural"], Female: ["de-DE-SeraphinaMultilingualNeural", "de-DE-AmalaNeural", "de-DE-KatjaNeural"] } },
  { code: "de-CH", name: "German (Switzerland)", genders: { Male: ["de-CH-JanNeural"], Female: ["de-CH-LeniNeural"] } },
  { code: "el-GR", name: "Greek (Greece)", genders: { Male: ["el-GR-NestorasNeural"], Female: ["el-GR-AthinaNeural"] } },
  { code: "gu-IN", name: "Gujarati (India)", genders: { Male: ["gu-IN-NiranjanNeural"], Female: ["gu-IN-DhwaniNeural"] } },
  { code: "he-IL", name: "Hebrew (Israel)", genders: { Male: ["he-IL-AvriNeural"], Female: ["he-IL-HilaNeural"] } },
  { code: "hi-IN", name: "Hindi (India)", genders: { Male: ["hi-IN-MadhurNeural"], Female: ["hi-IN-SwaraNeural"] } },
  { code: "hu-HU", name: "Hungarian (Hungary)", genders: { Male: ["hu-HU-TamasNeural"], Female: ["hu-HU-NoemiNeural"] } },
  { code: "is-IS", name: "Icelandic (Iceland)", genders: { Male: ["is-IS-GunnarNeural"], Female: ["is-IS-GudrunNeural"] } },
  { code: "id-ID", name: "Indonesian (Indonesia)", genders: { Male: ["id-ID-ArdiNeural"], Female: ["id-ID-GadisNeural"] } },
  { code: "ga-IE", name: "Irish (Ireland)", genders: { Male: ["ga-IE-ColmNeural"], Female: ["ga-IE-OrlaNeural"] } },
  { code: "it-IT", name: "Italian (Italy)", genders: { Male: ["it-IT-GiuseppeMultilingualNeural", "it-IT-DiegoNeural"], Female: ["it-IT-ElsaNeural", "it-IT-IsabellaNeural"] } },
  { code: "ja-JP", name: "Japanese (Japan)", genders: { Male: ["ja-JP-KeitaNeural"], Female: ["ja-JP-NanamiNeural"] } },
  { code: "jv-ID", name: "Javanese (Indonesia)", genders: { Male: ["jv-ID-DimasNeural"], Female: ["jv-ID-SitiNeural"] } },
  { code: "kn-IN", name: "Kannada (India)", genders: { Male: ["kn-IN-GaganNeural"], Female: ["kn-IN-SapnaNeural"] } },
  { code: "kk-KZ", name: "Kazakh (Kazakhstan)", genders: { Male: ["kk-KZ-DauletNeural"], Female: ["kk-KZ-AigulNeural"] } },
  { code: "km-KH", name: "Khmer (Cambodia)", genders: { Male: ["km-KH-PisethNeural"], Female: ["km-KH-SreymomNeural"] } },
  { code: "ko-KR", name: "Korean (South Korea)", genders: { Male: ["ko-KR-HyunsuMultilingualNeural", "ko-KR-InJoonNeural"], Female: ["ko-KR-SunHiNeural"] } },
  { code: "lo-LA", name: "Lao (Laos)", genders: { Male: ["lo-LA-ChanthavongNeural"], Female: ["lo-LA-KeomanyNeural"] } },
  { code: "lv-LV", name: "Latvian (Latvia)", genders: { Male: ["lv-LV-NilsNeural"], Female: ["lv-LV-EveritaNeural"] } },
  { code: "lt-LT", name: "Lithuanian (Lithuania)", genders: { Male: ["lt-LT-LeonasNeural"], Female: ["lt-LT-OnaNeural"] } },
  { code: "mk-MK", name: "Macedonian (North Macedonia)", genders: { Male: ["mk-MK-AleksandarNeural"], Female: ["mk-MK-MarijaNeural"] } },
  { code: "ms-MY", name: "Malay (Malaysia)", genders: { Male: ["ms-MY-OsmanNeural"], Female: ["ms-MY-YasminNeural"] } },
  { code: "ml-IN", name: "Malayalam (India)", genders: { Male: ["ml-IN-MidhunNeural"], Female: ["ml-IN-SobhanaNeural"] } },
  { code: "mt-MT", name: "Maltese (Malta)", genders: { Male: ["mt-MT-JosephNeural"], Female: ["mt-MT-GraceNeural"] } },
  { code: "mr-IN", name: "Marathi (India)", genders: { Male: ["mr-IN-ManoharNeural"], Female: ["mr-IN-AarohiNeural"] } },
  { code: "mn-MN", name: "Mongolian (Mongolia)", genders: { Male: ["mn-MN-BataaNeural"], Female: ["mn-MN-YesuiNeural"] } },
  { code: "ne-NP", name: "Nepali (Nepal)", genders: { Male: ["ne-NP-SagarNeural"], Female: ["ne-NP-HemkalaNeural"] } },
  { code: "nb-NO", name: "Norwegian Bokmål (Norway)", genders: { Male: ["nb-NO-FinnNeural"], Female: ["nb-NO-PernilleNeural"] } },
  { code: "ps-AF", name: "Pashto (Afghanistan)", genders: { Male: ["ps-AF-GulNawazNeural"], Female: ["ps-AF-LatifaNeural"] } },
  { code: "fa-IR", name: "Persian (Iran)", genders: { Male: ["fa-IR-FaridNeural"], Female: ["fa-IR-DilaraNeural"] } },
  { code: "pl-PL", name: "Polish (Poland)", genders: { Male: ["pl-PL-MarekNeural"], Female: ["pl-PL-ZofiaNeural"] } },
  { code: "pt-BR", name: "Portuguese (Brazil)", genders: { Male: ["pt-BR-AntonioNeural"], Female: ["pt-BR-ThalitaMultilingualNeural", "pt-BR-FranciscaNeural"] } },
  { code: "pt-PT", name: "Portuguese (Portugal)", genders: { Male: ["pt-PT-DuarteNeural"], Female: ["pt-PT-RaquelNeural"] } },
  { code: "ro-RO", name: "Romanian (Romania)", genders: { Male: ["ro-RO-EmilNeural"], Female: ["ro-RO-AlinaNeural"] } },
  { code: "ru-RU", name: "Russian (Russia)", genders: { Male: ["ru-RU-DmitryNeural"], Female: ["ru-RU-SvetlanaNeural"] } },
  { code: "sr-RS", name: "Serbian (Serbia)", genders: { Male: ["sr-RS-NicholasNeural"], Female: ["sr-RS-SophieNeural"] } },
  { code: "si-LK", name: "Sinhala (Sri Lanka)", genders: { Male: ["si-LK-SameeraNeural"], Female: ["si-LK-ThiliniNeural"] } },
  { code: "sk-SK", name: "Slovak (Slovakia)", genders: { Male: ["sk-SK-LukasNeural"], Female: ["sk-SK-ViktoriaNeural"] } },
  { code: "sl-SI", name: "Slovenian (Slovenia)", genders: { Male: ["sl-SI-RokNeural"], Female: ["sl-SI-PetraNeural"] } },
  { code: "so-SO", name: "Somali (Somalia)", genders: { Male: ["so-SO-MuuseNeural"], Female: ["so-SO-UbaxNeural"] } },
  { code: "es-AR", name: "Spanish (Argentina)", genders: { Male: ["es-AR-TomasNeural"], Female: ["es-AR-ElenaNeural"] } },
  { code: "es-BO", name: "Spanish (Bolivia)", genders: { Male: ["es-BO-MarceloNeural"], Female: ["es-BO-SofiaNeural"] } },
  { code: "es-CL", name: "Spanish (Chile)", genders: { Male: ["es-CL-LorenzoNeural"], Female: ["es-CL-CatalinaNeural"] } },
  { code: "es-CO", name: "Spanish (Colombia)", genders: { Male: ["es-CO-GonzaloNeural"], Female: ["es-CO-SalomeNeural"] } },
  { code: "es-CR", name: "Spanish (Costa Rica)", genders: { Male: ["es-CR-JuanNeural"], Female: ["es-CR-MariaNeural"] } },
  { code: "es-CU", name: "Spanish (Cuba)", genders: { Male: ["es-CU-ManuelNeural"], Female: ["es-CU-BelkysNeural"] } },
  { code: "es-DO", name: "Spanish (Dominican Republic)", genders: { Male: ["es-DO-EmilioNeural"], Female: ["es-DO-RamonaNeural"] } },
  { code: "es-EC", name: "Spanish (Ecuador)", genders: { Male: ["es-EC-LuisNeural"], Female: ["es-EC-AndreaNeural"] } },
  { code: "es-SV", name: "Spanish (El Salvador)", genders: { Male: ["es-SV-RodrigoNeural"], Female: ["es-SV-LorenaNeural"] } },
  { code: "es-GQ", name: "Spanish (Equatorial Guinea)", genders: { Male: ["es-GQ-JavierNeural"], Female: ["es-GQ-TeresaNeural"] } },
  { code: "es-GT", name: "Spanish (Guatemala)", genders: { Male: ["es-GT-AndresNeural"], Female: ["es-GT-MartaNeural"] } },
  { code: "es-HN", name: "Spanish (Honduras)", genders: { Male: ["es-HN-CarlosNeural"], Female: ["es-HN-KarlaNeural"] } },
  { code: "es-MX", name: "Spanish (Mexico)", genders: { Male: ["es-MX-JorgeNeural"], Female: ["es-MX-DaliaNeural"] } },
  { code: "es-NI", name: "Spanish (Nicaragua)", genders: { Male: ["es-NI-FedericoNeural"], Female: ["es-NI-YolandaNeural"] } },
  { code: "es-PA", name: "Spanish (Panama)", genders: { Male: ["es-PA-RobertoNeural"], Female: ["es-PA-MargaritaNeural"] } },
  { code: "es-PY", name: "Spanish (Paraguay)", genders: { Male: ["es-PY-MarioNeural"], Female: ["es-PY-TaniaNeural"] } },
  { code: "es-PE", name: "Spanish (Peru)", genders: { Male: ["es-PE-AlexNeural"], Female: ["es-PE-CamilaNeural"] } },
  { code: "es-PR", name: "Spanish (Puerto Rico)", genders: { Male: ["es-PR-VictorNeural"], Female: ["es-PR-KarinaNeural"] } },
  { code: "es-ES", name: "Spanish (Spain)", genders: { Male: ["es-ES-AlvaroNeural"], Female: ["es-ES-ElviraNeural"] } },
  { code: "es-US", name: "Spanish (United States)", genders: { Male: ["es-US-AlonsoNeural"], Female: ["es-US-PalomaNeural"] } },
  { code: "es-UY", name: "Spanish (Uruguay)", genders: { Male: ["es-UY-MateoNeural"], Female: ["es-UY-ValentinaNeural"] } },
  { code: "es-VE", name: "Spanish (Venezuela)", genders: { Male: ["es-VE-SebastianNeural"], Female: ["es-VE-PaolaNeural"] } },
  { code: "su-ID", name: "Sundanese (Indonesia)", genders: { Male: ["su-ID-JajangNeural"], Female: ["su-ID-TutiNeural"] } },
  { code: "sw-KE", name: "Swahili (Kenya)", genders: { Male: ["sw-KE-RafikiNeural"], Female: ["sw-KE-ZuriNeural"] } },
  { code: "sw-TZ", name: "Swahili (Tanzania)", genders: { Male: ["sw-TZ-DaudiNeural"], Female: ["sw-TZ-RehemaNeural"] } },
  { code: "sv-SE", name: "Swedish (Sweden)", genders: { Male: ["sv-SE-MattiasNeural"], Female: ["sv-SE-SofieNeural"] } },
  { code: "ta-IN", name: "Tamil (India)", genders: { Male: ["ta-IN-ValluvarNeural"], Female: ["ta-IN-PallaviNeural"] } },
  { code: "ta-MY", name: "Tamil (Malaysia)", genders: { Male: ["ta-MY-SuryaNeural"], Female: ["ta-MY-KaniNeural"] } },
  { code: "ta-SG", name: "Tamil (Singapore)", genders: { Male: ["ta-SG-AnbuNeural"], Female: ["ta-SG-VenbaNeural"] } },
  { code: "ta-LK", name: "Tamil (Sri Lanka)", genders: { Male: ["ta-LK-KumarNeural"], Female: ["ta-LK-SaranyaNeural"] } },
  { code: "te-IN", name: "Telugu (India)", genders: { Male: ["te-IN-MohanNeural"], Female: ["te-IN-ShrutiNeural"] } },
  { code: "th-TH", name: "Thai (Thailand)", genders: { Male: ["th-TH-NiwatNeural"], Female: ["th-TH-PremwadeeNeural"] } },
  { code: "tr-TR", name: "Turkish (Turkey)", genders: { Male: ["tr-TR-AhmetNeural"], Female: ["tr-TR-EmelNeural"] } },
  { code: "uk-UA", name: "Ukrainian (Ukraine)", genders: { Male: ["uk-UA-OstapNeural"], Female: ["uk-UA-PolinaNeural"] } },
  { code: "ur-IN", name: "Urdu (India)", genders: { Male: ["ur-IN-SalmanNeural"], Female: ["ur-IN-GulNeural"] } },
  { code: "ur-PK", name: "Urdu (Pakistan)", genders: { Male: ["ur-PK-AsadNeural"], Female: ["ur-PK-UzmaNeural"] } },
  { code: "uz-UZ", name: "Uzbek (Uzbekistan)", genders: { Male: ["uz-UZ-SardorNeural"], Female: ["uz-UZ-MadinaNeural"] } },
  { code: "vi-VN", name: "Vietnamese (Vietnam)", genders: { Male: ["vi-VN-NamMinhNeural"], Female: ["vi-VN-HoaiMyNeural"] } },
  { code: "cy-GB", name: "Welsh (United Kingdom)", genders: { Male: ["cy-GB-AledNeural"], Female: ["cy-GB-NiaNeural"] } },
  { code: "zu-ZA", name: "Zulu (South Africa)", genders: { Male: ["zu-ZA-ThembaNeural"], Female: ["zu-ZA-ThandoNeural"] } },
];

// --- Arabic Translation Dictionary ---
const languageNamesArabic: { [key: string]: string } = {
  "af-ZA": "الأفريقانية (جنوب أفريقيا)", "sq-AL": "الألبانية (ألبانيا)", "am-ET": "الأمهرية (إثيوبيا)", "ar-DZ": "العربية (الجزائر)",
  "ar-BH": "العربية (البحرين)", "ar-EG": "العربية (مصر)", "ar-IQ": "العربية (العراق)", "ar-JO": "العربية (الأردن)", "ar-KW": "العربية (الكويت)",
  "ar-LB": "العربية (لبنان)", "ar-LY": "العربية (ليبيا)", "ar-MA": "العربية (المغرب)", "ar-OM": "العربية (عمان)", "ar-QA": "العربية (قطر)",
  "ar-SA": "العربية (السعودية)", "ar-SY": "العربية (سوريا)", "ar-TN": "العربية (تونس)", "ar-AE": "العربية (الإمارات)", "ar-YE": "العربية (اليمن)",
  "az-AZ": "الأذربيجانية (أذربيجان)", "bn-BD": "البنغالية (بنغلاديش)", "bn-IN": "البنغالية (الهند)", "bs-BA": "البوسنية (البوسنة والهرسك)",
  "bg-BG": "البلغارية (بلغاريا)", "my-MM": "البورمية (ميانمار)", "ca-ES": "الكتالونية (إسبانيا)", "zh-HK": "الصينية (الكانتونية، هونغ كونغ)",
  "zh-CN": "الصينية (الماندرين، مبسط)", "zh-TW": "الصينية (الماندرين التايوانية)", "hr-HR": "الكرواتية (كرواتيا)", "cs-CZ": "التشيكية (جمهورية التشيك)",
  "da-DK": "الدانماركية (الدنمارك)", "nl-BE": "الهولندية (بلجيكا)", "nl-NL": "الهولندية (هولندا)", "en-AU": "الإنجليزية (أستراليا)",
  "en-CA": "الإنجليزية (كندا)", "en-HK": "الإنجليزية (هونغ كونغ)", "en-IN": "الإنجليزية (الهند)", "en-IE": "الإنجليزية (أيرلندا)",
  "en-KE": "الإنجليزية (كينيا)", "en-NZ": "الإنجليزية (نيوزيلندا)", "en-NG": "الإنجليزية (نيجيريا)", "en-PH": "الإنجليزية (الفلبين)",
  "en-SG": "الإنجليزية (سنغافورة)", "en-US": "الإنجليزية (الولايات المتحدة)", "en-ZA": "الإنجليزية (جنوب أفريقيا)", "en-TZ": "الإنجليزية (تنزانيا)",
  "en-GB": "الإنجليزية (المملكة المتحدة)", "et-EE": "الإستونية (إستونيا)", "fil-PH": "الفلبينية (الفلبين)", "fi-FI": "الفنلندية (فنلندا)",
  "fr-BE": "الفرنسية (بلجيكا)", "fr-CA": "الفرنسية (كندا)", "fr-FR": "الفرنسية (فرنسا)", "fr-CH": "الفرنسية (سويسرا)",
  "gl-ES": "الجاليكية (إسبانيا)", "ka-GE": "الجورجية (جورجيا)", "de-AT": "الألمانية (النمسا)", "de-DE": "الألمانية (ألمانيا)",
  "de-CH": "الألمانية (سويسرا)", "el-GR": "اليونانية (اليونان)", "gu-IN": "الغوجاراتية (الهند)", "he-IL": "العبرية (إسرائيل)",
  "hi-IN": "الهندية (الهند)", "hu-HU": "المجرية (المجر)", "is-IS": "الأيسلندية (أيسلندا)", "id-ID": "الإندونيسية (إندونيسيا)",
  "ga-IE": "الأيرلندية (أيرلندا)", "it-IT": "الإيطالية (إيطاليا)", "ja-JP": "اليابانية (اليابان)", "jv-ID": "الجاوية (إندونيسيا)",
  "kn-IN": "الكانادا (الهند)", "kk-KZ": "الكازاخستانية (كازاخستان)", "km-KH": "الخميرية (كمبوديا)", "ko-KR": "الكورية (كوريا الجنوبية)",
  "lo-LA": "اللاوية (لاوس)", "lv-LV": "اللاتفية (لاتفيا)", "lt-LT": "الليتوانية (ليتوانيا)", "mk-MK": "المقدونية (مقدونيا الشمالية)",
  "ms-MY": "الملايو (ماليزيا)", "ml-IN": "الماليالامية (الهند)", "mt-MT": "المالطية (مالطا)", "mr-IN": "الماراثية (الهند)",
  "mn-MN": "المنغولية (منغوليا)", "ne-NP": "النيبالية (نيبال)", "nb-NO": "النرويجية (بوكمول، النرويج)", "ps-AF": "البشتوية (أفغانستان)",
  "fa-IR": "الفارسية (إيران)", "pl-PL": "البولندية (بولندا)", "pt-BR": "البرتغالية (البرازيل)", "pt-PT": "البرتغالية (البرتغال)",
  "ro-RO": "الرومانية (رومانيا)", "ru-RU": "الروسية (روسيا)", "sr-RS": "الصربية (صربيا)", "si-LK": "السنهالية (سريلانكا)",
  "sk-SK": "السلوفاكية (سلوفاكيا)", "sl-SI": "السلوفينية (سلوفينيا)", "so-SO": "الصومالية (الصومال)", "es-AR": "الإسبانية (الأرجنتين)",
  "es-BO": "الإسبانية (بوليفيا)", "es-CL": "الإسبانية (تشيلي)", "es-CO": "الإسبانية (كولومبيا)", "es-CR": "الإسبانية (كوستاريكا)",
  "es-CU": "الإسبانية (كوبا)", "es-DO": "الإسبانية (جمهورية الدومينيكان)", "es-EC": "الإسبانية (الإكوادور)", "es-SV": "الإسبانية (السلفادور)",
  "es-GQ": "الإسبانية (غينيا الاستوائية)", "es-GT": "الإسبانية (غواتيمالا)", "es-HN": "الإسبانية (هندوراس)", "es-MX": "الإسبانية (المكسيك)",
  "es-NI": "الإسبانية (نيكاراغوا)", "es-PA": "الإسبانية (بنما)", "es-PY": "الإسبانية (باراغواي)", "es-PE": "الإسبانية (بيرو)",
  "es-PR": "الإسبانية (بورتوريكو)", "es-ES": "الإسبانية (إسبانيا)", "es-US": "الإسبانية (الولايات المتحدة)", "es-UY": "الإسبانية (أوروغواي)",
  "es-VE": "الإسبانية (فنزويلا)", "su-ID": "السوندانية (إندونيسيا)", "sw-KE": "السواحيلية (كينيا)", "sw-TZ": "السواحيلية (تنزانيا)",
  "sv-SE": "السويدية (السويد)", "ta-IN": "التاميلية (الهند)", "ta-MY": "التاميلية (ماليزيا)", "ta-SG": "التاميلية (سنغافورة)",
  "ta-LK": "التاميلية (سريلانكا)", "te-IN": "التيلجو (الهند)", "th-TH": "التايلاندية (تايلاند)", "tr-TR": "التركية (تركيا)",
  "uk-UA": "الأوكرانية (أوكرانيا)", "ur-IN": "الأردية (الهند)", "ur-PK": "الأردية (باكستان)", "uz-UZ": "الأوزبكية (أوزبكستان)",
  "vi-VN": "الفيتنامية (فيتنام)", "cy-GB": "الويلزية (المملكة المتحدة)", "zu-ZA": "الزولو (جنوب أفريقيا)"
};

// --- Utility Calculations ---
const totalVoices = voicesData.reduce((acc, lang) => acc + (lang.genders.Male?.length || 0) + (lang.genders.Female?.length || 0), 0);
const totalLanguages = voicesData.length;

// --- FAQ Data (Arabic) ---
const faqData = [
  { question: 'هل أداة تحويل النص إلى صوت مجانية حقًا؟', answer: `نعم، تمامًا. مولد الصوت بالذكاء الاصطناعي الخاص بنا مجاني 100% لجميع المستخدمين. لا توجد حدود لعدد الأحرف، أو أصوات مميزة مدفوعة، أو رسوم اشتراك.`},
  { question: 'كم عدد اللغات والأصوات المتاحة؟', answer: `نحن نقدم مكتبة ضخمة تضم أكثر من ${totalVoices} صوتًا طبيعيًا في أكثر من ${totalLanguages} لغة ولهجة، مما يجعلها واحدة من أشمل أدوات تحويل الكتابة إلى صوت أونلاين.`},
  { question: 'هل يمكنني استخدام الصوت الذي تم إنشاؤه على يوتيوب أو في مشاريع تجارية؟', answer: 'بالتأكيد. الصوت الذي تقوم بإنشائه هو ملكك ولك كامل الحرية في استخدامه لأي غرض، بما في ذلك المشاريع التجارية ومحتوى وسائل التواصل الاجتماعي ومقاطع الفيديو على يوتيوب، دون أي حقوق أو حاجة لذكر المصدر.'},
  { question: 'كيف يمكنني تحميل الملف الصوتي؟', answer: 'بعد إنشاء الصوت، سيظهر مشغل صوتي. يمكنك الاستماع إليه ثم الضغط على زر "تحميل الصوت" لحفظه على جهازك كملف MP3.'},
];

// --- API Endpoint Management ---
const apiEndpoints = ['https://asartb-tsard.hf.space/convert'];
let currentEndpointIndex = 0;
const getNextEndpoint = () => {
    const endpoint = apiEndpoints[currentEndpointIndex];
    currentEndpointIndex = (currentEndpointIndex + 1) % apiEndpoints.length;
    return endpoint;
};

// --- React Component ---
function TextToSpeechPageArabic() {
  const [text, setText] = useState('');
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('ar-BH'); // Default to Bahrain
  const [selectedGender, setSelectedGender] = useState<GenderKey>('Female');
  const [selectedVoice, setSelectedVoice] = useState('ar-BH-LailaNeural'); // Default to Bahrain Female Voice
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  
  const [genders, setGenders] = useState<GenderKey[]>([]);
  const [voices, setVoices] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentLanguage = voicesData.find(lang => lang.code === selectedLanguageCode);
    const availableGenders = currentLanguage ? Object.keys(currentLanguage.genders) as GenderKey[] : [];
    setGenders(availableGenders);
    if (availableGenders.length > 0) {
      // Keep current gender if available, otherwise switch to the first available
      if (!availableGenders.includes(selectedGender)) {
        setSelectedGender(availableGenders[0]);
      }
    }
  }, [selectedLanguageCode]);

  useEffect(() => {
    const currentLanguage = voicesData.find(lang => lang.code === selectedLanguageCode);
    if (currentLanguage && selectedGender && currentLanguage.genders[selectedGender]) {
      const availableVoices = currentLanguage.genders[selectedGender] || [];
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0] || '');
    } else {
      setVoices([]);
      setSelectedVoice('');
    }
  }, [selectedLanguageCode, selectedGender]);

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
      setError('الرجاء إدخال نص لتحويله إلى كلام.');
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
      const endpoint = getNextEndpoint();
      const response = await fetch(endpoint, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('فشل توليد الصوت. قد تكون الخدمة مشغولة. الرجاء المحاولة مرة أخرى.');
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير معروف.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <title>تحويل النص إلى صوت بالذكاء الاصطناعي مجاناً | مولد الأصوات</title>
      <meta name="description" content={`حوّل أي نص مكتوب إلى صوت مسموع بأصوات بشرية طبيعية باستخدام مولد الأصوات المجاني. يدعم أكثر من ${totalLanguages} لغة ولهجة وأكثر من ${totalVoices} صوت مختلف. جربه الآن أونلاين.`} />
      <link rel="canonical" href="https://aiconvert.online/ar/text-to-speech" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/text-to-speech" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/text-to-speech" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/text-to-speech" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "مولد الأصوات المجاني بالذكاء الاصطناعي",
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              مولد الأصوات بالذكاء الاصطناعي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              امنح نصوصك الحياة. حوّل أي كتابة إلى صوت طبيعي ومسموع باستخدام أداتنا المجانية التي تدعم مئات الأصوات واللغات واللهجات.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-5">
              
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">1. أدخل النص هنا</label>
                <div className="relative">
                  <textarea
                    id="text-input" value={text} onChange={handleTextChange} placeholder="اكتب أو الصق النص الذي تريد تحويله..."
                    className="w-full h-40 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  <p className="absolute bottom-2 left-3 text-xs text-gray-400">متبقي {1500 - text.length} حرف</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">2. اختر الصوت المفضل</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select id="language" value={selectedLanguageCode} onChange={(e) => setSelectedLanguageCode(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500">
                        {voicesData.map(lang => <option key={lang.code} value={lang.code}>{languageNamesArabic[lang.code] || lang.name}</option>)}
                    </select>
                    <select id="gender" value={selectedGender} onChange={handleGenderChange} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500" disabled={genders.length === 0}>
                        {genders.map(gender => <option key={gender} value={gender}>{gender === 'Male' ? 'ذكر' : 'أنثى'}</option>)}
                    </select>
                    <select id="voice" value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500" disabled={voices.length === 0}>
                       {voices.map(voice => <option key={voice} value={voice}>{voice.split('-').slice(2).join('-').replace('Neural', '')}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">3. اضبط إعدادات الصوت</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label htmlFor="rate-slider" className="w-16">السرعة</label>
                    <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <span className="w-8 text-center">{rate.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="pitch-slider" className="w-16">الحدة</label>
                    <input id="pitch-slider" type="range" min="0.5" max="1.5" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <span className="w-8 text-center">{pitch.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateAudio} disabled={isLoading || !selectedVoice}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 rounded-lg hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'جاري توليد الصوت...' : 'توليد الصوت'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto">
              {isLoading && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                  <p className="text-gray-400">يتم تحويل النص إلى صوت طبيعي...</p>
                </div>
              )}
              {!isLoading && !audioURL && (
                <div className="text-center text-gray-500 p-4">
                  <p className="text-lg">سيظهر ملفك الصوتي هنا</p>
                  <p className="text-sm mt-2">جاهز للتحميل كملف MP3</p>
                </div>
              )}
              {audioURL && (
                <div className="w-full flex flex-col items-center gap-6">
                  <audio controls src={audioURL} className="w-full">متصفحك لا يدعم عنصر الصوت.</audio>
                  <a href={audioURL} download="generated-audio.mp3" className="w-full py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                    تحميل الصوت (MP3)
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
    <h2 className="text-3xl font-bold mb-4">لماذا تختار مولد الأصوات الخاص بنا؟</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">مجاني بالكامل</h3>
            <p className="text-gray-300">استمتع بتحويل غير محدود للنصوص إلى أصوات بدون أي تكلفة. لا اشتراكات ولا رسوم خفية.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">315+ صوت طبيعي</h3>
            <p className="text-gray-300">استفد من مكتبة ضخمة من الأصوات عالية الجودة التي تحاكي أصوات البشر لأي مشروع.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">{totalLanguages}+ لغة ولهجة</h3>
            <p className="text-gray-300">من الإنجليزية والإسبانية إلى العربية والصينية، أنشئ محتوى صوتيًا لجمهور عالمي.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">تحكم كامل بالصوت</h3>
            <p className="text-gray-300">اضبط سرعة الكلام ودرجة حدة الصوت بسهولة لتنتج نبرة الصوت المثالية التي تناسب محتواك.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">بدون تسجيل</h3>
            <p className="text-gray-300">قم بتوليد وتحميل ملفاتك الصوتية فورًا. نحن نقدر وقتك وخصوصيتك.</p>
        </div>
    </div>
</section>

            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">كيفية تحويل النص إلى صوت في 3 خطوات بسيطة</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        أداتنا البسيطة تجعل عملية إنشاء ملفات صوتية عالية الجودة من النصوص سهلة للجميع، من صناع المحتوى إلى الطلاب.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">1. أدخل النص</p>
                        <p className="text-gray-300">
                            اكتب أو الصق النص الذي تريد تحويله في صندوق النص. يمكنك كتابة أي شيء من جملة قصيرة إلى فقرة أطول.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">2. اختر صوتك</p>
                        <p className="text-gray-300">
                            اختر اللغة، والجنس، والصوت المحدد الذي تفضله. يمكنك أيضًا تعديل سرعة الكلام وحدته للحصول على النبرة المثالية.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">3. ولّد وحمّل</p>
                        <p className="text-gray-300">
                           اضغط على زر "توليد الصوت". في لحظات، سيكون ملفك الصوتي جاهزًا للاستماع والتحميل كملف MP3 عالي الجودة.
                        </p>
                    </div>
                </div>
            </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">الأسئلة الشائعة</h2>
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

export default TextToSpeechPageArabic;
