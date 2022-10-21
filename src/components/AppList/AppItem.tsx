import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import clsx from 'clsx'
import { Layout } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import Button from 'components/Button'
import Title from 'components/typography/Title'

import { deleteApp } from 'queries'
import { App } from 'queries/types'

import { getSlug } from 'utils/app'

export interface Props {
  app: Required<App>
}

function useDate(timestamp: number) {
  return useMemo(() => {
    const d = new Date(timestamp)
    return d.toLocaleString()
  }, [timestamp])
}

function AppItem({ app }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(
    function expireConfirm() {
      if (confirmDelete) {
        const cleanup = setTimeout(() => setConfirmDelete(false), 5000)
        return () => {
          clearTimeout(cleanup)
        }
      }
    },
    [confirmDelete],
  )

  const created = useDate(app.created_at)
  return (
    <Link
      className="flex flex-1 items-stretch"
      href={{
        pathname: '/[slug]/edit',
        query: {
          slug: getSlug(app.id, app.title),
        },
      }}
    >
      <a className="group group flex items-center justify-between rounded px-4 py-1 text-gray-600 hover:text-yellow-500">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-50 text-gray-300 group-hover:border-transparent group-hover:bg-yellow-50 group-hover:text-gray-500">
            <Layout />
          </div>
          <div className="flex flex-col">
            <Title
              size={Title.size.T1}
              title={app.title}
            />
            <div className="flex space-x-1">
              <Title
                rank={Title.rank.Secondary}
                size={Title.size.T3}
                title="App"
              />
              <Title
                rank={Title.rank.Secondary}
                size={Title.size.T3}
                title="-"
              />
              <Title
                rank={Title.rank.Secondary}
                size={Title.size.T3}
                title={created}
              />
            </div>
          </div>
        </div>
        <div
          className="hidden items-center group-hover:flex"
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Button
            text={confirmDelete ? 'Confirm delete' : 'Delete'}
            className={clsx(
              'border shadow-none hover:bg-red-50 hover:text-red-500',
              { 'border-red-500 text-red-500 hover:border-red-500': confirmDelete },
              { 'border-none text-red-300': !confirmDelete },
            )}
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()

              if (confirmDelete) {
                deleteApp(supabaseClient, app.id)
              } else {
                setConfirmDelete(true)
              }
            }}
          />
        </div>
      </a>
    </Link>
  )
}

export default AppItem
