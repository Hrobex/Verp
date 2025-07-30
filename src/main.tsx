import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "@/react-app/App";
import HomePage from "@/react-app/pages/Home";
import ImageGeneratorPage from "@/react-app/pages/ImageGeneratorPage";
import ScrollToTop from "@/react-app/components/ScrollToTop"; // <-- 1. تم استيراد المكون الجديد
import "@/react-app/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop /> {/* <-- 2. تم وضع المكون هنا، وسيعمل تلقائيًا */}
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="/tools/image-generator" element={<ImageGeneratorPage />} />
           {/* لاحقاً، ستضيف مسارات أدواتك الأخرى هنا */}
           <Route path="/tools/background-removal" element={<div>Background Removal Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
