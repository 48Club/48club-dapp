import { useTranslation } from 'react-i18next'

const Empty = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <img src="/static/staking-no-records.png" className="mb-6" alt="" />
      <span className="text-base text-gray">{t('no_records')}</span>
    </div>
  )
}

export default Empty
