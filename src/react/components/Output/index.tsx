import { useMemo } from 'react'
import cn from 'classnames'

import Text from '../Text'

export type Output = 'error' | 'output'

export interface Props {
  stdout?: string[]
  stderr?: string[]
  height?: string
  lightTheme?: boolean
}

function Output({
  stdout = [],
  stderr = [],
  lightTheme,
  height = '150px',
}: Props) {

  const logs = useMemo(() => {
    return [
      ...stderr.map(s => ({ message: s, type: 'error' as Output })),
      ...stdout.map(s => ({ message: s, type: 'output' as Output })),
    ]
  }, [stderr, stdout])

  return (
    <div className={cn(
      'flex flex-1 min-w-0',
      { 'dark': !lightTheme },
    )}>
      <div
        style={{
          ...height && { height },
        }}
        className={cn(`
        flex-1
        flex
        overflow-x-hidden
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
        <div className="overflow-auto leading-tight px-4 pt-2 whitespace-pre">
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

export default Output