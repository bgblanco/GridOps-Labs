import * as React from "react";
import { createRoot } from "react-dom/client";
import { usePathname } from "next/navigation";
import { GridOpsHeader } from "@/components/site/GridOpsHeader";
import { GridOpsFooter } from "@/components/site/GridOpsFooter";
import { HomeView } from "@/components/views/HomeView";
import { DecisionLabsView } from "@/components/views/DecisionLabsView";
import { ForUtilitiesView } from "@/components/views/ForUtilitiesView";
import { ChallengeView, ChallengeDetailView } from "@/components/views/ChallengeView";
import { WhitePapersView, WhitePaperView } from "@/components/views/WhitePapersView";
import { AboutView } from "@/components/views/AboutView";
import { ContactView } from "@/components/views/ContactView";
import { LabView } from "@/components/views/LabView";
import { NotFoundView } from "@/components/views/NotFoundView";
import { getScenario } from "@/lib/scenarios";
import { getWhitePaper } from "@/lib/content/whitepapers";
import { getChallenge } from "@/lib/content/challenges";

function route(path: string): React.ReactElement {
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return <HomeView />;
  const [a, b] = seg;
  if (a === "decision-labs") return <DecisionLabsView />;
  if (a === "for-utilities") return <ForUtilitiesView />;
  if (a === "about") return <AboutView />;
  if (a === "contact") return <ContactView />;
  if (a === "challenge") { const c = b && getChallenge(b); return b ? (c ? <ChallengeDetailView challenge={c} /> : <NotFoundView />) : <ChallengeView />; }
  if (a === "white-papers") { const j = b && getWhitePaper(b); return b ? (j ? <WhitePaperView paper={j} /> : <NotFoundView />) : <WhitePapersView />; }
  if (a === "labs" && b) { const s = getScenario(b); return s ? <LabView key={b} scenario={s} /> : <NotFoundView />; }
  return <NotFoundView />;
}

function App() {
  const path = usePathname();
  return (
    <>
      <GridOpsHeader />
      <main id="main" key={path}>{route(path)}</main>
      <GridOpsFooter />
    </>
  );
}

createRoot(document.getElementById("gridops-root")!).render(<App />);
