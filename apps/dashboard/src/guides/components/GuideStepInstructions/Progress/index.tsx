import React from 'react'

import { Step } from '../../../guidesContent/Guide'
import Text from 'components/typography/Text'

import StepActive from './StepActive'
import StepDone from './StepDone'
import StepTodo from './StepTodo'

export interface Props {
  steps: Step[]
  stepIdx: number
  onStepClick: (stepIdx: number) => void
}

function getStep(currentIdx: number, elIdx: number, title: string) {
  if (currentIdx > elIdx) {
    if (elIdx === 0) return <StepDone title={title} />
    return (
      <>
        <div className="
          relative
          left-[calc(50%-1px)]
          self-stretch
          h-[32px]
          w-[2px]
          bg-white
        "/>
        <StepDone title={title} />
      </>
    )
  } else if (currentIdx < elIdx) {
    return (
      <>
        <div className="
          relative
          left-[calc(50%-1px)]
          self-stretch
          h-[32px]
          w-[2px]
          bg-green-400/50
        "/>
        <StepTodo title={title} />
      </>
    )
  } else {
    if (currentIdx === 0) return <StepActive title={title} />
    return (
      <>
        <div className="
          relative
          left-[calc(50%-1px)]
          self-stretch
          h-[32px]
          w-[2px]
          bg-white
        "/>
        <StepActive title={title} />
      </>
    )
  }
}

function Progress({
  steps,
  stepIdx,
  onStepClick,
}: Props) {
  return (
    <div className="
      w-[50px]
      max-w-[50px]
      min-w-[50px]
      flex
      flex-col
      space-y-2
      items-center
      pt-1
      px-3
    ">
      <Text
        className="text-green-400"
        text={`${stepIdx + 1}/${steps.length}`}
        // typeface={Text.typeface.BarlowSemibold}
      />
      <div className="
        flex
        flex-col
      ">
        {steps.map((step, idx) => (
          <div
            className="cursor-pointer"
            key={idx}
            onClick={() => onStepClick(idx)}
          >
            {getStep(stepIdx, idx, step.title)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Progress
