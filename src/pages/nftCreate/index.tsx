import { PictureOutlined } from "@ant-design/icons";
import { Button, Input, Upload } from "antd";
import Back from "components/Back";
import React from "react";

const { TextArea } = Input;
export default function NFTCreate() {
  return (
    <div className="px-4">
      <Back />
      <div
        className="mt-4 rounded-2xl flex flex-col items-center"
        style={{ backgroundColor: "#FFFBEC" }}
      >
        <span className="mt-8 font-bold text-2xl mb-4 text-light-black">
          创建 KOGE NFT
        </span>
        <span className="text-base mb-10 text-dark-gray">
          KOGE NFT将用于KOGE的一般治理
        </span>
      </div>
      <div className="flex flex-col mt-10">
        <span className="text-sm font-medium mb-2 text-light-black">
          请选择NFT资料类型
        </span>
        <div className="flex flex-row">
          <div className="h-10 text-sm text-center w-full mr-4 border border-gray leading-10 rounded">
            自定义
          </div>
          <div className="h-10 text-sm text-center w-full border border-yellow text-yellow leading-10 rounded">
            系统自定义
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          上传NFT文件
        </span>
        <div className="flex flex-col bg-light-white w-full items-center px-12">
          <PictureOutlined className="text-3xl mt-8" />
          <span className="text-light-black text-xs font-medium mt-3 text-center">
            支持JPG、PNG、TIF、GIF格式，文件最大不超过40M
          </span>
          <Upload>
            <Button className="h-10 mt-4 w-38 text-sm text-light-black bg-yellow mb-7">
              上传图片
            </Button>
          </Upload>
        </div>
      </div>
      <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          NFT名称
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
      <div className="flex flex-row justify-between text-sm mt-12">
        <span className="text-dark-gray ">您需要支付</span>
        <span className="text-light-black font-medium">
          100枚 KOGE (KOGE≈1.23USDT)
        </span>
      </div>
      <div className="flex flex-row justify-between text-sm mt-4">
        <span className="text-dark-gray ">该NFT序号</span>
        <span className="text-light-black font-medium">第1,234枚NFT</span>
      </div>
      <Button className="h-12 text-sm text-light-black bg-yellow rounded font-medium mt-6 mb-20 w-full">
        提交NFT
      </Button>
    </div>
  );
}
