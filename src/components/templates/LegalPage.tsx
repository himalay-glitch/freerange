import "@/styles/legal.css";

export interface LegalPageProps {
  /** Page title, rendered uppercase as the first heading of the placeholder body */
  title: string;
  /** Owner-supplied body HTML (e.g. content/pages/privacy-policy.html). Rendered as-is. */
  bodyHtml?: string | null;
  /** Shown on the "Last updated" line of the placeholder body */
  lastUpdated?: string;
}

/**
 * Rich-text page template used by /privacy-policy and /terms-and-conditions:
 * 20px spacer -> rich text inside `.container` -> 60px spacer (privacy-modules.json).
 * When no body has been imported yet, a neutral placeholder shows the template's type styles.
 */
export default function LegalPage({ title, bodyHtml, lastUpdated }: LegalPageProps) {
  return (
    <main id="main-content" className="body-container-wrapper">
      <div className="container">
        <div className="body-container body-container--default body-container--legal">
          <hr className="horizontal-space" style={{ height: 20 }} />

          {bodyHtml ? (
            <div className="legal-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : (
            <div className="legal-body">
              <h2>{title}</h2>
              <p className="legal-body__updated">Last updated {lastUpdated ?? "(date pending)"}</p>
              <p>
                This is placeholder body copy for the {title} page. It stands in for the first
                paragraph of the imported document and shows the standard paragraph size, line
                height and spacing used throughout the page.
              </p>
              <p>
                A second placeholder paragraph describes, in neutral terms, the kind of information
                the document covers and how readers should interpret it. It exists only so that the
                template can be reviewed before the real content is supplied.
              </p>
              <p>
                A third placeholder paragraph introduces the list below, which demonstrates how
                bulleted items are indented and spaced within the rich-text area.
              </p>
              <ul>
                <li>First placeholder list item</li>
                <li>Second placeholder list item</li>
                <li>Third placeholder list item</li>
              </ul>
              <p className="legal-body__note">Body content pending import</p>
            </div>
          )}

          <hr className="horizontal-space" style={{ height: 60 }} />
        </div>
      </div>
    </main>
  );
}
