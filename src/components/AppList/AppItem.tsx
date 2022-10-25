import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { Layout } from 'lucide-react'
import Link from 'next/link'
import { MouseEvent, useEffect, useMemo, useState } from 'react'

import SpinnerIcon from 'components/icons/Spinner'
import Text from 'components/typography/Text'

import { deleteApp } from 'queries'
import { App } from 'queries/types'

import { getSlug } from 'utils/app'
import { showErrorNotif } from 'utils/notification'

export interface Props {
  app: Pick<App, 'id' | 'title' | 'created_at'>
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

  async function handleDeleteApp(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) {
    e.stopPropagation()
    e.preventDefault()

    if (confirmDelete && !isDeleting) {
      setIsDeleting(true)
      try {
        await deleteApp(supabaseClient, app.id)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(msg)
        showErrorNotif(`Error deleting app: ${msg}`)
      } finally {
        setIsDeleting(false)
      }
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <Link
      className="group flex items-center justify-between space-x-4 rounded px-4 py-1"
      href={{
        pathname: '/[slug]/edit',
        query: {
          slug: getSlug(app.id, app.title),
        },
      }}
    >
      <div className="flex items-center space-x-4 truncate">
        <div className="m-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-300 transition-all group-hover:border-transparent group-hover:bg-amber-50 group-hover:text-amber-800">
          <Layout size="22px" />
        </div>
        <div className="flex flex-col">
          <Text
            className="text-slate-600 transition-all group-hover:text-amber-800"
            size={Text.size.S2}
            text={app.title}
          />
          <div className="flex space-x-1 text-slate-300 transition-all group-hover:text-slate-400">
            <Text
              size={Text.size.S3}
              text="App"
            />
            <Text
              size={Text.size.S3}
              text="-"
            />
            <Text
              size={Text.size.S3}
              text={created}
            />
          </div>
        </div>
      </div>
      <button
        className="flex items-center justify-center"
        onClick={handleDeleteApp}
      >
        {isDeleting && (
          <Text
            className="whitespace-nowrap text-amber-800"
            icon={<SpinnerIcon className="text-amber-800" />}
            size={Text.size.S3}
            text="Deleting..."
          />
        )}
        {!isDeleting && (
          <Text
            className="whitespace-nowrap text-slate-300 hover:text-amber-800"
            size={Text.size.S3}
            text={confirmDelete ? 'Confirm delete' : 'Delete'}
          />
        )}
      </button>
    </Link>
  )
}

export default AppItem
