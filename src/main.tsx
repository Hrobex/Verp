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

// --- Arabic Page Imports (To be created in the next step) ---
import HomePageArabic from "@/react-app/pages/HomePageArabic";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* This component ensures navigation scrolls to the top of the page */}
      <ScrollToTop /> 
      
      <Routes>
        {/* The App component acts as a layout shell (with Header and Footer) for all pages */}
        <Route path="/" element={<App />}>

          {/* --- English Pages --- */}
          <Route index element={<HomePage />} />
          <Route path="/artigen-pro-ai" element={<ImageGeneratorPage />} />
          <Route path="/line-drawing" element={<LineArtifyPage />} />
          <Route path="/remove-background" element={<div className="pt-24">Background Removal Page</div>} />
          <Route path="/text-to-speech" element={<div className="pt-24">Text to Speech Page</div>} />
          <Route path="/ai-image-enhancer" element={<div className="pt-24">Image Enhancement Page</div>} />

          {/* --- Arabic Pages --- */}
          {/* This is the new route for the Arabic homepage */}
          <Route path="/ar" element={<HomePageArabic />} />
          
          {/* We will add more Arabic tool pages here in the future, for example: */}
          {/* <Route path="/ar/artigen-pro-ai" element={<ImageGeneratorPageArabic />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
