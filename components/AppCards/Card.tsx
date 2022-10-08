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
    setShowDropdown(c => !c)
  }

  async function handleDelete(_: any) {
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
              p-[2px]

              bg-black-700
              cursor-pointer

              hover:bg-green-gradient
              hover:shadow-lg
              hover:shadow-green-500/50

              rounded-lg"
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
                flex-1
                flex
                items-center
                justify-between
                bg-black-700
                py-1
                px-2
                rounded-b-lg
                truncate
          "
              >
                <Title
                  size={Title.size.T2}
                  title={app.title}
                  className="truncate"
                />
                <div
                  className="
                p-2
                rounded
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
            p-1
            px-2
            z-10
            rounded
            bg-black-700
            hover:bg-[#504E55]
          "
              style={{
                left: 'calc(100% - 53px)',
                top: 'calc(100% - 6px)',
              }}
            >
              <Text
                className="
              cursor-pointer
            "
                text="Delete"
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
