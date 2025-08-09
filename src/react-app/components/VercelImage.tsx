interface VercelImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}

const isDevelopment = import.meta.env.DEV;

export default function VercelImage({ src, alt, className, sizes }: VercelImageProps) {
  if (isDevelopment) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
    );
  }

  const widths = [400, 600, 828, 1080, 1200];

  const srcset = widths
    .map(width => `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=75 ${width}w`)
    .join(', ');

  return (
    <img
      src={`/_vercel/image?url=${encodeURIComponent(src)}&w=${widths[widths.length - 1]}&q=75`}
      srcSet={srcset}
      sizes={sizes}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
