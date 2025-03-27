import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Back from 'components/Back'
import HeaderSection from './HeaderSection'
import ResultSection from './ResultSection'
import VoteSection from './VoteSection'
import HistorySection from './HistorySection'

export default function VotingDetail() {
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滚动
    });
  }, [])
  return (
    <div className="relative px-4 max-w-6xl mx-auto pb-20">
      <Back />
      <HeaderSection />
      <div className="flex flex-col md:flex-row items-stretch mt-20">
        <VoteSection proposalId={id || '0'} />
        <ResultSection />
      </div>
      <HistorySection />
    </div>
  )
}
