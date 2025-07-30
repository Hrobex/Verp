import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@/react-app/App";
import HomePage from "@/react-app/pages/Home";
import ImageGeneratorPage from "@/react-app/pages/ImageGeneratorPage";
import ScrollToTop from "@/react-app/components/ScrollToTop";
import "@/react-app/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* تأكد من أن هذا المكون موجود هنا مباشرة */}
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="/tools/image-generator" element={<ImageGeneratorPage />} />
          {/* أضفت هذا المسار كمثال لتراه يعمل لاحقًا */}
          <Route path="/tools/background-removal" element={<div className="pt-24">Background Removal Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
