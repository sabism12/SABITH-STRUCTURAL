import { ArrowUp } from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
};

const SOCIAL_LINKS: FooterLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sabithismail/" },
  { label: "Instagram", href: "https://www.instagram.com/sabith.ism/" },
  { label: "Call", href: "tel:+97450371817" },
];

const EMAIL = "sabithismail6679@gmail.com";
const COORDINATES = "25.2854° N, 51.5310° E";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="portfolio-footer px-6 md:px-10 pt-6 pb-12 md:py-16">
      <div className="portfolio-footer__inner mx-auto w-full max-w-6xl">
        <div className="portfolio-footer__top-row">
          <nav aria-label="Social links" className="portfolio-footer__socials">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="portfolio-footer__link block w-fit"
              >
                {link.label}
              </a>
            ))}
            <div className="portfolio-footer__link portfolio-footer__coordinates" aria-label="Coordinates">
              {COORDINATES}
            </div>
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            className="portfolio-footer__top"
            aria-label="Back to top"
          >
            <ArrowUp className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="portfolio-footer__bottom-row">
          <div className="portfolio-footer__meta">
            <div className="portfolio-footer__role">STRUCTURAL ENGINEER</div>
            <a className="portfolio-footer__email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </div>

          <div className="portfolio-footer__brand">
            <div className="portfolio-footer__name portfolio-footer__name--mobile">SABITH</div>
            <div className="portfolio-footer__name portfolio-footer__name--desktop">MOHD SABITH</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
