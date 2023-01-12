import clsx from 'clsx'
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Button from 'components/Button'
import Text from 'components/typography/Text'

export function Icon() {
  return <GraduationCap size="20px" />
}

export interface Props {
  steps?: {
    name: string
    text: string
  }[]
  isInEditor?: boolean
}

function Guide({ steps = [], isInEditor }: Props) {
  const [selectedStepIdx, setSelectedStepIdx] = useState(0)

  const selectedStep = steps.length > selectedStepIdx ? steps[selectedStepIdx] : undefined

  const isFirstStep = selectedStepIdx === 0
  const isLastStep = selectedStepIdx >= steps.length - 1

  useEffect(
    function resetSteps() {
      setSelectedStepIdx(idx => {
        if (steps.length > idx) return idx
        return 0
      })
    },
    [steps],
  )

  const previousStep = useCallback(() => {
    setSelectedStepIdx(idx => {
      if (idx > 0) return idx - 1
      return idx
    })
  }, [])

  const nextStep = useCallback(() => {
    if (isLastStep) return
    setSelectedStepIdx(idx => idx + 1)
  }, [isLastStep])

  return (
    <div
      className={clsx(
        `
        m-1
        flex
        flex-1
        flex-col
        space-y-2
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        p-2
        text-slate-500
        shadow-sm
        transition-all`,
      )}
    >
      <div className="flex">
        <div className="flex space-x-2">
          <div className="flex space-x-1">
            <Button
              isDisabled={isFirstStep}
              variant={Button.variant.Uncolored}
              className="group rounded-lg border border-green-500 px-2 py-1.5 text-white transition-all hover:border-green-600"
              icon={
                <ChevronLeft
                  size="16px"
                  className="text-green-500 transition-all group-hover:text-green-600"
                />
              }
              onClick={previousStep}
            />
            <Button
              isDisabled={isLastStep}
              variant={Button.variant.Uncolored}
              className="group rounded-lg border border-green-500 px-2 py-1.5 text-white transition-all hover:border-green-600"
              icon={
                <ChevronRight
                  size="16px"
                  className="text-green-500 transition-all group-hover:text-green-600"
                />
              }
              onClick={nextStep}
            />
          </div>
          <Text text={`Step ${selectedStepIdx + 1} of ${steps.length}`} />
        </div>
      </div>
      {selectedStep && (
        <div className="flex flex-1 flex-col transition-all">
          <Text
            text={selectedStep.name}
            size={Text.size.S2}
          />
          <Text
            text={selectedStep.text}
            size={Text.size.S3}
          />
        </div>
      )}
    </div>
  )
}

export default Guide
