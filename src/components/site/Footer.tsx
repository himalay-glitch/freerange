"use client";

import "@/styles/footer.css";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";
import { B_CORP_BADGE, COPYRIGHT, HEADER_CTA, LOGO_WHITE, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";
import type { SocialLink } from "@/types/content";

/**
 * Site footer: newsletter band (#425f80) + bottom band (#032049).
 * DOM and class names mirror docs/research/html/footer.html so the ported
 * stylesheet (src/styles/footer.css) applies unchanged. The HubSpot form that
 * the original injects into #hs_form_target_footer_subscribe_form is rendered
 * statically here with a submit stub.
 */

const SOCIAL_ICONS: Record<SocialLink["network"], typeof FacebookIcon> = {
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribeStatus = "idle" | "invalid" | "submitted";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    if (status === "invalid") setStatus("idle");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div className="submitted-message" role="status">
        Thanks for subscribing!
      </div>
    );
  }

  const invalid = status === "invalid";

  return (
    <form className="hs-form" noValidate onSubmit={handleSubmit} aria-label="Newsletter subscription">
      <div className="hs_email hs-email hs-fieldtype-text field hs-form-field">
        <label className="hs-form-label" htmlFor="footer-subscribe-email">
          Email<span className="hs-form-required">*</span>
        </label>
        <div className="input">
          <input
            id="footer-subscribe-email"
            className="hs-input"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="mail@domain.com"
            aria-label="Email"
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "footer-subscribe-error" : undefined}
            value={email}
            onChange={handleChange}
          />
        </div>
      </div>
      {invalid && (
        <div className="hs_error_rollup">
          <ul className="no-list hs-error-msgs inputs-list" role="alert">
            <li>
              <label id="footer-subscribe-error" className="hs-error-msg hs-main-font-element">
                Please enter a valid email address.
              </label>
            </li>
          </ul>
        </div>
      )}
      <div className="hs_submit hs-submit">
        <div className="actions">
          <input type="submit" className="hs-button primary large" value="SUBSCRIBE" />
        </div>
      </div>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="footer site-footer">
      <div className="footer__container">
        <div className="footer-top">
          <div className="container">
            <div
              id="hs_cos_wrapper_footer_subscribe_form"
              className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module widget-type-form"
            >
              <span
                id="hs_cos_wrapper_footer_subscribe_form_"
                className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_form"
              >
                <h3 id="hs_cos_wrapper_footer_subscribe_form_title" className="hs_cos_wrapper form-title">
                  New Ideas, Delivered To Your Inbox
                </h3>
                <div id="hs_form_target_footer_subscribe_form">
                  <NewsletterForm />
                </div>
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="footer-logo">
              <div
                id="hs_cos_wrapper_linked_image"
                className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module widget-type-linked_image"
              >
                <span
                  id="hs_cos_wrapper_linked_image_"
                  className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_linked_image"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> per clone spec */}
                  <img src={LOGO_WHITE} className="hs-image-widget" width={124} height={114} alt={`${SITE_NAME} mark`} />
                </span>
              </div>
              <Link className="site-name" href="/" tabIndex={-1}>
                <span>{SITE_NAME}</span>
              </Link>
            </div>

            <div className="footer-info">
              <div className="footer-info-top">
                <div>
                  <div
                    id="hs_cos_wrapper_button"
                    className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module"
                  >
                    <Link className="hs-button" href={HEADER_CTA.href} id="hs-button_button">
                      {HEADER_CTA.label}
                    </Link>
                  </div>
                  <div
                    id="hs_cos_wrapper_footer_social"
                    className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module"
                  >
                    <div className="social-links">
                      {SOCIAL_LINKS.map((link) => {
                        const Icon = SOCIAL_ICONS[link.network];
                        return (
                          <a
                            key={link.network}
                            className="social-links__link"
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                          >
                            <span className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_icon social-links__icon">
                              <Icon />
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="certifications">
                  <div
                    id="hs_cos_wrapper_certifications"
                    className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> per clone spec */}
                    <img src={B_CORP_BADGE} width={328} height={500} alt="Certification badge" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="footer__copyright">
              <div
                id="hs_cos_wrapper_footer_copyright_text"
                className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module widget-type-text"
              >
                <span
                  id="hs_cos_wrapper_footer_copyright_text_"
                  className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_text"
                >
                  {COPYRIGHT}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
