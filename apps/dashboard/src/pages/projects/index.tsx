import { supabaseClient, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { Plus, Folder, Folders } from 'lucide-react'
import { getSnapshot } from 'mobx-state-tree'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import ItemList from 'components/ItemList'
import Button from 'components/Button'
import Feedback from 'components/Feedback'
import NewAppModal from 'components/NewAppModal'
import SpinnerIcon from 'components/icons/Spinner'
import Text from 'components/typography/Text'

import useApps from 'hooks/useApps'

import { createApp, deleteApp } from 'queries'

import { getSlug } from 'utils/app'
import { showErrorNotif } from 'utils/notification'

import { root } from 'core/EditorProvider/models/RootStoreProvider'

const newAppDefaultState = getSnapshot(
  root.create({
    resources: {
      environmentID: 'rrvG0aInT6Db',
    },
  }),
)

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
})

function Projects() {
  const router = useRouter()
  const [isLoadingNewSnippet, setIsLoadingNewSnippet] = useState(false)
  const [isModalOpened, setIsModalOpened] = useState(false)

  const { user } = useUser()
  const { apps, isLoading, error: csError } = useApps(user?.id || '')

  function closeModal() {
    setIsModalOpened(false)
  }

  function openModal() {
    setIsModalOpened(true)
  }

  async function handleCreateApp({ title, id }: { title: string; id: string }) {
    if (!user) throw new Error('User is undefined')
    setIsLoadingNewSnippet(true)

    try {
      await createApp(supabaseClient, {
        title,
        id,
        creator_id: user.id,
        state: newAppDefaultState,
      })
      const slug = getSlug(id, title)
      router.push({
        pathname: '/projects/[slug]',
        query: {
          slug,
        },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      showErrorNotif(`Error creating project: ${msg}`)
      setIsLoadingNewSnippet(false)
      closeModal()
    }
  }

  useEffect(
    function checkAppError() {
      if (!csError) return
      showErrorNotif(`Error retrieving apps: ${csError}`)
    },
    [csError],
  )

  return (
    <>
      <div className="fixed left-4 bottom-4">
        <Feedback />
      </div>
      <NewAppModal
        isLoading={isLoadingNewSnippet}
        isOpen={isModalOpened}
        onClose={closeModal}
        onCreate={handleCreateApp}
      />
      <div
        className="
      flex
      flex-1
      flex-col
      space-x-0
      overflow-hidden
      p-12
      md:flex-row
      md:space-y-0
      md:p-16
    "
      >
        <div className="flex items-start justify-start">
          <div className="items-center flex space-x-2">
            <Folders size="30px" stroke-width="1.5" />
            <Text
              size={Text.size.S1}
              text="Projects"
            />
          </div>
        </div>

        <div
          className="
        flex
        flex-1
        flex-col
        items-stretch
        space-y-4
        overflow-hidden
        "
        >
          <div
            className="
          flex
          flex-col
          items-stretch
          space-y-2
          overflow-hidden
          p-2
        "
          >
            <div className="flex flex-1 justify-end">
              {apps.length > 0 && (
                <Button
                  icon={isLoadingNewSnippet ? <SpinnerIcon /> : <Plus size="16px" />}
                  isDisabled={isLoadingNewSnippet}
                  text="New Project"
                  variant={Button.variant.Full}
                  onClick={openModal}
                />
              )}
            </div>
          </div>

          {isLoading && (
            <div
              className="
            flex
            flex-1
            items-center
            justify-center
          "
            >
              <SpinnerIcon className="text-slate-400" />
            </div>
          )}

          {!isLoading && apps.length > 0 && (
            <div className="flex flex-1 justify-center overflow-hidden">
              <ItemList
                items={apps.map(i => ({
                  ...i,
                  path: '/projects/[slug]',
                  type: 'Project',
                  icon: <Folder size="22px" stroke-width="1.7" />,
                }))}
                deleteItem={(id: string) => deleteApp(supabaseClient, id)}
              />
            </div>
          )}

          {!isLoading && apps.length === 0 && (
            <div
              className="
            flex
            w-[400px]
            flex-col
            items-center
            space-y-8
            self-center
            rounded
            border
            border-slate-200
            bg-transparent
            py-12
            md:w-[800px]
          "
            >
              <Text
                size={Text.size.S2}
                text="Get Started"
              />

              <Button
                icon={isLoadingNewSnippet ? <SpinnerIcon /> : null}
                isDisabled={isLoadingNewSnippet}
                text="New Project"
                variant={Button.variant.Full}
                onClick={openModal}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Projects
