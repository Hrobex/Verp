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

// --- Arabic Page Imports ---
import HomePageArabic from "@/react-app/pages/HomePageArabic";
// We will create the Arabic tool pages later
// import ImageGeneratorPageArabic from "@/react-app/pages/ImageGeneratorPageArabic";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop /> 
      
      <Routes>
        {/* The App component is the layout shell for ALL pages */}
        <Route element={<App />}>

          {/* --- English Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="artigen-pro-ai" element={<ImageGeneratorPage />} />
          <Route path="line-drawing" element={<LineArtifyPage />} />
          <Route path="remove-background" element={<div className="pt-24">Background Removal Page</div>} />
          <Route path="text-to-speech" element={<div className="pt-24">Text to Speech Page</div>} />
          <Route path="ai-image-enhancer" element={<div className="pt-24">Image Enhancement Page</div>} />

          {/* --- Arabic Route Group --- */}
          {/* All Arabic pages will be nested here, ensuring '/ar' is always in the URL */}
          <Route path="/ar">
            <Route index element={<HomePageArabic />} />
            {/* Example for a future Arabic tool page: */}
            {/* <Route path="artigen-pro-ai" element={<ImageGeneratorPageArabic />} /> */}
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
