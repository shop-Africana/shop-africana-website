import type { SVGProps } from "react";

type SocialIconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </svg>
  );
}

export function FacebookIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14.5 8.1h2.1V4.6c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.2v2.9H5.4v3.9h3.2v7.2h4v-7.2h3.2l.5-3.9h-3.7V10c0-1.1.3-1.9 1.9-1.9Z" />
    </svg>
  );
}

export function TikTokIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M15.4 3.2c.4 2.6 1.9 4.2 4.3 4.4v3.7c-1.4.1-2.7-.3-4.2-1.1v6.2c0 4.8-5.2 7.9-9.5 5.5-2.7-1.5-3.9-4.8-2.8-7.7 1.1-3 4.2-4.7 7.4-4.1v3.9c-.4-.1-.9-.2-1.4-.1-1.6.2-2.8 1.6-2.6 3.2.1 1.5 1.4 2.7 2.9 2.7 1.7 0 3-1.3 3-3.1V3.2h2.9Z" />
    </svg>
  );
}
