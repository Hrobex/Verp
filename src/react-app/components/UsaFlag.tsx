export const UsaFlag = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1235 650"
    className={className}
    aria-hidden="true" // Decorative image, name is provided by the text next to it
  >
    <path fill="#b22234" d="M0 0h1235v650H0z" />
    <path
      fill="#fff"
      d="M0 50h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0zm0 100h1235v50H0z"
    />
    <path fill="#3c3b6e" d="M0 0h494v350H0z" />
    <g fill="#fff">
      {/* This is a simplified representation of the stars for performance */}
      {[...Array(5)].map((_, r) =>
        [...Array(6)].map((_, c) => (
          <path
            key={`${r}-${c}`}
            d={`M${82.333 * c + 41.167},${70 * r + 35}l12.722,39.117-33.278-24.18H95.9L62.622,74.117z`}
            transform="scale(0.5)"
          />
        ))
      )}
      {[...Array(4)].map((_, r) =>
        [...Array(5)].map((_, c) => (
          <path
            key={`s-${r}-${c}`}
            d={`M${82.333 * c + 82.333},${70 * r + 70}l12.722,39.117-33.278-24.18H137.067L103.789,74.117z`}
            transform="scale(0.5)"
          />
        ))
      )}
    </g>
  </svg>
);
