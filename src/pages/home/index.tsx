import BannerSection from './BannerSection'
import IntroductionSection from './IntroductionSection'
import CustomerSection from './CustomerSection'
import ActivitySection from './ActivitySection'

export default function Home() {
  return (
    <div className="home-page mx-auto">
      <BannerSection />
      <ActivitySection />
      <IntroductionSection />
      <CustomerSection />
    </div>
  )
}
