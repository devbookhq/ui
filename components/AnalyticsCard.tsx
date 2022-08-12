import Title from 'components/typography/Title'
import TitleLink from 'components/TitleLink'
import SpinnerIcon from 'components/icons/Spinner'

export interface Item {
  id: string
  title: string
  count: number
}

export interface Props {
  title: string
  items: Item[] | undefined
}

function AnalyticsCard({
  title,
  items,
}: Props) {
  return (
    <div className="
      max-w-[600px]
      w-full
      flex
      flex-col
      items-start
      space-y-1.5
    ">
      <Title
        title={title}
        size={Title.size.T3}
      />
      <div className="
        p-4
        h-[200px]
        w-full
        border
        border-black-700
        bg-purple-900
        rounded-lg
        flex
        flex-col
        items-start
        space-y-2
      ">
        <div className="
          w-full
          flex
          items-center
          justify-between
        ">
          <span className="text-xs text-gray-600">NAME</span>
          <span className="text-xs text-gray-600">COUNT</span>
        </div>
        {!items && (
          <div className="
            h-full
            w-full
            flex
            items-center
            justify-center
          ">
            <SpinnerIcon/>
          </div>
        )}
        {items && items.length > 0 && items.map(i => (
          <div
            key={i.id}
            className="
              w-full
              flex
              items-center
              justify-between
              border-b
              border-black-700
            "
          >
            <TitleLink
              className="text-green-500"
              size={TitleLink.size.T3}
              title={i.title}
              href={`/${i.id}/edit`}
            />
            <span className="text-sm font-mono">
              {i.count}
            </span>
          </div>
        ))}

        {items && items.length === 0 && (
           <div className="
            h-full
            w-full
            flex
            items-center
            justify-center
            text-sm
            font-bold
            text-gray-600
          ">
            No data yet
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsCard
