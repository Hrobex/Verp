import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@/react-app/App"; // هذا هو "الغلاف" الآن
import HomePage from "@/react-app/pages/Home"; // هذه هي الصفحة الرئيسية
import ImageGeneratorPage from "@/react-app/pages/ImageGeneratorPage"; // هذه هي صفحة الأداة
import "@/react-app/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> {/* "الغلاف" هو الأب لكل المسارات */}
          {/* الصفحات التالية ستُعرض داخل "الغلاف" */}
          <Route index element={<HomePage />} />
          <Route path="/tools/image-generator" element={<ImageGeneratorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
