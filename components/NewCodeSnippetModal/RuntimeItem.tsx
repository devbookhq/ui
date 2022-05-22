import cn from 'classnames'

import type { Runtime } from 'types'
import Title from 'components/typography/Title'

interface Props {
  runtime: Runtime
  isSelected: boolean
  onClick: (r: Runtime) => void
}

function RuntimeItem({
  runtime,
  isSelected,
  onClick,
}: Props) {
  return (
    <div
      className={cn(
        'md:max-w-[100px]',
        'w-full',
        'p-[2px]',
        'bg-transparent',
        'cursor-pointer',
        'rounded-lg',
        'hover:bg-green-gradient',
        { 'bg-green-gradient': isSelected },
      )}
      onClick={() => onClick(runtime)}
    >
      <div className="
        py-1.5
        px-2
        border
        border-black-700
        rounded-md
        bg-black-900
      ">
        <Title
          size={Title.size.T3}
          title={runtime.name}
        />
      </div>
    </div>
  )
}

export default RuntimeItem
