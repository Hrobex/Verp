import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@/react-app/App";
import HomePage from "@/react-app/pages/Home";
import ImageGeneratorPage from "@/react-app/pages/ImageGeneratorPage";
import LineArtifyPage from "@/react-app/pages/LineArtifyPage";
import ScrollToTop from "@/react-app/components/ScrollToTop";
import "@/react-app/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          
          {/* --- تم تصحيح وإضافة المسارات هنا --- */}
          <Route path="/artigen-pro-ai" element={<ImageGeneratorPage />} />
          <Route path="/line-drawing" element={<LineArtifyPage />} />
          <Route path="/remove-background" element={<div className="pt-24">Background Removal Page</div>} />
          {/* تمت إضافة مسار للأداة التي كانت مفقودة */}
          <Route path="/text-to-audio" element={<div className="pt-24">Text to Audio Page</div>} />
          {/* -------------------------------------- */}

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
