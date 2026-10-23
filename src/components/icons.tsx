import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Social icons as used in the header (mobile) and footer. Paths are the theme's Font Awesome glyphs. */
export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 264 512" role="img" aria-label="Follow us on Facebook" {...props}>
      <path d="M76.7 512V283H0v-91h76.7v-71.7C76.7 42.4 124.3 0 193.8 0c33.3 0 61.9 2.5 70.2 3.6V85h-48.2c-37.8 0-45.1 18-45.1 44.3V192H256l-11.7 91h-73.6v229" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 448 512" role="img" aria-label="Follow us on LinkedIn" {...props}>
      <path d="M100.3 480H7.4V180.9h92.9V480zM53.8 140.1C24.1 140.1 0 115.5 0 85.8 0 56.1 24.1 32 53.8 32c29.7 0 53.8 24.1 53.8 53.8 0 29.7-24.1 54.3-53.8 54.3zM448 480h-92.7V334.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V480h-92.8V180.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V480z" />
    </svg>
  );
}

export function TwitterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 512 512" role="img" aria-label="Follow us on Twitter" {...props}>
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 448 512" role="img" aria-label="Follow us on Instagram" {...props}>
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

/** Flickity-style chevron used by the testimonials slider prev/next buttons. */
export function SliderArrowIcon({ direction = "prev", ...props }: IconProps & { direction?: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 100 100" className="flickity-button-icon" aria-hidden="true" {...props}>
      <path
        d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z"
        className="arrow"
        transform={direction === "next" ? "translate(100, 100) rotate(180) " : undefined}
      />
    </svg>
  );
}

/** Small right-pointing chevron (mobile hero info tab). */
export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" fillRule="nonzero" d="m16.242 12.742-6 6a1.05 1.05 0 0 1-1.484-1.484L14.015 12 8.758 6.742a1.05 1.05 0 0 1 1.484-1.484l6 6c.41.41.41 1.074 0 1.484" />
    </svg>
  );
}

/** Circled "i" info glyph (mobile hero info tab). */
export function InfoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M16.5 16.5C-2 35-2 65 16.5 83.5s48.5 18.5 67 0 18.5-48.5 0-67-48.5-18.5-67 0m35.4 6c4 0 7.2 3.3 7.2 7.3s-3.3 7.3-7.2 7.3c-4 0-7.3-3.3-7.3-7.4 0-4 3.3-7.2 7.3-7.2m10.3 48.9c-.2.6-.6 1.3-1 1.7-2.6 2.7-5.8 4.3-9.6 4.3-1.8 0-3.5 0-5.3-.3-2.9-.4-6.6-4-6.1-7.8l1.2-7.8c.8-4.5 1.6-9.1 2.4-13.6 0-.3.1-.6.1-.9 0-1.9-.6-2.6-2.5-2.8-.8-.1-1.6-.2-2.4-.4-.9-.3-1.4-1.1-1.3-1.8.1-.8.6-1.3 1.6-1.5.5-.1 1.1-.1 1.7-.1h13.8c1.7 0 2.7.8 2.7 2.5 0 1.4-.2 2.8-.5 4.2-.9 5.2-1.9 10.3-2.8 15.5-.3 1.7-.7 3.4-.9 5.1-.1.8 0 1.7.2 2.5.3 1.1 1.1 1.7 2.2 1.6.9-.1 1.8-.4 2.7-.8.7-.3 1.3-.8 2-1 1.2-.4 2.1.3 1.8 1.4" />
    </svg>
  );
}

/** Blue down-chevron used as the custom <select> arrow in the theme. */
export function SelectChevronIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" {...props}>
      <path fill="#308bf5" d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
    </svg>
  );
}
