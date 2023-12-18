import { CloseOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Input, Modal } from 'antd'
import Label from 'components/Label'
//
// import { useTranslation } from 'react-i18next'

import './index.less'

export default function StandardSection() {
  // const { t } = useTranslation()

  const modalHeader = (
    <div className="flex flex-row px-4 justify-between py-5">
      <span className="font-bold text-lg text-light-black">
        修改KOGE理事标准资格
      </span>
      <CloseOutlined className="text-xs font-bold text-gray" />
    </div>
  )

  return (
    <div className="mt-20 w-auto mb-10">
      <Label text="理事会入会标准" />
      <div className="flex flex-col mt-6 shadow w-full px-6 text-light-black">
        <span className="mt-10 text-base font-medium">
          KOGE俱乐部所有成员KOGE质押量
        </span>
        <span className="mt-4 font-bold text-2xl">大于20,000个</span>
        <Button className="mt-10 mb-8 h-10 text-sm text-light-black bg-yellow rounded font-medium">
          <EditOutlined className="text-lg" />
          修改
        </Button>
      </div>

      <Modal
        title={modalHeader}
        open={false}
        footer={null}
        onOk={() => {
        }}
        onCancel={() => {
        }}
        className="standard-modal"
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
  )
}
