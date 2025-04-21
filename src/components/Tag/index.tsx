import { useTranslation } from 'react-i18next'

const map: any = {
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

export default function Tag({ type, className = '' }: { type: string, className?: string }) {
  const { t } = useTranslation()
  const data = map[type] ?? {}
  return <span className={`rounded h-7 px-3 py-1 w-fit ${className}`} style={{ ...data.style, 'width': 'fit-content' }}>{t(type?.toLowerCase())}</span>
}
