import { Button, Input } from "antd";
import Back from "components/Back";
import React from "react";
import NFTModal from "./NFTModal";

const { TextArea } = Input;

export default function VotingCreate() {
  return (
    <div className="px-4 pt-3">
      <Back />
      <div
        className="mt-4 rounded-2xl flex flex-col items-center"
        style={{ backgroundColor: "#FFFBEC" }}
      >
        <span className="mt-8 font-bold text-2xl mb-4 text-light-black">
          创建KOGE投票
        </span>
        <span className="text-base mb-10 text-dark-gray">
          KOGE 投票将觉得治理方向
        </span>
      </div>
      <div className="flex flex-col mt-10">
        <span className="text-sm font-medium mb-2 text-light-black">
          选择NFT
        </span>
        <Input
          disabled
          placeholder="请选择"
          className="h-12 rounded font-bold text-sm text-light-black"
          onClick={() => {
            console.log(123);
          }}
          onTouchEnd={() => {
            console.log(123);
          }}
        />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          投票名称
        </span>
        <Input
          placeholder="请输入"
          className="h-12 rounded font-medium text-sm text-light-black"
        />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          NFT简介
        </span>
        <TextArea
          rows={4}
          placeholder="请输入"
          className="rounded font-medium text-sm text-light-black"
        />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          投票类型
        </span>
        <Input
          value="单选（不可修改）"
          className="h-12 rounded font-medium text-sm text-light-black"
          disabled
        />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          投票时间
        </span>
        <Input
          value="7天（不可修改）"
          className="h-12 rounded font-medium text-sm text-light-black"
          disabled
        />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          投票选项
        </span>
        <Input
          value="选项一：同意（不可修改）"
          className="h-12 rounded font-medium text-sm mb-2 text-light-black"
          disabled
        />
        <Input
          value="选项二：不同意（不可修改）"
          className="h-12 rounded font-medium text-sm text-light-black"
          disabled
        />
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          支付费用
        </span>
        <Input
          value="1.25KOGE"
          className="h-12 rounded font-medium text-sm text-light-black"
        />
      </div>
      <Button
        className="h-12 text-sm mt-12 w-full mb-20 text-light-black bg-yellow rounded"
      >
        提交NFT
      </Button>

      <NFTModal />
    </div>
  );
}
