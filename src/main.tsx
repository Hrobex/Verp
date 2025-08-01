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
import ImageBackgroundToolPage from "@/react-app/pages/ImageBackgroundToolPage"; // <-- 1. تم استيراد المكون الجديد

// --- Arabic Page Imports ---
import HomePageArabic from "@/react-app/pages/HomePageArabic";
import LineArtifyPageArabic from "@/react-app/pages/LineArtifyPageArabic";
import ImageGeneratorPageArabic from "@/react-app/pages/ImageGeneratorPageArabic";

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
          <Route path="remove-background" element={<ImageBackgroundToolPage />} /> {/* <-- 2. تم تحديث المسار هنا */}
          <Route path="text-to-speech" element={<div className="pt-24">Text to Speech Page</div>} />
          <Route path="ai-image-enhancer" element={<div className="pt-24">Image Enhancement Page</div>} />

          {/* --- Arabic Route Group --- */}
          <Route path="ar">
            <Route index element={<HomePageArabic />} />
            <Route path="line-drawing" element={<LineArtifyPageArabic />} />
            <Route path="generate-image-pro" element={<ImageGeneratorPageArabic />} />
            {/* You can add future Arabic tool pages here, for example: */}
            {/* <Route path="generate-image-pro" element={<ImageGeneratorPageArabic />} /> */}
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
