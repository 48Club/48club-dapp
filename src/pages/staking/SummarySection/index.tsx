import React from "react";
import { useTranslation } from "react-i18next";

export default function SummarySection() {
  const { t } = useTranslation();
  return (
    <div className="pt-4 w-auto overflow-y-visible mb-20">
      <div
        className="h-100 flex flex-row relative rounded-2xl"
        style={{ backgroundColor: "#FFFBEC" }}
      >
        <div className="flex flex-col pt-8 px-6" style={{ color: "#54606C" }}>
          <span
            className="font-bold text-4xl mb-2"
            style={{ color: "#1e1e1e" }}
          >
            {t("staking_title")}
          </span>
          <span className="text-sm mb-10">{t("staking_desc")}</span>
          <div className="flex flex-col">
            <div className="flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">
                {t("staking_summary_total")}
              </span>
              <span className="text-xl font-bold" style={{ color: "#1e1e1e" }}>
                123,123,000
              </span>
            </div>
            <div className="flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">
                {t("staking_summary_pledge")}
              </span>
              <span className="text-xl font-bold" style={{ color: "#1e1e1e" }}>
                123,123,000
              </span>
            </div>
            <div className="flex flex-col mb-6">
              <span className="text-sm mb-2 leading-5">
                {t("staking_summary_own")}
              </span>
              <span className="text-xl font-bold" style={{ color: "#1e1e1e" }}>
                6.00%
              </span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 -bottom-5 w-48">
          <img src="/static/summary-section.png" />
        </div>
      </div>
    </div>
  );
}
