import type { ReactNode } from "react";

/**
 * Reproduces the HubSpot page skeleton under `<main>`:
 * main.body-container-wrapper > .container > .container-fluid.body-container > .row-fluid-wrapper > .row-fluid > .span12
 * Every module is wrapped in a `.row-fluid-wrapper.dnd-section` (zero padding; spacing comes from the modules).
 */
export function PageShell({ children, variant = "default", className = "" }: { children: ReactNode; variant?: string; className?: string }) {
  return (
    <main id="main-content" className="body-container-wrapper">
      <div className="container">
        <div className={`container-fluid body-container body-container--${variant} ${className}`.trim()}>
          <div className="row-fluid-wrapper">
            <div className="row-fluid">
              <div className="span12 widget-span widget-type-cell">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/** One drag-and-drop section wrapper (`.row-fluid-wrapper.dnd-section`). */
export function Section({ children, n, className = "" }: { children: ReactNode; n?: number; className?: string }) {
  return (
    <div className={`row-fluid-wrapper row-depth-1 ${n ? `row-number-${n} ` : ""}dnd-section ${className}`.trim()}>
      <div className="row-fluid">
        <div className="span12 widget-span widget-type-cell dnd-column">{children}</div>
      </div>
    </div>
  );
}

/** The theme's "space" module: an empty block of the given height. */
export function Spacer({ height = 80, className = "" }: { height?: number; className?: string }) {
  return <div className={`widget-type-space horizontal-space ${className}`.trim()} style={{ height }} aria-hidden="true" />;
}
