import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react'

import Button from 'components/Button'
import Text from 'components/typography/Text'

export interface Props {
  canGoBack: boolean
  onBackClick?: () => void
  canGoNext: boolean
  onNextClick?: () => void
  backTitle: string
  nextTitle: string
}

function BottomNavigation({
  canGoBack,
  onBackClick,
  canGoNext,
  onNextClick,
  backTitle,
  nextTitle,
}: Props) {
  return (
    <div className="
      pl-3
      py-2
      absolute
      bottom-0
      inset-x-0
      right-[51px]
      border-t
      border-gray-800
      backdrop-blur
      bg-gray-800/20
      z-50
    ">
      <div className="
        flex
        items-center
        justify-between
        mx-auto
        w-full
        max-w-[65ch]
      ">
        {canGoBack ? (
          <div className="
            relative
            group
          ">
            <div className="
              absolute
              bottom-full
              left-1/2
              -translate-x-1/2
              mb-2
              py-1
              px-2

              transition-all
              opacity-0
              group-hover:opacity-100

              rounded-lg
              border
              border-gray-500/20
              bg-gray-800
              whitespace-nowrap
            ">
              <Text
                className="text-gray-200"
                text={backTitle}
              // typeface={Text.typeface.InterMedium}
              />
            </div>
            <Button
              icon={<ChevronLeftIcon size={18} />}
              iconPosition={Button.iconPosition.Left}
              text="Back"
              onClick={onBackClick}
            />
          </div>
        ) : (
          <div />
        )}

        {canGoNext &&
          <div className="
            relative
            group
          ">
            <div className="
              absolute
              bottom-full
              left-1/2
              -translate-x-1/2
              mb-2
              py-1
              px-2
              transition-all
              opacity-0
              group-hover:opacity-100
              rounded-lg
              border
              border-gray-500/20
              bg-gray-800
              whitespace-nowrap
            ">
              <Text
                className="text-gray-200"
                text={nextTitle}
              // typeface={Text.typeface.InterMedium}
              />
            </div>
            <Button
              icon={<ChevronRightIcon size={18} />}
              iconPosition={Button.iconPosition.Right}
              text="Next"
              onClick={onNextClick}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default BottomNavigation
