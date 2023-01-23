import clsx from 'clsx'
import Text from 'components/typography/Text'

export interface Props {
  text?: string
}

function FeedDivider({ text }: Props) {
  return (
    <div className="flex items-center mx-2 justify-center">
      <Text
        text={text || ''}
        size={Text.size.S2}

        className={clsx('text-slate-500', { 'px-2': !!text, })}
      />
    </div>
  )
}

export default FeedDivider
