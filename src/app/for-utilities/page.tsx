import type { Metadata } from "next";
import { ForUtilitiesView } from "@/components/views/ForUtilitiesView";

export const metadata: Metadata = {
  title: "For Utility Training Teams",
  description: "Supplemental scenario practice for distribution operator training programs: developing operators, recurrent proficiency, workshops, and pilots.",
  alternates: { canonical: "/for-utilities" },
};

export default function Page() {
  return <ForUtilitiesView />;
}
