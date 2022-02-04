import { UrlObject } from 'url'
import cn from 'classnames'

import Text from '../Text'

export interface Props {
  label: string
  isSelected: boolean
  handleClick: () => void
}

function ControlTab({
  label,
  handleClick,
  isSelected,
}: Props) {
  return (
    <div
      onClick={handleClick}
      className={cn(
        { 'border-t-green-400': isSelected, 'border-t-transparent': !isSelected },
        'border-t-2 whitespace-nowrap items-center mx-1 p-1 group cursor-pointer',
      )}>
      <Text
        hoverable
        size={Text.size.Regular}
        hierarchy={isSelected ? Text.hierarchy.Primary : Text.hierarchy.Secondary}
        text={label}
      />
    </div>
  )
}

export default ControlTab
