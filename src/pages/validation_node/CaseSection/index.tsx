import { Col, Row } from "antd";
import CaseListCard from "./CaseListCard";
import "./index.less";

const REVIEW_ITEMS = [
  {
    id: 1,
    title: "The48Club",
    content:
      "https://www.bnbchain.org/en/bnb-staking/validator/0xaACc290a1A4c89F5D7bc29913122F5982916de48",
    image_url: 
      "https://raw.githubusercontent.com/bnb-chain/bsc-validator-directory/main/mainnet/validators/0xaACc290a1A4c89F5D7bc29913122F5982916de48/logo.png",
  },
  {
    id: 2,
    title: "Turing",
    content:
      "https://www.bnbchain.org/en/bnb-staking/validator/0x0E3cf208F4141C41da86d52C5F2076b1aB310E8F",
    image_url: 
      "https://raw.githubusercontent.com/bnb-chain/bsc-validator-directory/main/mainnet/validators/0x0E3cf208F4141C41da86d52C5F2076b1aB310E8F/logo.png",
  },
  {
    id: 3,
    title: "Avengers",
    content:
      "https://www.bnbchain.org/en/bnb-staking/validator/0xa31A940ecFB4Cb9fE7884eB3C9a959Db79CbdC70",
    image_url: 
      "https://raw.githubusercontent.com/bnb-chain/bsc-validator-directory/main/mainnet/validators/0xa31A940ecFB4Cb9fE7884eB3C9a959Db79CbdC70/logo.png",
  },
  {
    id: 4,
    title: "Feynman",
    content:
      "https://www.bnbchain.org/en/bnb-staking/validator/0xdFeAcaffE5EAF47E442ef2ddAeAea2f21a6d3f91",
    image_url: 
      "https://raw.githubusercontent.com/bnb-chain/bsc-validator-directory/main/mainnet/validators/0xdFeAcaffE5EAF47E442ef2ddAeAea2f21a6d3f91/logo.png",
  },
  {
    id: 5,
    title: "Shannon",
    content:
      "https://www.bnbchain.org/en/bnb-staking/validator/0xB58ac55EB6B10e4f7918D77C92aA1cF5bB2DEd5e",
    image_url: 
      "https://raw.githubusercontent.com/bnb-chain/bsc-validator-directory/main/mainnet/validators/0xB58ac55EB6B10e4f7918D77C92aA1cF5bB2DEd5e/logo.png",
  },
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
