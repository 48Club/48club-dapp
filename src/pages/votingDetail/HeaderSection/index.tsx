import Tag from "components/Tag";
import React from "react";
import { useTranslation } from "react-i18next";

export default function HeaderSection() {
  const { t } = useTranslation();
  return (
    <div className="pt-4 w-auto mb-10">
      <div
        className="flex flex-col rounded-2xl items-center px-6 pt-8 pb-10 bg-another-white"
        style={{ backgroundColor: "#FFFBEC" }}
      >
        <span className="font-bold text-2xl mb-4 text-light-black">
          KOGE 第四季度回购方案
        </span>
        <Tag type="doing" />
        <span className="text-base mt-4 text-dark-gray pb-6 border-b border-gray text-center">
          KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容，KORE第四季度回购方案具体内容。
        </span>
        <div className="mt-6 flex flex-row justify-between text-sm w-full">
            <span className="text-dark-gray">作者</span>
            <span className="font-medium text-light-black">0x4dfv34...34df 提出</span>
        </div>
        <div className="mt-4 flex flex-row justify-between text-sm w-full">
            <span className="text-dark-gray">开始时间</span>
            <span className="font-medium text-light-black">2020-11-20 10:10:10</span>
        </div>
        <div className="mt-4 flex flex-row justify-between text-sm w-full">
            <span className="text-dark-gray">结束时间</span>
            <span className="font-medium text-light-black">2020-11-20 10:10:10</span>
        </div>
        <div className="mt-6 flex flex-row justify-between text-sm w-full">
            <span className="text-dark-gray">投票制度</span>
            <span className="font-medium text-light-black">单选</span>
        </div>
      </div>
    </div>
  );
}
