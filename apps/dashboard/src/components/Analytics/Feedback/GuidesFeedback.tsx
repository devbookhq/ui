import {
  ColumnOrderState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { GuideFeedback } from 'utils/analytics'

const columnHelper = createColumnHelper<GuideFeedback>()

const defaultColumns = [
  columnHelper.accessor('title', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('upvotes', {
    header: () => 'Upvotes',
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('downvotes', {
    header: () => 'Downvotes',
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('userMessages', {
    header: () => 'User Messages',
    cell: info => info.renderValue()?.length,
  }),
]

export interface Props {
  guidesFeedback: GuideFeedback[]
}

function GuidesFeedback({ guidesFeedback }: Props) {
  // const [columns] = useState(() => [...defaultColumns])

  // const [columnVisibility, setColumnVisibility] = useState({})
  // const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])

  console.log({ guidesFeedback })
  const table = useReactTable({
    data: guidesFeedback,
    state: {
      columnVisibility,
      columnOrder,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="
      flex
      flex-col
      scroller
      flex-1
      overflow-auto
      space-y-4
      max-w-[800px]
      min-w-[300px]
      pb-20
      pt-4
      px-4
    ">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}

export default GuidesFeedback
