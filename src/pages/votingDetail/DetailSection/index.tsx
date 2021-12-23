import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import Label from "../../../components/Label";

// todo  抽离表格
export default function DetailSection() {
  const { t } = useTranslation();
  const record = [1, 2, 3];
  return (
    <div className="flex flex-col my-20">
      <Label text="投票信息" />
      <div className="mt-6 px-6 shadow">
        {record.length > 0 ? (
          <div>
            {record.map((item) => {
              return (
                <div className="py-6 flex flex-col border-b border-gray">
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="color-gray">地址</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      0x3050dc66df3253b27eda28529fea26abfb19e4ddfbf45d65632bca3a44cd114c
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="color-gray">投票结果</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      YES
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="color-gray">KOGE数量</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      194.23
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span className="color-gray">日期</span>
                    <span className="break-words text-right text-light-black max-w-48">
                      2021-11-12 10:23:22
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="py-10 text-center">
              <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
                查看更多
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/static/staking-no-records.png" className="mb-6" alt=""/>
            <span className="text-base color-gray">暂无记录</span>
          </div>
        )}
      </div>
    </div>
  );
}
