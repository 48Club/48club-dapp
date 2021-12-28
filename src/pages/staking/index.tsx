import React from "react";
import PledgeSection from "./PledgeSection";
import RecordSection from "./RecordSection";
import SummarySection from "./SummarySection";

export default function Staking() {
  return (
    <div className="px-4 max-w-6xl mx-auto">
      <SummarySection />
      <PledgeSection />
      <RecordSection />
    </div>
  );
}
