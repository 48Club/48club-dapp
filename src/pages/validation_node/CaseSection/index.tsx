import React from "react";
import { Col, Row } from "antd";
import CaseListCard from "./CaseListCard";
import "./index.less";

const REVIEW_ITEMS = [
  {
    id: 1,
    title: "BNB48Club",
    content:
      "https://www.bnbchain.world/en/staking/validator/bva1ygrhjdjfyn2ffh5ha5llf5g6l3wxjt29hz9q4s",
    image_url: "https://dex-bin.bnbstatic.com/static/images/bnb-chain-h.svg",
  }
];

export default function CaseSection() {
  return (
    <div className="case-section">
      <div className="container">
        <div className="section-header">
          <div className="section-content">
            <Row gutter={24}>
              {REVIEW_ITEMS.map((item) => (
                <Col xs={24} md={24} key={`case-list-card-${item.id}`}>
                  <CaseListCard item={item} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
