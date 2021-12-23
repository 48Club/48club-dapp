import {
  CloseOutlined,
  EllipsisOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Input, Modal, Popconfirm } from "antd";
import Label from "components/Label";
import React from "react";
import { useTranslation } from "react-i18next";

import "./index.less";
export default function MemberSection() {
  const { t } = useTranslation();
  const list = [1, 2, 3];
  const modalHeader = (
    <div className="flex flex-row px-4 justify-between py-5">
      <span className="font-bold text-lg text-light-black">
        修改KOGE理事标准资格
      </span>
      <CloseOutlined className="text-xs font-bold text-gray" />
    </div>
  );

  const popContent = (
    <div className="flex flex-col w-50">
      <div className="flex flex-row h-10 pl-4 items-center">
        <MinusOutlined className="text-xs mr-2" />
        <span className="text-sm text-light-black">移除现有理事</span>
      </div>
      <div className="flex flex-row h-10 pl-4 items-center">
        <PlusOutlined className="text-xs mr-2" />
        <span className="text-sm text-light-black">提名新理事</span>
      </div>
    </div>
  );
  return (
    <div className="mt-20 w-auto mb-10">
      <div className="flex flex-row justify-between mb-6">
        <Label text="理事会成员列表" />
        <Popconfirm
          className="member-pop"
          placement="bottomRight"
          title={popContent}
          icon={null}
          onConfirm={() => {}}
          okButtonProps={{ className: "hidden" }}
          cancelButtonProps={{ className: "hidden" }}
        >
          <EllipsisOutlined className="text-2xl text-light-black" />
        </Popconfirm>
      </div>
      {list.map((item) => {
        return (
          <div className="flex flex-col w-full bg-another-white p-6 mb-10 rounded-xl shadow">
            <span className="font-bold text-2xl text-light-black mb-2">
              Mominator008
            </span>
            <span className="text-base text-dark-gray font-medium mb-8">
              dominator008@bnb48.club
            </span>
            <div className="flex flex-row items-center">
              <img src="/static/telegram.svg" alt="" className="w-4 mr-2" />
              <span className="text-base text-light-black font-bold">
                Mominator008
              </span>
            </div>
          </div>
        );
      })}
      <span className="mb-6 font-medium text-light-black text-base block">
        KOGE质押量变更，不符合资格理事名单
      </span>
      {list.map((item) => {
        return (
          <div className="flex flex-col w-full bg-pink p-6 mb-10 rounded-xl shadow relative">
            <span className="font-bold text-2xl text-light-black mb-2">
              Mominator008
            </span>
            <span className="text-base text-dark-gray font-medium mb-8">
              dominator008@bnb48.club
            </span>
            <div className="flex flex-row items-center">
              <img src="/static/telegram.svg" alt="" className="w-4 mr-2" />
              <span className="text-base text-light-black font-bold">
                Mominator008
              </span>
            </div>
            <CloseOutlined className="absolute right-4 top-4 text-gray text-xs font-bold" />
          </div>
        );
      })}
      <div className="pb-20 text-center">
        <Button className="h-9 text-sm font-medium rounded text-light-black bg-gray">
          查看更多
        </Button>
      </div>
      <Modal
        title={modalHeader}
        visible={false}
        footer={null}
        onOk={() => {}}
        onCancel={() => {}}
        className="member-modal"
        width="100%"
      >
        <div className="flex flex-col mt-6 px-4 mb-2">
          <span className="text-sm font-medium mb-2 text-light-black">
            Staking质押总量
          </span>
          <Input
            placeholder="请输入"
            className="h-12 rounded font-medium text-sm text-light-black"
          />
        </div>
        <span className="text-sm font-medium text-dark-gray px-4">
          请注意：当前质押标准20,000枚KOGE
        </span>
        <div className="absolute bottom-6 px-4 w-full">
          <Button className="h-10 w-full text-sm text-light-black bg-yellow">
            确定
          </Button>
        </div>
      </Modal>
    </div>
  );
}
