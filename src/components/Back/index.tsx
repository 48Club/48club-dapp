import { ArrowLeftOutlined } from '@ant-design/icons'
import React from 'react'
import { useHistory } from 'react-router'


export default function Back(props) {
  let history = useHistory()

  const back = () => {
    history.goBack()
  }
  return <div className="mt-4 w-10 h-10 text-center rounded-2xl cursor-pointer flex justify-center items-center md:absolute md:-left-8 md:mt-0" style={{ backgroundColor: '#FFFBEC' }} onClick={back}>
    <ArrowLeftOutlined className="text-base leading-10 text-gray" />
  </div>
}
