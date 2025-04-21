import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

export default function HeaderSection() {
  const { t } = useTranslation()
  return (
    <div className="pt-4 w-auto mb-10">
      <div
        className="flex flex-col rounded-2xl items-center px-6 bg-another-white
          pt-4 pb-10
          md:flex-row md:justify-between md:h-56 md:relative md:px-14
        "
      >
        <img src="/static/voting-header.png" className="block w-48 mb-10 md:absolute md:right-16 md:top-4 md:w-72" alt="" />
        <div className="flex flex-col">
          <span className="font-bold text-2xl leading-7 mb-4 text-light-black">
            {t('proposal_list')}
          </span>
          <span className="text-base leading-6 mb-5 text-dark-gray">
            {t('review_all_proposal')}
          </span>

          <NavLink to="/voting/create">
            <Button className="h-10 text-sm font-medium w-full rounded text-light-black bg-gray">
              {t('create_proposal')}
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  )
}
