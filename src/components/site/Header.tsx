"use client";

import "@/styles/header.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";
import {
  COPYRIGHT,
  HEADER_CTA,
  HEADER_TAGLINE,
  LOGO_ORANGE,
  NAV_ITEMS,
  NOTIFICATION_BANNER,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/site";
import type { NavItem, SocialLink } from "@/types/content";

/**
 * Site header: notification banner, logo, primary nav with the Services mega menu,
 * mobile hamburger menu and the fixed / hide-on-scroll-down behaviour of the original theme.
 *
 * DOM structure and class names mirror the original markup (docs/research/html/header.html);
 * the styles live in src/styles/header.css. Behaviour is a port of the theme's `header()` jQuery
 * plugin and the mega-menu script (docs/research/theme/theme-main.js).
 */

/** Above this viewport width the mega menu opens on hover; at or below it opens on click. */
const MEGA_HOVER_MIN_WIDTH = 1024;

const SOCIAL_ICONS: Record<SocialLink["network"], typeof FacebookIcon> = {
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Marks the link for the current route. Hash links (e.g. "/#approach") and "#" never count as active. */
function isActiveHref(href: string, pathname: string | null) {
  if (!pathname || href === "#" || href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const [fixed, setFixed] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Mirrors of the state for the scroll/resize listeners (bound once).
  const fixedRef = useRef(false);
  const menuVisibleRef = useRef(false);
  const lastScrollY = useRef(0);

  const applyFixed = useCallback((value: boolean) => {
    fixedRef.current = value;
    setFixed(value);
    document.body.classList.toggle("header-fixed", value);
  }, []);

  const applyMenuVisible = useCallback((value: boolean) => {
    menuVisibleRef.current = value;
    setMenuVisible(value);
  }, []);

  /**
   * body padding-top = height of the header in its un-fixed (scroll 0) layout, like the original,
   * which measures before adding `.fixed`. Transitions are suspended while measuring so nothing flashes.
   */
  const applyBodyPadding = useCallback(() => {
    const header = headerRef.current;
    if (!header) return;
    const wasFixed = header.classList.contains("fixed");
    header.classList.add("no-transition");
    if (wasFixed) header.classList.remove("fixed");
    document.body.style.paddingTop = `${header.getBoundingClientRect().height}px`;
    if (wasFixed) header.classList.add("fixed");
    void header.offsetHeight; // flush styles before transitions are re-enabled
    header.classList.remove("no-transition");
  }, []);

  // Mount: set body padding without animating it (body.init disables the padding transition),
  // then pick up the fixed state if the page loads already scrolled.
  useLayoutEffect(() => {
    const body = document.body;
    body.classList.add("init");
    applyBodyPadding();
    void body.offsetHeight;
    const raf = requestAnimationFrame(() => body.classList.remove("init"));

    lastScrollY.current = window.scrollY;
    if (window.scrollY > 0) {
      body.classList.add("navbar-fixed-visible");
      applyFixed(true);
    }

    // Web fonts can change the measured height after first paint.
    let cancelled = false;
    const remeasure = () => {
      if (!cancelled) applyBodyPadding();
    };
    document.fonts?.ready.then(remeasure);
    window.addEventListener("load", remeasure);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", remeasure);
      body.style.paddingTop = "";
      body.classList.remove("init", "header-fixed", "navbar-fixed-visible");
    };
  }, [applyBodyPadding, applyFixed]);

  // Scroll: `.fixed` once scrolled; slide out on scroll down, back in on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const header = headerRef.current;
      if (!header) return;
      const y = window.scrollY;
      const body = document.body;

      if (y > 0) {
        if (!menuVisibleRef.current) {
          const top = y < lastScrollY.current ? 0 : -header.getBoundingClientRect().height;
          header.style.top = `${top}px`;
          body.classList.toggle("navbar-fixed-visible", top === 0);
        }
        if (!fixedRef.current) applyFixed(true);
      } else {
        if (fixedRef.current) applyFixed(false);
        header.style.top = "0px";
      }
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [applyFixed]);

  // Resize: close the mobile menu when the width changes and re-measure the body padding.
  useEffect(() => {
    let timer: number | undefined;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        if (menuVisibleRef.current) applyMenuVisible(false);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(applyBodyPadding, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [applyBodyPadding, applyMenuVisible]);

  const toggleMenu = () => applyMenuVisible(!menuVisibleRef.current);

  return (
    <header ref={headerRef} className={cx("header site-header", fixed && "fixed", menuVisible && "menu-visible")}>
      <div className="notification-banner">
        <div className="notification-banner__content container">
          <p className="notification-banner__message">{NOTIFICATION_BANNER.message}</p>{" "}
          <a href={NOTIFICATION_BANNER.href} target="_blank" rel="noopener">
            <u>{NOTIFICATION_BANNER.linkLabel}</u> →
          </a>
        </div>
      </div>

      <div className={cx("header__container content-wrapper container d-flex", menuVisible && "menu-visible")}>
        <div className="header__logo header__logo--main">
          <div className="header__logo-widget">
            <Link href="/" aria-label={`${SITE_NAME} home`}>
              <img
                src={LOGO_ORANGE}
                alt="Free Range"
                title="Free Range"
                width={124}
                height={114}
                style={{ height: "auto", width: 124 }}
              />
            </Link>
          </div>
          <Link className="site-name" href="/">
            <span>{SITE_NAME}</span>
          </Link>
        </div>

        <div className="header__column ml-auto">
          <div className={cx("header__row-1 header__navigation-container", menuVisible && "menu-visible")}>
            <button
              type="button"
              className="header--toggle header__navigation--toggle"
              aria-label={menuVisible ? "Close menu" : "Open menu"}
              aria-expanded={menuVisible}
              aria-controls="mobile-menu"
              onClick={toggleMenu}
            />
            <div className="header__navigation header--element">
              <PrimaryNav items={NAV_ITEMS} pathname={pathname} />
              <div className="header__cta">
                <Link className="hs-button" href={HEADER_CTA.href} id="hs-button_header_cta_button">
                  {HEADER_CTA.label}
                </Link>
              </div>
            </div>
          </div>
          <div className="header__row-2">
            <div className="header__tagline-container header--element">
              <p className="header-tagline">{HEADER_TAGLINE}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="header__navigation mobile-menu-container" id="mobile-menu">
        <div className="mobile-menu header--element">
          <PrimaryNav items={NAV_ITEMS} pathname={pathname} />
          <div className="mobile-menu-cta">
            <Link className="hs-button" href={HEADER_CTA.href} id="hs-button_header_cta_button_mobile">
              {HEADER_CTA.label}
            </Link>
          </div>
          <div className="mobile-menu-bottom">
            <div className="mobile-menu-social">
              <div className="social-links">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.network];
                  return (
                    <a key={social.network} className="social-links__link" href={social.href} target="_blank" rel="noopener">
                      <span className="social-links__icon">
                        <Icon />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="copyright">{COPYRIGHT}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

/* ------------------------------------------------------------------ */

function PrimaryNav({ items, pathname }: { items: NavItem[]; pathname: string | null }) {
  // Label of the `.has-mega` item currently open (only "Services" in practice).
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  // Clicking anywhere outside a menu item closes an open mega menu (original behaviour).
  useEffect(() => {
    if (openLabel === null) return;
    const onDocumentClick = (event: globalThis.MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(".menu-item")) setOpenLabel(null);
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [openLabel]);

  return (
    <nav aria-label="Main menu" className="navigation-primary">
      <ul className="submenu level-1">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {/* The original markup has whitespace between the inline-flex <li>s; it renders as a space
                (5 × 5.67px at 1440) and is part of the nav width the mega menu is centred against. */}
            {index > 0 ? " " : null}
            {item.mega ? (
              <MegaMenuEntry
                item={item}
                open={openLabel === item.label}
                onOpenChange={(open) => setOpenLabel(open ? item.label : null)}
              />
            ) : (
              <li className="menu-item no-submenu">
                <Link href={item.href} className={cx("menu-link", isActiveHref(item.href, pathname) && "active-item")}>
                  {item.label}
                </Link>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
}

function MegaMenuEntry({
  item,
  open,
  onOpenChange,
}: {
  item: NavItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mega = item.mega!;
  // The first service is highlighted until another one is hovered.
  const [activeIndex, setActiveIndex] = useState(0);

  const isHoverMode = () => window.innerWidth > MEGA_HOVER_MIN_WIDTH;

  const onTriggerClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isHoverMode()) {
      onOpenChange(true); // keyboard activation on desktop; hover already handles the mouse
      return;
    }
    event.stopPropagation();
    onOpenChange(!open);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Escape" && open) onOpenChange(false);
  };

  return (
    <li
      className={cx("menu-item has-mega", open && "is-open")}
      onMouseEnter={() => isHoverMode() && onOpenChange(true)}
      onMouseLeave={() => isHoverMode() && onOpenChange(false)}
      onKeyDown={onKeyDown}
    >
      <a
        href="#"
        className="menu-link has-arrow"
        role="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={onTriggerClick}
      >
        {item.label}
      </a>
      <div className="mega-menu">
        <div className="mega-container">
          <div className="mega-nav-side">
            {mega.items.map((entry, index) => (
              <Link
                key={entry.href}
                href={entry.href}
                className={cx("mega-item", index === activeIndex && "is-active")}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="mega-icon">
                  <img src={entry.icon} alt="" width={24} />
                </div>
                <span className="mega-label">{entry.label}</span>
              </Link>
            ))}
          </div>
          <div className="mega-content-side">
            <div className="preview-card">
              <div className="preview-img-container">
                <img className="preview-img default-img" src={mega.preview.defaultImage} alt="" />
                <img className="preview-img hover-img" src={mega.preview.hoverImage} alt="" />
              </div>
              <h3 className="preview-title">{mega.preview.title}</h3>
              <p className="preview-desc">{mega.preview.description}</p>
              <Link href={mega.preview.cta.href} className="preview-cta">
                {mega.preview.cta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
