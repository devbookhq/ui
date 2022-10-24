import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { Layout } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import SpinnerIcon from 'components/icons/Spinner'
import Text from 'components/typography/Text'

import { deleteApp } from 'queries'
import { App } from 'queries/types'

import { getSlug } from 'utils/app'
import { showErrorNotif } from 'utils/notification'

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
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(
    function expireConfirm() {
      if (confirmDelete) {
        const cleanup = setTimeout(() => setConfirmDelete(false), 4000)
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
      href={{
        pathname: '/[slug]/edit',
        query: {
          slug: getSlug(app.id, app.title),
        },
      }}
      passHref
    >
      <a className="group flex items-center justify-between space-x-4 rounded px-4 py-1">
        <div className="flex items-center space-x-4 truncate">
          <div className="m-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-300 transition-all group-hover:border-transparent group-hover:bg-amber-50 group-hover:text-amber-800">
            <Layout size="22px" />
          </div>
          <div className="flex flex-col">
            <Text
              className="text-slate-600 transition-all group-hover:text-amber-800"
              size={Text.size.T1}
              text={app.title}
            />
            <div className="flex space-x-1 text-slate-300 transition-all group-hover:text-slate-400">
              <Text
                size={Text.size.T2}
                text="App"
              />
              <Text
                size={Text.size.T2}
                text="-"
              />
              <Text
                size={Text.size.T2}
                text={created}
              />
            </div>
          </div>
        </div>
        <button
          className="flex items-center justify-center"
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()

            if (confirmDelete && !isDeleting) {
              setIsDeleting(true)
              deleteApp(supabaseClient, app.id).catch((e: Error) => {
                showErrorNotif(`Error deleting app: ${e.message}`)
              })
            } else {
              setConfirmDelete(true)
            }
          }}
        >
          {isDeleting && (
            <Text
              className="whitespace-nowrap text-amber-800"
              icon={<SpinnerIcon className="text-amber-800" />}
              size={Text.size.T2}
              text="Deleting..."
            />
          )}
          {!isDeleting && (
            <Text
              className="whitespace-nowrap text-slate-300 hover:text-amber-800"
              size={Text.size.T2}
              text={confirmDelete ? 'Confirm delete' : 'Delete'}
            />
          )}
        </button>
      </a>
    </Link>
  )
}

export default AppItem
