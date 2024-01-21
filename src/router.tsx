import { Outlet, createBrowserRouter } from 'react-router-dom'

import Footer from 'components/Footer'
import Header from 'components/Header'
import StakeModal from 'components/Modal/StakeModal'
import UnStakeModal from 'components/Modal/UnStakeModal'
import { NotificationsList } from 'components/Notifications'

import Inscriptions from '@/pages/inscriptions'
import Governance from '@/pages/committee'
import Milestone from '@/pages/milestone'
import NFT from '@/pages/nft'
import NFTCreate from '@/pages/nftCreate'
import Pool from '@/pages/pool'
import Staking from '@/pages/staking'
import ValidationNode from '@/pages/validation_node'
import Validator from '@/pages/validator'
import Voting from '@/pages/voting'
import VotingCreate from '@/pages/votingCreate'
import VotingDetail from '@/pages/votingDetail'
import { Layout } from 'antd'
import Home from '@/pages/home'
import ExplorerDetail from '@/pages/inscriptions/explorer_detail'
import Explorer from './pages/inscriptions/explorer'
import Account from './pages/inscriptions/account'
import Marketplace from './pages/inscriptions/marketplace'
import { Deploy } from './pages/inscriptions/explorer/Deploy'
import AccountMobileBetch from './pages/inscriptions/account/AccountMobileBetch'
import BatchTransferBox from './pages/inscriptions/account/BatchTransfer/index'
import Recap from './pages/inscriptions/account/Recap'
import WalletModal from './components/Modal/WalletModal'

// eslint-disable-next-line react-refresh/only-export-components
const LayoutWrap = () => (
  <Layout>
    <Header />
    <div style={{ marginTop: 70 }}>
      <Outlet />
      <StakeModal />
      <UnStakeModal />
      <WalletModal />
      <NotificationsList />
    </div>
    <Footer />
  </Layout>
)

const routes = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrap />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/milestome',
        element: <Milestone />,
      },
      {
        path: '/committee',
        element: <Governance />,
      },
      {
        path: '/validation-node',
        element: <ValidationNode />,
      },
      {
        path: '/staking',
        element: <Staking />,
      },
      {
        path: '/nft',
        element: <NFT />,
      },
      {
        path: '/nft/create',
        element: <NFTCreate />,
      },
      {
        path: '/voting',
        element: <Voting />,
      },
      {
        path: '/voting/create',
        element: <VotingCreate />,
      },
      {
        path: '/voting/detail/:id',
        element: <VotingDetail />,
      },
      {
        path: '/pool',
        element: <Pool />,
      },
      {
        path: '/validator',
        element: <Validator />,
      },
      {
        path: '/inscriptions',
        element: <Inscriptions />,
        children: [
          {
            index: true,
            element: <Explorer />,
          },
          {
            path: '/inscriptions/explorer',
            element: <Explorer />,
          },
          {
            path: '/inscriptions/explorer/mobile/deploy',
            element: <Deploy />,
          },
          {
            path: '/inscriptions/explorer/detail/:id',
            element: <ExplorerDetail />,
          },
          {
            path: '/inscriptions/account',
            element: <Account />,
          },
          {
            path: '/inscriptions/account/mobile/betch',
            element: <AccountMobileBetch />,
          },
          {
            path: '/inscriptions/marketplace',
            element: <Marketplace />,
          },
          {
            path: '/inscriptions/account/betch/:hash',
            element: <BatchTransferBox />,
          },
          {
            path: '/inscriptions/account/recap/:hash',
            element: <Recap />,
          },
        ],
      },
    ],
  },
])

export default routes
