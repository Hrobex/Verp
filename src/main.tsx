import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@/react-app/App";
import HomePage from "@/react-app/pages/Home";
import ImageGeneratorPage from "@/react-app/pages/ImageGeneratorPage";
import LineArtifyPage from "@/react-app/pages/LineArtifyPage"; // <-- الإضافة الجديدة
import ScrollToTop from "@/react-app/components/ScrollToTop";
import "@/react-app/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="/tools/image-generator" element={<ImageGeneratorPage />} />
          
          {/* هذا مسارك الحالي وقد أبقيت عليه كما هو */}
          <Route path="/tools/background-removal" element={<div className="pt-24">Background Removal Page</div>} />
          
          {/* هذا هو المسار الجديد الذي أضفناه بنفس هيكل المسارات لديك */}
          <Route path="/tools/line-artify" element={<LineArtifyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
