import { MDXRemote } from 'next-mdx-remote'

import {
  GuideStep,
  Step,
} from '../../guidesContent/Guide'
import Text from 'components/typography/Text'
import mdxComponents from '../mdxComponents'

// import { analytics } from 'utils/analytics'
import {
  useCallback,
  useEffect,
  useRef,
} from 'react'
import BottomNavigation from './BottomNavigation'
import Progress from './Progress'

export interface Props {
  steps: Step[]
  stepIdx: number
  canGoBack: boolean
  onBackClick?: () => void
  canGoNext: boolean
  onNextClick?: () => void
  onGoToStepClick: (stepIdx: number) => void
}

function GuideStepInstructions({
  steps,
  stepIdx,
  canGoBack,
  onBackClick,
  canGoNext,
  onNextClick,
  onGoToStepClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const activeStep = steps[stepIdx]

  if (activeStep.type !== 'Guide') throw new Error('Trying to render step that\'s not of type \'Guide\'')

  useEffect(function resetScroll() {
    if (!ref.current) return
    ref.current.scroll({ top: 0 })
  }, [stepIdx])

  const handleNextClick = useCallback(() => {
    onNextClick?.()
    // analytics.track('guide next step clicked', { currentStep: stepIdx })

    // if (steps.length - 1 === stepIdx + 1) {
    //   analytics.track('guide finished', { currentStep: stepIdx })
    // }

  }, [
    onNextClick,
    stepIdx,
    steps.length,
  ])

  const handleBackClick = useCallback(() => {
    onBackClick?.()
    // analytics.track('guide back step clicked', { currentStep: stepIdx })
  }, [onBackClick, stepIdx])

  const goToStep = useCallback((targetStepIdx: number) => {
    onGoToStepClick(targetStepIdx)
    // analytics.track('guide go to step in progress bar clicked', {
    //   currentStep: stepIdx,
    //   targetStepIdx,
    // })
  }, [stepIdx, onGoToStepClick])

  return (
    <div className="
      flex-1
      flex
      bg-gray-900
      text-gray-100
      relative
    ">
      <div className="
        pr-1
        flex-1
        flex
        flex-col
        justify-between
        overflow-hidden
        border-r
        border-gray-800
      ">
        <div
          className="
          pt-10
          pl-3
          pb-16
          self-stretch
          flex
          flex-col
          overflow-auto
          instructions-scrollbar
          scrollbar-gutter
        "
          ref={ref}
        >
          <div className="
            self-stretch
            pb-8
            prose
            prose-slate
            mx-auto
          ">
            <Text
              className="text-gray-100"
              size={Text.size.S2}
              text={(activeStep as GuideStep).title}
              // typeface={Text.typeface.InterBold}
            />
            <MDXRemote
              {...(activeStep as GuideStep).content}
              components={mdxComponents}
            />
          </div>
        </div>

        <BottomNavigation
          backTitle={canGoBack ? steps[stepIdx - 1].title : ''}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          nextTitle={canGoNext ? steps[stepIdx + 1].title : ''}
          onBackClick={handleBackClick}
          onNextClick={handleNextClick}
        />

      </div>
      <Progress
        stepIdx={stepIdx}
        steps={steps}
        onStepClick={goToStep}
      />
    </div>
  )
}

export default GuideStepInstructions
