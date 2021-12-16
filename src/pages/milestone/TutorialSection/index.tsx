import React from 'react'
import moment from 'moment'
import CryptocurrencyTimelineCard from '../../../components/CryptocurrencyTimelineCard'
import './index.less'

const TUTORIAL_ITEMS = [
  {
    event_title: '2018-05-20',
    event_content: '千总从大洋彼岸回国考察区块链行业，与Gui进行了会面，两位大佬交流了行业看法，会面始终在愉快的氛围中进行。',
    event_content_en: 'BNB48 Club Koge bot went live and users could use it to mine Koge tokens.',
  },
  {
    event_title: '2018-06-17',
    event_content: '俱乐部主页正式上线',
    event_content_en: 'BNB48 Club website went live.',
  },
  {
    event_title: '2018-07-17',
    event_content: '由于币安交易规则限制了挂单价格便宜市价的幅度，#SellBNBAt48BTC 活动被迫中止',
    event_content_en: '#SellBNBAt48BTC event was suspended due to Binance trading rules.',
  },
  {
    event_title: '2018-07-17',
    event_content: '俱乐部Koge机器人加入聊天挖矿功能<br /><br />即日起俱乐部发起聊天即挖矿，产出BNB48币。 基本规则如下： 1、每条在群内聊天发出消息，即有概率挖出一枚BNB48币。 2、每10分钟只产出一枚BNB48币。如果该周期内无人发言，则不产出币。<br /><br />同时开启了挖矿赢Tshirt活动，限量派发5件cz签名正版币安纪念T恤。<br /><br />BNB48币将会是俱乐部内部活动的重要资产与等级依据。 待Binance Chain主网上线之时，将会停止BNB48币的预发行，并快照数据迁移到Binance Chain上。 届时会更新该币种的最新用途、规则。敬请期待。',
    event_content_en: '俱乐部Koge机器人加入聊天挖矿功能<br /><br />即日起俱乐部发起聊天即挖矿，产出BNB48币。 基本规则如下： 1、每条在群内聊天发出消息，即有概率挖出一枚BNB48币。 2、每10分钟只产出一枚BNB48币。如果该周期内无人发言，则不产出币。<br /><br />同时开启了挖矿赢Tshirt活动，限量派发5件cz签名正版币安纪念T恤。<br /><br />BNB48币将会是俱乐部内部活动的重要资产与等级依据。 待Binance Chain主网上线之时，将会停止BNB48币的预发行，并快照数据迁移到Binance Chain上。 届时会更新该币种的最新用途、规则。敬请期待。',
  },
  {
    event_title: '2018-08-11',
    event_content: '今日，Gui携家人来到郑州，与Hu把酒言欢，表示Hu总太能喝了，不胜酒力。Hu毫不留情地指出俩人只喝了半斤。',
    event_content_en: '今日，Gui携家人来到郑州，与Hu把酒言欢，表示Hu总太能喝了，不胜酒力。Hu毫不留情地指出俩人只喝了半斤。',
  },
  {
    event_title: '2018-12-11',
    event_content: '俱乐部主导翻译的币安API文档中文版已经初步完成并与最新的官方文档更新同步 ',
    event_content_en: 'BNB48 Club’s initiative to translate Binance’s API documentation was completed.',
  },
  {
    event_title: '2019-01-20',
    event_content: '俱乐部收到捐赠总数突破500BNB大关',
    event_content_en: 'Total donations to the club exceeded 500BNB.',
  },
  {
    event_title: '2019-03-27',
    event_content: 'SirIan在DEX交易大赛过程中提交的Bug获得确认，得到等值800美元(48.77 BNB)的奖励。0.77用作转账手续费等开销。48 BNB将捐赠给BNB 48，同时产生的永久KOGE捐赠给俱乐部。',
    event_content_en: 'Ian donated 48.77 BNB, which he won in a DEX trading competition, to the BNB48 Club.',
  },
  {
    event_title: '2019-03-29',
    event_content: '开始公示俱乐部财务报表',
    event_content_en: 'BNB48 Club financial statements became publicly available.',
  },
  {
    event_title: '2019-04-17',
    event_content: '捐赠比例下调为 1:7500',
    event_content_en: 'BNB to Koge ratio was adjusted to 1:7500.',
  },
  {
    event_title: '2019-04-22',
    event_content: '俱乐部章程意见稿发布',
    event_content_en: 'BNB48 Club constitution was drafted.',
  },
  {
    event_title: '2019-04-24',
    event_content: 'BNB48Club 分别在测试网络与正式网络上部署了币安链全节点 ',
    event_content_en: 'BNB48Club deployed full nodes on the Binance Chain mainnet and testnet.',
  },
  {
    event_title: '2019-04-29',
    event_content: '首届理事会选举完成。<br /><br />@SirIanM (理事长)<br /><br />@gscoin<br /><br />@hutian280<br /><br />@supremacy2018<br /><br />@qianjiu000<br /><br />@JerryZhou<br /><br />@mendes668<br /><br />理事会是BNB48Club的最高权力机构，由7名理事组成。<br /><br />拥有俱乐部积分Koge的数量决定了理事会选举中的选举权与被选举权。<br /><br />这是BNB48 Club俱乐部在社区自治方式上做的新尝试。<br /><br />详情参见 BNB48 Club 治理方法 ',
    event_content_en: 'The inaugural BNB48’s council election was conducted. The new chief councillor was Ian (@SirIanM). The new councillors were @gscoin, @hutian280, @supremacy2018, @qianjiu000, @JerryZhou, and @mendes668. There were 7 club councillors on the first ever BNB48 council.',
  },
  {
    event_title: '2019-05-23',
    event_content: '俱乐部文化Tshirt团购',
    event_content_en: 'BNB48 Club T-shirt merchandise became available for purchase.',
  },
  {
    event_title: '2019-06-24',
    event_content: '理事会讨论通过俱乐部章程修正案，关于允许捐赠者撤回捐赠资金以及撤回办法。',
    event_content_en: 'The club council passed the resolution to allow club donors to withdraw their donations and outline how such withdrawals should be conducted.',
  },
  {
    event_title: '2019-07-08',
    event_content: '出于成本及效用综合考量，下线俱乐部维护的币安链节点',
    event_content_en: 'BNB48 Club decommissioned its Binance Chain validation node due to cost and other concerns.',
  },
  {
    event_title: '2019-07-09',
    event_content: '改用币安账户接收捐款',
    event_content_en: 'BNB48 Club started using its Binance wallet to receive donations.',
  },
  {
    event_title: '2019-07-23',
    event_content: 'Koge机器人娱乐场引入分红机制',
    event_content_en: 'Koge Telegram bot casino introduced dividends.',
  },
  {
    event_title: '2019-08-01',
    event_content: '第二届理事会上任<br /><br />SirIan<br /><br />千年韭菜<br /><br />Gui<br /><br />Hu<br /><br />千江<br /><br />Jerry<br /><br />Yoyo',
    event_content_en: 'BNB48’s council election was conducted. The new chief councillor was Ian. The new councillors were Gui, 千年韭菜, Yoyo, Hu, Jerry, and 千江.',
  },
  {
    event_title: '2019-11-01',
    event_content: '第三届理事会上任<br /><br />SirIan<br /><br />Orca<br /><br />Gui<br /><br />千年韭菜<br /><br />Yoyo<br /><br />Hu<br /><br />千江',
    event_content_en: 'BNB48’s council election was conducted. The new chief councillor was Ian. The new councillors were Orca, Gui, 千年韭菜, Yoyo, Hu, and 千江.',
  },
  {
    event_title: '2019-11-06',
    event_content: '理事会表决通过了关于增设理事席位及修改理事被选举权获得方式的章程条款',
    event_content_en: 'The club council passed the resolution to increase the number of councillors and amend nomination rules.',
  },
  {
    event_title: '2019-11-07',
    event_content: '俱乐部采购Gsuite协作平台，并向捐赠满足10BNB者提供账号。',
    event_content_en: 'BNB48 adopted GSuite as its collaboration platform, and provides accounts for donors who donated 10BNB.',
  },
  {
    event_title: '2019-12-09',
    event_content: '俱乐部与厘米云达成合作，使用俱乐部邮箱注册厘米云，可享免费网络服务及付费92折优惠。',
    event_content_en: 'BNB48 reached a partnership with aloy.asia. Club members can sign up on aloy.asia with their club email address, and enjoy free services and receive an 8% discount for their paid services.',
  },
  {
    event_title: '2020-02-03',
    event_content: '俱乐部新一届理事会选举完成，理事长 : Gui<br /><br />理事: Ian, M, Orca, Mars, Yoyo, 千江, Jerry, Hu',
    event_content_en: 'BNB48’s council election was conducted. The new chief councillor was Gui. The new councillors were Ian, M, Orca, Mars, Yoyo, 千江, Jerry, and Hu.',
  },
  {
    event_title: '2020-02-13',
    event_content: 'BNB48和MugglePay达成战略合作。<br /><br />为了更好的普及市场，加快区块链行业和数字货币行业相关项目的落地，在2020年2月12日，BNB48和MugglePay达成战略合作。<br /><br />BNB48 Club®是一个硬核的BNB投资者俱乐部，成立于2018年春天。BNB48 Club®的创始成员是一群在接触BNB的过程中产生共鸣的投资者，是一个地域国际化、领域多元化的国际化社群。<br /><br />MugglePay的使命是让数字货币支付更简单，由加密货币资深创业者创立。专注于探索数字货币支付和区块链的完美融合。<br /><br />此次合作，对双方未来的业务发展，推动币安生态以及数字货币支付，具有重要意义。<br /><br />https://medium.com/@mugglepay/mugglepay-bnb48-club-partnership-daacdc78dff8',
    event_content_en: 'BNB48 reached a strategic partnership with MugglePay. The partnership will focus on market research and the acceleration of blockchain and cryptocurrency adoption. MugglePay’s mission is to make cryptocurrency payment easier, and it is dedicated to the seamless integrating of blockchain and payment. MugglePay was founded by serial blockchain entrepreneurs. This partnership will be crucial to the success of both parties, and is a catalyst for the further adoption of the Binance ecosystem and cryptocurrency payment industry.<br /><br />https://medium.com/@mugglepay/mugglepay-bnb48-club-partnership-daacdc78dff8',
  },
  {
    event_title: '2020-02-25',
    event_content: 'BNB48 回购乐透上线。<br /><br />香港时间每天8点发行，奖金固定为1 BNB。<br /><br />回购乐透收入的Koge存入特别账户，用于公开销毁。',
    event_content_en: 'BNB48 buyback lottery went live. This daily lottery is scheduled for every day at 8am Hong Kong Time (HKT), and the prize is 1BNB.<br /><br />The Koge revenue from this lottery will be deposited into a separate wallet and burnt publicly.',
  },
  {
    event_title: '2020-05-02',
    event_content: '俱乐部新一届理事会选举完成，理事长 : Ian<br /><br />理事: Mars, Jerry, Gui, Hello World, Dominator008, Yoyo, Wayne, Orca',
    event_content_en: 'BNB48’s council election was conducted. The new chief councillor was Ian. The new councillors were Mars, Jerry, Gui, Hello World, Dominator008, Yoyo, Wayne, and Orca.',
  },
  {
    event_title: '2020-06-02',
    event_content: 'BNB48Club 成为Kava验证节点运营者。现在可以从各主流钱包stake到BNB48Club，如果你正在使用的钱包无法看到BNB48Club验证节点，请联系 business#bnb48.club 并告知钱包名称。',
    event_content_en: 'BNB48Club became a Kava validation node operator。Users can stake Kava onto the BNB48 Club node via most wallets. If you cannot see the BNB48Club node using your wallet, please  contact business at bnb48 dot club and describe in detail the problem you encountered.',
  },
  {
    event_title: '2020-06-24',
    event_content: 'BNB48发起的关于币安链支付URI的提案已被采纳为BEP-64 https://github.com/binance-chain/BEPs/pull/64',
    event_content_en: 'BNB48’s proposal regarding Binance Chain payment URI was passed and the standard chosen was BEP-64. PR link: https://github.com/binance-chain/BEPs/pull/64',
  },
  {
    event_title: '2020-07-18',
    event_content: 'BNB48验证节点已经累计收到超过100万Kava委托',
    event_content_en: 'BNB48’s validator node had over 1 million Kava tokens staked for the first time.',
  },
  {
    event_title: '2020-08-02',
    event_content: '俱乐部新一届理事会选举完成，理事长 : Ian<br /><br />理事: Mars, Jerry, Gui, Hello World, Dominator008, Yoyo, Wayne, Orca',
    event_content_en: 'BNB48’s council election was conducted. The new chief councillor was Ian. The new councillors were Mars, Jerry, Gui, Hello World, Dominator008, Yoyo, Wayne, and Orca.',
  },
  {
    event_title: '2020-08-07',
    event_content: 'BNB48与Kava Labs 达成战略合作伙伴关系，将以社区技术顾问的角色，为Kava DeFi用户和 Staking用户提供技术及咨询服务。 ',
    event_content_en: 'BNB48 announced a strategic partnership with Kava Labs. BNB48 will assume the role of community technical advisors, providing consulting services for Kava’s DeFi and staking users.',
  },
  {
    event_title: '2020-08-15',
    event_content: '为了满足BEP-8总量不超过100万的要求，Koge进行了按比例折算：<br /><br />1. 具体比例为 250:1 ，即原250Koge转换为1新Koge。<br /><br />2. 转换后的小数部分，从俱乐部公共账户中计提差额，新的总量为666,357。<br /><br />3. 为避免误操作，机器人的转账等功能暂时关闭。<br /><br />4. 请核查新的余额，如果有疑问，请联系任一理事。',
    event_content_en: 'BNB48 announced redenomination of Koge in order to satisfy the total supply threshold amount (1 million) mandated by the BEP-8 standard. The redenomination is as follows:<br /><br />1. The ratio between old Koge and new Koge is 250:1, i.e. 1 new Koge = 250 old Koge<br /><br />2. The decimal part of new Koge balances for all holders has been paid from the club’s wallets. The new Koge total supply is 666,357<br /><br />3. Transactions via bots have been temporarily suspended to protect users during this transitional period<br /><br />4. Please check your new balances and reach out club councillors if you have any questions',
  },
  {
    event_title: '2020-08-16',
    event_content: '新理事 千年韭菜, BNB48 HU 提名并通过',
    event_content_en: 'New club councillor nominees 千年韭菜, BNB48 HU were elected',
  },
  {
    event_title: '2020-09-01',
    event_content: '新理事 大麦 提名并通过',
    event_content_en: 'New club councillor nominee 大麦 was elected',
  },
  {
    event_title: '2021-01-02',
    event_content: 'Koge 链下DAO治理上线',
    event_content_en: 'Koge off-chain DAO governing system goes online',
  },
  {
    event_title: '2021-11-08',
    event_content: 'CoinSwap 支持 KOGE/BNB 流动性挖矿',
    event_content_en: 'CoinSwap enables KOGE/BNB lp farming',
  },
]

export default function TutorialSection() {
  const language = localStorage.getItem('language')
  return (
    <div className='tutorial-section'>
      <div className='container'>
        <div className='section-content'>
          <div className='tutorial-image-part'>
            {
              TUTORIAL_ITEMS
                .sort((a, b) => moment(b.event_title, 'YYYY-MM-DD').unix() - moment(a.event_title, 'YYYY-MM-DD').unix())
                .map(item => (
                  <CryptocurrencyTimelineCard
                    key={`tutorial-card-${item.event_title}-${item.event_content}`}
                    item={{
                      ...item,
                      event_content: language === 'en' ? item.event_content_en : item.event_content,
                    }}
                  />
                ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
