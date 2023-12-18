import BannerSection from './BannerSection'
import CaseSection from './CaseSection'
import './index.less'

export default function ValidationNode() {
  return (
    <div className="validation-node-page max-w-6xl mx-auto">
      <BannerSection />
      <CaseSection />
    </div>
  )
}
