import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Button } from "antd";
import Label from "components/Label";
import React from "react";
import { useTranslation } from "react-i18next";

export default function VoteSection() {
  const { t } = useTranslation();
  return (
    <div className="pt-20 w-full">
      <Label text="选择您的投票" />
      <div
        className="mt-6 flex flex-col px-6"
        style={{ boxShadow: "0px 0.5rem 1.5rem rgba(0, 0, 0, 0.06)" }}
      >
        <Button
          className="mt-6 h-12 text-light-black text-xl font-bold"
          icon={
            <CheckCircleTwoTone
              twoToneColor="#08C849"
              className="align-baseline"
            />
          }
        >
          同意
        </Button>
        <Button
          className="mt-6 h-12 text-light-black text-xl font-bold"
          icon={
            <CloseCircleTwoTone
              twoToneColor="#EF2B2B"
              className="align-baseline"
            />
          }
        >
          拒绝
        </Button>
        <Button className="h-10 my-8 text-sm font-medium rounded text-light-black bg-gray">
          确认
        </Button>
      </div>
    </div>
  );
}
