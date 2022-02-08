import { useDevbook } from '@devbookhq/sdk'
import cn from 'classnames'
import { useMemo } from 'react'
import Text from '../Text'

export type Output = 'error' | 'output'

export interface Props {
  devbook: ReturnType<typeof useDevbook>
}

function Console({
  devbook: {
    stderr,
    stdout,
  },
}: Props) {

  const logs = useMemo(() => {
    return [
      ...stdout.map(s => ({ message: s, type: 'output' as Output })),
      ...stderr.map(s => ({ message: s, type: 'error' as Output })),
    ]
  }, [stderr, stdout])

  return (
    <div className={cn(
      'flex flex-1 min-w-0',
    )}>
      <div
        className={cn(`
        flex-1
        flex
        flex-col
        rounded

        dark:bg-black-900
        bg-gray-100`,
        )}
      >
        <div className="px-2">
          <Text
            mono
            hierarchy={Text.hierarchy.Secondary}
            size={Text.size.Small}
            text="OUTPUT"
          />
        </div>
        <div className="overflow-y-auto leading-tight px-4 pt-2">
          {logs.map((o, i) =>
            <div key={o.message + i}>
              <Text
                mono
                hierarchy={o.type === 'error' ? Text.hierarchy.Error : Text.hierarchy.Primary}
                size={Text.size.Small}
                text={o.message}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Console
