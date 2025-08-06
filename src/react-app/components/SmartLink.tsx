// الملف: src/react-app/components/SmartLink.tsx
import { Link } from 'react-router-dom';
import React from 'react';

// نُعرِّف نوع الخصائص ليكون أكثر مرونة
// سيقبل الآن `href` بالإضافة إلى أي خصائص أخرى صالحة لوسم <a>
type SmartLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const SmartLink = ({ href, children, ...rest }: SmartLinkProps) => {
  // نستخدم "rest operator" (...) لجمع كل الخصائص الأخرى (مثل className, onClick) في كائن واحد

  if (href.startsWith('/')) {
    // إذا كان رابطًا داخليًا، استخدم Link من react-router-dom
    // ونقوم بتمرير جميع الخصائص الأخرى إليه باستخدام {...rest}
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  
  // وإلا، استخدم وسم <a> العادي للروابط الخارجية
  // ونضيف إليه خصائص الأمان القياسية ونمرر باقي الخصائص
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
};

export default SmartLink;
