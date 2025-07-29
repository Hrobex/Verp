import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. استدعاء المكونات والملفات باستخدام الاسم المستعار الخاص بمشروعك
import App from "@/react-app/App"; // المكون الرئيسي الذي يعرض تصميم موقعك
import ImageGeneratorPage from "@/react-app/pages/ImageGeneratorPage"; // صفحة الأداة الجديدة
import "@/react-app/index.css"; // ملف التنسيقات العامة

// 2. إنشاء نظام التوجيه (الراوتر)
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* المسار الأول: الصفحة الرئيسية */}
        <Route path="/" element={<App />} />

        {/* المسار الثاني: صفحة أداة الصور */}
        <Route path="/tools/image-generator" element={<ImageGeneratorPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
