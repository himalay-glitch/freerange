import { CardList } from "@/components/cards/CardList";
import { WORK_ROWS } from "@/lib/data/work-cards";

/** Orange inline highlight; the no-break spaces around the word give the original's horizontal padding. */
function Highlight({ children }: { children: string }) {
  return <span style={{ background: "#ff5201", color: "#fff" }}>{` ${children} `}</span>;
}

/** Homepage "Work" section: title, highlighted intro and the 3 + 4 case-study card grid. */
export function WorkSection() {
  return (
    <CardList
      variant="case-study"
      rows={WORK_ROWS}
      title="Work"
      description={
        <>
          Our partners are transforming <Highlight>health</Highlight>, <Highlight>education</Highlight>, and{" "}
          <Highlight>climate resilience</Highlight> with stories and technology that drive impactful missions.
        </>
      }
      viewMore={{ label: "See All Case Studies", href: "/case-studies" }}
    />
  );
}
