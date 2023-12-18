import { useTranslation } from 'react-i18next'
import Label from '../../../components/Label'
import { useParams } from 'react-router-dom'
import { formatAmount } from '@funcblock/dapp-sdk'
import useGovDetailVotes from '../../../hooks/gov/useGovDetailVotes'

export default function HistorySection() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { voteRecords } = useGovDetailVotes(id as string)

  if (!voteRecords) {
    return null
  }

  return (
    <div className="flex flex-col my-20">
      <Label text={t('vote_details')} />
      <div className="mt-6 px-6 shadow rounded-lg">
        {voteRecords.length > 0 ? (
          <div>
            <div className="hidden md:grid justify-between pt-10 pb-4 text-gray"
              style={{ gridTemplateColumns: '40% 10% 30% 10% 10% ' }}
            >
              <span className="flex">{t('address')}</span>
              <span>{t('result')}</span>
              <span>{t('reason')}</span>
              <span>KOGE</span>
              <span>{t('block_number')}</span>
            </div>
            {voteRecords.map((i, index) => {
              return (
                <div key={index}>
                  <div className="pt-6 pb-2 flex flex-col border-b border-gray md:hidden" key={index + 'sm'}>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('address')}</span>
                      <span className="break-words text-right text-light-black break-all">
                        {i.voter}
                      </span>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('result')}</span>
                      <span className="break-words text-right">
                        {i.support === '1' ? 'Approve' : 'Reject'}
                      </span>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('reason')}</span>
                      <span className="break-words text-right">
                        {i.reason}
                      </span>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">KOGE</span>
                      <span className="break-words text-right">
                        {formatAmount(i.weight, 18)}
                      </span>
                    </div>
                    <div className="flex flex-row mb-4 text-sm leading-5 justify-between">
                      <span className="text-gray">{t('block_number')}</span>
                      <span className="break-words text-right">
                        {i.blockNumber}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:grid border-b justify-between py-4" style={{ gridTemplateColumns: '40% 10% 30% 10% 10% ' }} key={index + 'md'}>
                    <span className="break-words text-light-black">
                      {i.voter}
                    </span>
                    <span className="break-words">
                      {i.support === '1' ? 'Approve' : 'Reject'}
                    </span>
                    <span className="break-words">
                      {i.reason}
                    </span>
                    <span className="break-words">
                      {formatAmount(i.weight, 18)}
                    </span>
                    <span className="break-words">
                      {i.blockNumber}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/static/staking-no-records.png" className="mb-6 w-60" alt="" />
            <span className="text-base text-gray">{t('no_data')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
