import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import Label from "../../../components/Label";

export default function RecordSection() {
  const { t } = useTranslation();
  const record = [1, 2, 3];
  return (
    <div className="flex flex-col my-20">
      <Label text="质押详情记录" />
      <div
        className="mt-6 px-6"
        style={{ boxShadow: "0px 0.5rem 1.5rem rgba(0, 0, 0, 0.06)" }}
      >
        {record.length > 0 ? (
          <div>
            {record.map((item) => {
              return (
                <div
                  className="py-6 flex flex-col"
                  style={{ borderBottom: "0.0625rem solid #EAEAEA" }}
                >
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span style={{ color: "#A9A9A9" }}>地址</span>
                    <span
                      className="break-words text-right"
                      style={{ color: "#1E1E1E", maxWidth: "12rem" }}
                    >
                      0x3050dc66df3253b27eda28529fea26abfb19e4ddfbf45d65632bca3a44cd114c
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span style={{ color: "#A9A9A9" }}>质押操作</span>
                    <span
                      className="break-words text-right"
                      style={{ color: "#1E1E1E", maxWidth: "12rem" }}
                    >
                      质押代币
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span style={{ color: "#A9A9A9" }}>数量</span>
                    <span
                      className="break-words text-right"
                      style={{ color: "#1E1E1E", maxWidth: "12rem" }}
                    >
                      194.23
                    </span>
                  </div>
                  <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                    <span style={{ color: "#A9A9A9" }}>日期</span>
                    <span
                      className="break-words text-right"
                      style={{ color: "#1E1E1E", maxWidth: "12rem" }}
                    >
                      2021-11-12 10:23:22
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="py-10 text-center">
              <Button
                className="h-9 text-sm font-medium"
                style={{ backgroundColor: "#E9E9E9", color: "#1E1E1E" }}
              >
                查看更多
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/static/staking-no-records.png" className="mb-6" />
            <span className="text-base" style={{ color: "#A9A9A9" }}>
              暂无记录
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
