import { DatePicker, Select, Switch } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./index.less";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function FilterSection() {
  const { t } = useTranslation();
  const optionList = [
    {
      label: "全部",
      value: "all",
    },
    {
      label: "进行中",
      value: "doing",
    },
    {
      label: "已通过",
      value: "done",
    },
    {
      label: "已关闭",
      value: "fail",
    },
  ];

  const [switchValue, changeSwitch] = useState(true);

  return (
    <div className="pt-4 w-auto mb-10 flex flex-col">
      <div className="flex flex-col mb-6">
        <span className="text-sm leading-5 mb-2 text-light-black">
          筛选时间
        </span>
        <RangePicker className="h-12 rounded bg-light-white" />
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col w-full mr-6">
          <span className="text-sm leading-5 mb-2 text-light-black">
            提案状态
          </span>
          <Select
            defaultValue="all"
            className="w-full h-12 rounded filter-select bg-light-white"
          >
            {optionList.map((item) => {
              return <Option key={item.label} value={item.value}>{item.label}</Option>;
            })}
          </Select>
        </div>
        <div className="shrink-0 w-20 flex flex-col" style={{ flexShrink: 0 }}>
          <span className="text-sm leading-5 mb-2 text-light-black">
            与我相关
          </span>
          <Switch
            checked={switchValue}
            className="filter-switch w-full h-12"
            onChange={changeSwitch}
          />
        </div>
      </div>
    </div>
  );
}
