import { Button, Input } from "antd";
import Tag from "components/Tag";
import React from "react";
import { useTranslation } from "react-i18next";
import Label from "../../../components/Label";

import "./index.less";

export default function PledgeSection() {
  const { t } = useTranslation();
  const inputMax = (
    <div className="text-sm" style={{ color: "#FFC801" }}>
      MAX
    </div>
  );
  return (
    <div className="flex flex-col">
      <Label text={t("staking_pledge_title")} />
      <div
        className="mt-6 w-auto flex flex-col rounded-lg"
        style={{ boxShadow: "0px 0.5rem 1.5rem rgba(0, 0, 0, 0.06)" }}
      >
        <div
          className="flex flex-col pl-6 text-light-black"
          style={{ backgroundColor: "#FFFBEC" }}
        >
          <div className="flex flex-row mt-10 mb-4 ">
            <div className="font-medium text-base mr-3 leading-7">
              我的质押数量
            </div>
            <Tag type="doing" />
          </div>
          <span className="text-2xl font-bold mb-4 leading-7">
            123,345,000 KOGE
          </span>
          <span
            className="text-sm leading-5 mb-12"
            style={{ color: "#54606C" }}
          >
            123,345,000 KOGE
          </span>
        </div>
        <div className="flex flex-col px-6 mb-20">
          <div className="flex flex-row mt-10 mb-6">
            <div className="py-2 px-4 font-medium text-base text-center active">
              质押
            </div>
            <div className="py-2 px-4 font-medium text-base text-center">
              解除质押
            </div>
          </div>
          <Input suffix={inputMax} className="h-12 mb-6" />
          <Button
            className="h-12 text-sm text-light-black"
            style={{ backgroundColor: "#FFC801" }}
          >
            确认
          </Button>
        </div>
      </div>
    </div>
  );
}
