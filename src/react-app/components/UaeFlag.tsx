export const UaeFlag = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 600"
    className={className}
    aria-hidden="true" // Decorative image, name is provided by the text next to it
  >
    <rect width="1200" height="600" fill="#000" />
    <rect width="900" height="200" x="300" fill="#00732f" />
    <rect width="900" height="200" y="400" x="300" fill="#fff" />
    <rect width="300" height="600" fill="#f00" />
  </svg>
);
