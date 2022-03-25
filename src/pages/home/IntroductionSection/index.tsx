import React from "react";
import "./index.less";
import { useTranslation } from "react-i18next";

export default function CustomerSection() {
  const { t } = useTranslation();

  return (
    <div className="introduction-section">
      <div className="container">
        <div className="section-header">
          <div className="section-logo">
            <img src="/static/logo-koge-01.png" alt="Koge" />
          </div>
          <div className="section-title">
            {t("home_page_introduction_section_title")}
          </div>
          <div className="section-subtitle">
            {t("home_page_introduction_section_subtitle")}
          </div>
          <div className="section-subtitle">
            {t("home_page_introduction_section_desc")}{" "}
            <a
              href="https://bscscan.com/token/0xe6df05ce8c8301223373cf5b969afcb1498c5528"
              target="_blank"
              rel="noopener noreferrer"
            >
              BNB48 Club® Token
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
