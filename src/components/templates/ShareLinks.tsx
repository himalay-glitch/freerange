import type { SVGProps } from "react";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";

/** Font Awesome "envelope" glyph, as used by the theme's email share icon. */
function EnvelopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" role="img" aria-label="Share by email" {...props}>
      <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7M256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4" />
    </svg>
  );
}

interface ShareLinksProps {
  /** Canonical URL of the post being shared. */
  url: string;
  title: string;
}

/**
 * The four circular share links (Facebook, LinkedIn, Twitter, email) rendered inside
 * `td.social-sharing-links` of the sidebar info table.
 */
export function ShareLinks({ url, title }: ShareLinksProps) {
  const encodedUrl = encodeURIComponent(url);
  const links = [
    {
      href: `https://www.facebook.com/share.php?u=${encodedUrl}`,
      label: "Share on Facebook",
      Icon: FacebookIcon,
    },
    {
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`,
      label: "Share on LinkedIn",
      Icon: LinkedInIcon,
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
      label: "Share on Twitter",
      Icon: TwitterIcon,
    },
    {
      href: `mailto:?subject=${encodeURIComponent(`Check out ${url}`)}&body=${encodedUrl}`,
      label: "Share by email",
      Icon: EnvelopeIcon,
    },
  ];

  return (
    <span className="social-sharing">
      {links.map(({ href, label, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
          <Icon aria-hidden="true" aria-label={undefined} role={undefined} />
        </a>
      ))}
    </span>
  );
}
