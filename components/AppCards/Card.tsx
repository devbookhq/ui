import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import Link from 'next/link'
import { useRef, useState } from 'react'
import type { App } from 'types'

import Text from 'components/typography/Text'
import Title from 'components/typography/Title'

import { showErrorNotif } from 'utils/notification'
import { deleteApp } from 'utils/queries'
import useOnClickOutside from 'utils/useOnClickOutside'

export interface Props {
  app: App
}

function Card({ app }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(
    cardRef,
    () => {
      setShowDropdown(false)
    },
    [],
  )

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
            slug: `${app.title}-${app.id}`,
          },
        }}
        passHref
      >
        <a className="hover:no-underline">
          <div
            ref={cardRef}
            className="
              hover:bg-green-gradient

              cursor-pointer
              rounded-lg

              bg-black-700
              p-[2px]
              hover:shadow-lg

              hover:shadow-green-500/50"
          >
            <div
              className="
                flex
                flex-col
                rounded-lg
                bg-black-900
        "
            >
              <div
                className="
                flex
                flex-1
                items-center
                justify-between
                truncate
                rounded-b-lg
                bg-black-700
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
                hover:bg-white-900/5
              "
                  onClick={handleOnMoreClick}
                >
                  <DotsVerticalIcon />
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
            bg-black-700
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

export default Card
