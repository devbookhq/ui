import { GuideOverviewColumn } from './FeedbackTable/GuideOverview'

export enum ColumnOrdering {
  Ascending,
  Descending,
}

export interface TableSetup {
  column: GuideOverviewColumn
  order: ColumnOrdering
}

export interface Props {
  setup: TableSetup
  onSetupChange: (setup: TableSetup) => void
}

function FeedbackTableSetup({ }: Props) {

  return (
    <div>

    </div>
  )
}

export default FeedbackTableSetup
