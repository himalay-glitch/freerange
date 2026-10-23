import { Header } from "@/components/site/Header";

/**
 * Preview route for the site header: renders <Header /> above a tall placeholder so the
 * fixed / hide-on-scroll-down / show-on-scroll-up behaviour and the mega menu can be tested.
 */
export default function HeaderPreviewPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="body-container-wrapper">
        <div className="container" style={{ minHeight: 3000, paddingTop: 40, paddingBottom: 40 }}>
          <h2 className="title">Header preview</h2>
          <p>
            Scroll down to see the header switch to its fixed state and slide away; scroll up to bring it back.
            Hover “Services” for the mega menu. Below 1024px the navigation collapses into the hamburger menu.
          </p>
          <div
            aria-hidden="true"
            style={{
              height: 2600,
              borderRadius: 12,
              background: "repeating-linear-gradient(180deg, #f1f9fc 0 200px, #ffffff 200px 400px)",
            }}
          />
        </div>
      </main>
    </>
  );
}
