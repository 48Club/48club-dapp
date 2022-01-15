import React from 'react'
import { useTranslation } from 'react-i18next'

const map = {
  doing: {
    style: {
      backgroundColor: '#08C849',
      color: '#FFFFFF',
    },
    text: 'staking',
  },
  undo: {
    style: {
      backgroundColor: '#E9E9E9',
      color: '#54606C',
    },
    text: 'not_staking',
  },
  revert: {
    style: {
      backgroundColor: '#1DA9F8',
      color: '#FFFFFF',
    },
    text: 'unstaking',
  },
}

export default function Tag(props) {
  const { t } = useTranslation()

  const { type } = props

  const data = map[type]
  return <span className="rounded h-7 px-3 py-1 w-fit" style={{ ...data.style, 'width': 'fit-content' }}>{t(data.text)}</span>
}
