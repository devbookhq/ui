import Title from 'components/typography/Title'

export interface Props {
  title: string
}

function Card({
  title,
}: Props) {
  return (
    <div className="
      w-full
      flex
      flex-col
      items-start
      space-y-1
    ">
      <Title
        title={title}
        size={Title.size.T3}
      />
      <div className="
        h-[200px]
        w-full
        border
        border-black-700
        bg-[#18161C]
        rounded-lg
      ">
      </div>
    </div>
  )
}

function Analytics() {
  return (
    <div className="
      flex-1
      flex
      flex-col
      items-start
      space-y-6
    ">
      <Title
        title="Analytics"
      />


      <Card
        title="Latest Activity"
      />
      <Card
        title="Most Used"
      />
    </div>
  )
}

export default Analytics
