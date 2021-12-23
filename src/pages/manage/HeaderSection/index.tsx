import React from "react";
import { useTranslation } from "react-i18next";

export default function HeaderSection() {
  const { t } = useTranslation();
  return (
    <div className="pt-4 w-auto mb-10">
      <div className="flex flex-col rounded-2xl items-center px-6 bg-another-white">
        <img
          src="/static/manage-header.png"
          className="w-48 mb-10 mt-4"
          alt=""
        />
        <span className="font-bold text-2xl leading-7 mb-4 text-light-black">
          KOGE理事会管理
        </span>
        <span className="text-base text-dark-gray mb-12 text-center">
          KOGE俱乐部所有成员信息，在此可以提名新理事，弹劾现有理事，修改理事标准资格
        </span>
      </div>
    </div>
  );
}
