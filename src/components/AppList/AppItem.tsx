import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

import Text from 'components/typography/Text'
import Title from 'components/typography/Title'

import { getSlug } from 'utils/app'
import { showErrorNotif } from 'utils/notification'
import { deleteApp } from 'utils/queries/queries'
import { App } from 'utils/queries/types'

import useOnClickOutside from 'hooks/useOnClickOutside'

export interface Props {
  app: App
}

function AppItem({ app }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(cardRef, () => {
    setShowDropdown(false)
  })

  function handleOnMoreClick(e: any) {
    e.stopPropagation()
    e.preventDefault()
    setShowDropdown(c => !c)
  }

  async function handleDelete(e: any) {
    e.stopPropagation()
    e.preventDefault()
    if (
      confirm(`Are you sure you want to delete '${app.title}'? This cannot be reversed.`)
    ) {
      try {
        await deleteApp(supabaseClient, app.id)
      } catch (err: any) {
        showErrorNotif(`Error: ${err.message}`)
        setShowDropdown(false)
      }
    }
  }

  return (
    <div
      ref={cardRef}
      className="
        relative
        w-full
        md:max-w-[320px]
    "
    >
      <Link
        href={{
          pathname: '/[slug]/edit',
          query: {
            slug: getSlug(app.id, app.title),
          },
        }}
        passHref
      >
        <a className="hover:no-underline">
          <div
            ref={cardRef}
            className="
              cursor-pointer
              rounded
              p-[2px]
              hover:shadow-lg
              hover:shadow-lime-200/50"
          >
            <div
              className="
                flex
                flex-col
                rounded
                bg-white
        "
            >
              <div
                className="
                flex
                flex-1
                items-center
                justify-between
                truncate
                py-1
                px-2
          "
              >
                <Title
                  className="truncate"
                  size={Title.size.T2}
                  title={app.title}
                />
                <div
                  className="
                rounded
                p-2
                hover:bg-white/5
              "
                  onClick={handleOnMoreClick}
                >
                  <MoreHorizontal />
                </div>
              </div>
            </div>
          </div>

          {showDropdown && (
            <div
              className="
              absolute
            z-10
            rounded
            p-1
            px-2
            hover:bg-[#504E55]
          "
              style={{
                left: 'calc(100% - 53px)',
                top: 'calc(100% - 6px)',
              }}
            >
              <Text
                text="Delete"
                className="
              cursor-pointer
            "
                onClick={handleDelete}
              />
            </div>
          )}
        </a>
      </Link>
    </div>
  )
}

export default AppItem
