import { SortAsc, SortDesc } from 'lucide-react'
import { ReactNode } from 'react'
import { GuideFeedback } from 'utils/analytics'

export enum SortOrder {
  Ascending,
  Descending,
}

export interface SortingConfig {
  column: Column
  order: SortOrder
}

export function applySorting(guides: GuideFeedback[], config?: SortingConfig) {
  if (!config) return guides

  return guides.slice().sort((g, o) => {
    const a = g[config.column]
    const b = o[config.column]

    if (config.order === SortOrder.Ascending) {
      return a - b
    } else {
      return b - a
    }
  })
}

type Column = keyof Pick<GuideFeedback, 'downvotes' | 'ratingPercentage' | 'totalMessages' | 'upvotes'>

type SetConfig = (c: SortingConfig) => SortingConfig

export interface Props {
  setConfig: (s: SetConfig) => any
  column: Column
  config: SortingConfig
  children: ReactNode
}

export function switchOrder(order: SortOrder) {
  if (order === SortOrder.Ascending) return SortOrder.Descending
  return SortOrder.Ascending
}

function SortControl({ setConfig, column, config, children }: Props) {
  return (
    <div
      onClick={() => {
        setConfig(c => {
          if (c?.column === column) {
            return {
              column,
              order: switchOrder(c.order),
            }
          } else {
            return {
              column,
              order: c?.order || SortOrder.Descending,
            }
          }
        })
      }}
      className="cursor-pointer group flex space-x-1"
    >
      {children}
      {config.column !== column &&
        <SortDesc
          size="18px"
          strokeWidth="1.5"
          className="text-slate-300 group-hover:text-slate-400" />}
      {config.column === column && config.order === SortOrder.Descending &&
        <SortDesc
          size="18px"
          strokeWidth="1.5"
          className="text-slate-400" />}
      {config.column === column && config.order === SortOrder.Ascending &&
        <SortAsc
          size="18px"
          strokeWidth="1.5"
          className="text-slate-400" />}
    </div>
  )
}

export default SortControl
