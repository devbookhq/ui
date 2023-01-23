import clsx from 'clsx'
import Text from 'components/typography/Text'

export interface Props {
  text?: string
}

function FeedDivider({ text }: Props) {
  return (
    <div className="flex items-center mx-2 justify-center">
      <div className="border-b flex-1" />
      <Text text={text || ''} className={clsx('text-slate-500', { 'px-2': !!text, })} />
      <div className="border-b flex-1" />
    </div>
  )
}

export default FeedDivider
