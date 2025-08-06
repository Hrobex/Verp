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
import PromptigenPage from "@/react-app/pages/PromptigenPage";
import StorygenPage from "@/react-app/pages/StorygenPage";
import VideoPromptPage from "@/react-app/pages/VideoPromptPage";
import EasyDrawingsPage from "@/react-app/pages/EasyDrawingsPage"; // <-- تمت إضافة هذا السطر
import PhotoRevivePage from "@/react-app/pages/PhotoRevivePage";
import PrivacyPolicyPage from "@/react-app/pages/PrivacyPolicyPage";


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
import CartoonifyPageArabic from "@/react-app/pages/CartoonifyPageArabic";
import DigiCartoonyPageArabic from "@/react-app/pages/DigiCartoonyPageArabic";
import PromptigenPageArabic from "@/react-app/pages/PromptigenPageArabic";
import StorygenPageArabic from "@/react-app/pages/StorygenPageArabic";
import VideoPromptPageArabic from "@/react-app/pages/VideoPromptPageAr";
import EasyDrawingsPageArabic from "@/react-app/pages/EasyDrawingsPageAr"; // <-- تمت إضافة هذا السطر
import PhotoRevivePageArabic from "@/react-app/pages/PhotoRevivePageAr";

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
          <Route path="prompt-generator" element={<PromptigenPage />} />
          <Route path="ai-story-generator" element={<StorygenPage />} />
          <Route path="ai-video-prompt-generator" element={<VideoPromptPage />} />
          <Route path="easy-drawings" element={<EasyDrawingsPage />} /> {/* <-- تمت إضافة هذا السطر */}
          <Route path="restore-and-repair-old-photos" element={<PhotoRevivePage />} /> 
          <Route path="restore-and-repair-old-photos" element={<PrivacyPolicyPage />} /> 

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
            <Route path="cartoonify" element={<CartoonifyPageArabic />} />
            <Route path="cartoony-art" element={<DigiCartoonyPageArabic />} />
            <Route path="prompt-generator" element={<PromptigenPageArabic />} />
            <Route path="ai-story-generator" element={<StorygenPageArabic />} />
            <Route path="ai-video-prompt-generator" element={<VideoPromptPageArabic />} />
            <Route path="easy-drawings" element={<EasyDrawingsPageArabic />} /> 
            <Route path="privacy-policy" element={<PhotoRevivePageArabic />} /> 
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
