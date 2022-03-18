import React from 'react'
import { useTranslation } from 'react-i18next'

const map = {
  Active: {
    style: {
      backgroundColor: '#1DA9F8',
      color: '#FFFFFF',
    },
  },
  Succeeded: {
    style: {
      backgroundColor: '#08C849',
      color: '#FFFFFF',
    },
  },
  Invalid: {
    style: {
      backgroundColor: '#E9E9E9',
      color: '#54606C',
    },
  },
  Defeated: {
    style: {
      backgroundColor: '#E9E9E9',
      color: '#54606C',
    },
  },
  Refunded: {
    style: {
      backgroundColor: '#E9E9E9',
      color: '#54606C',
    },
  },
}

export default function Tag({ type }) {
  const { t } = useTranslation()
  const data = map[type] ?? {}
  return <span className="rounded h-7 px-3 py-1 w-fit" style={{ ...data.style, 'width': 'fit-content' }}>{type}</span>
}
