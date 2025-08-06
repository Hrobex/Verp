// الملف: src/react-app/components/SmartLink.tsx
import { Link } from 'react-router-dom';

// هذا المكون يقبل نفس الخصائص التي يقبلها أي رابط عادي
// ولكنه يقرر بذكاء ما إذا كان يجب استخدام Link أو a
const SmartLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
  if (href.startsWith('/')) {
    // إذا كان رابطًا داخليًا، استخدم Link من react-router-dom
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  // وإلا، استخدم وسم a العادي للروابط الخارجية (mailto:, https://)
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default SmartLink;
