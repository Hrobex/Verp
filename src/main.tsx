// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@/react-app/App";
import ScrollToTop from "@/react-app/components/ScrollToTop";
import "@/react-app/index.css";

// --- Page Imports ---
import HomePage from "@/react-app/pages/Home";
import ImageGeneratorPage from "@/react-app/pages/ImageGeneratorPage";
import LineArtifyPage from "@/react-app/pages/LineArtifyPage";
import ImageBackgroundToolPage from "@/react-app/pages/ImageBackgroundToolPage";
import TextToSpeechPage from "@/react-app/pages/TextToSpeechPage";
import ImageEnhancerPage from "@/react-app/pages/ImageEnhancerPage";
import FaceMergePage from "@/react-app/pages/FaceMergePage";
import ArtigenV2Page from "@/react-app/pages/ArtigenV2Page";
import AnimeGeneratorPage from "@/react-app/pages/AnimeGeneratorPage";
import CartoonifyPage from "@/react-app/pages/CartoonifyPage";
import DigiCartoonyPage from "@/react-app/pages/DigiCartoonyPage";

// --- Arabic Page Imports ---
import HomePageArabic from "@/react-app/pages/HomePageArabic";
import LineArtifyPageArabic from "@/react-app/pages/LineArtifyPageArabic";
import ImageGeneratorPageArabic from "@/react-app/pages/ImageGeneratorPageArabic";
import ImageBackgroundToolPageArabic from "@/react-app/pages/ImageBackgroundToolPageArabic";
import TextToSpeechPageArabic from "@/react-app/pages/TextToSpeechPageArabic";
import ImageEnhancerPageArabic from "@/react-app/pages/ImageEnhancerPageArabic";
import FaceMergePageArabic from "@/react-app/pages/FaceMergePageArabic";
import ArtigenV2PageArabic from "@/react-app/pages/ArtigenV2PageArabic";
import AnimeGeneratorPageArabic from "@/react-app/pages/AnimeGeneratorPageArabic";
import CartoonifyPageArabic from "@/react-app/pages/CartoonifyPageArabic"; // <-- 1. تم استيراد المكون العربي الجديد
import DigiCartoonyPageArabic from "@/react-app/pages/DigiCartoonyPageArabic"; // <-- 2. تم استيراد المكون العربي الجديد

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop /> 
      
      <Routes>
        {/* The App component is the layout shell for ALL pages */}
        <Route element={<App />}>

          {/* --- English Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="generate-image-pro" element={<ImageGeneratorPage />} />
          <Route path="line-drawing" element={<LineArtifyPage />} />          
          <Route path="remove-background" element={<ImageBackgroundToolPage />} />
          <Route path="text-to-speech" element={<TextToSpeechPage />} />
          <Route path="ai-image-enhancer" element={<ImageEnhancerPage />} />
          <Route path="ai-face-merge" element={<FaceMergePage />} />
          <Route path="artigenv2" element={<ArtigenV2Page />} />
          <Route path="anime-ai" element={<AnimeGeneratorPage />} />
          <Route path="cartoonify" element={<CartoonifyPage />} />
          <Route path="cartoony-art" element={<DigiCartoonyPage />} />


          {/* --- Arabic Route Group --- */}
          <Route path="ar">
            <Route index element={<HomePageArabic />} />
            <Route path="line-drawing" element={<LineArtifyPageArabic />} />
            <Route path="generate-image-pro" element={<ImageGeneratorPageArabic />} />
            <Route path="remove-background" element={<ImageBackgroundToolPageArabic />} />
            <Route path="text-to-speech" element={<TextToSpeechPageArabic />} />
            <Route path="ai-image-enhancer" element={<ImageEnhancerPageArabic />} />
            <Route path="ai-face-merge" element={<FaceMergePageArabic />} />
            <Route path="artigenv2" element={<ArtigenV2PageArabic />} />
            <Route path="anime-ai" element={<AnimeGeneratorPageArabic />} />
            <Route path="cartoonify" element={<CartoonifyPageArabic />} /> {/* <-- 3. تم إضافة المسار العربي الجديد هنا */}
            <Route path="cartoony-art" element={<DigiCartoonyPageArabic />} /> {/* <-- 4. تم إضافة المسار العربي الجديد هنا */}
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
