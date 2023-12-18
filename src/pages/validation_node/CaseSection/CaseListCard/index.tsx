import './index.less'

export default function CaseListCard(props: { item: any }) {
  const {
    item,
  } = props
  if (!item) {
    return null
  }
  return (
    <div className="case-list-card">
      <div
        className="case-profile-image"
      >
        <img src={item.image_url} alt={item.title} />
      </div>
      <div className="case-title">
        {item.title}
      </div>
      <div className="case-content">
        <a href={item.content} target="_blank" rel="noopener noreferrer">
          {item.content}
        </a>
      </div>
    </div>
  )
}
