import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { Check, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'

import SpinnerIcon from 'components/icons/Spinner'

import { updateApp } from 'queries'
import { App } from 'queries/types'

import { getSlug } from 'utils/app'
import { showErrorNotif } from 'utils/notification'

import Button from '../Button'
import { useEditorControls } from './EditorControlsProvider'

export interface Props {
  app?: App
}

function DeployButton({ app }: Props) {
  const router = useRouter()

  const [isDeploying, setIsDeploying] = useState(false)
  const [wasSuccessfullyDeployed, setWasSuccessfullyDeployed] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)

  const isEdit = router.pathname === '/[slug]/edit'

  const { getEditorState } = useEditorControls()

  useEffect(
    function checkDeployment() {
      setIsDeployed(false)
      setWasSuccessfullyDeployed(false)

      if (!app?.id || !app?.deployed_state) {
        setIsDeployed(false)
      } else {
        setIsDeployed(true)
      }
    },
    [app],
  )

  useEffect(
    function showSuccessfulDeployment() {
      if (isDeploying) return
      if (!wasSuccessfullyDeployed) return

      const cleanup = setTimeout(() => setWasSuccessfullyDeployed(false), 2000)
      return () => {
        clearTimeout(cleanup)
      }
    },
    [isDeploying, wasSuccessfullyDeployed],
  )

  async function deployApp() {
    if (!app) return

    setIsDeploying(true)
    setWasSuccessfullyDeployed(false)
    try {
      const localAppState = getEditorState()
      const updatedApp = await updateApp(supabaseClient, {
        id: app.id,
        deployed_state: localAppState,
      })

      setIsDeployed(!!updatedApp.deployed_state)
      setWasSuccessfullyDeployed(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(msg)
      showErrorNotif(`Error deploying app: ${msg}`)
    } finally {
      setIsDeploying(false)
    }
  }

  let icon: ReactNode = null
  let text = 'Deploy'

  if (isDeploying) {
    icon = <SpinnerIcon />
    text = 'Deploying...'
  } else if (wasSuccessfullyDeployed) {
    icon = (
      <Check
        className="text-amber-800"
        size="16px"
      />
    )
    text = 'Deployed'
  }

  return (
    <>
      {isEdit && app && (
        <>
          <Button
            icon={icon}
            text={text}
            variant={Button.variant.Full}
            onClick={deployApp}
          />
          {isDeployed && (
            <Link
              href={{
                pathname: '/[slug]',
                query: {
                  slug: getSlug(app.id, app.title),
                },
              }}
              passHref
            >
              <a
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button
                  text="Live"
                  variant={Button.variant.Full}
                  icon={
                    <ExternalLink
                      className="text-amber-800"
                      size="16px"
                    />
                  }
                />
              </a>
            </Link>
          )}
        </>
      )}
    </>
  )
}

export default DeployButton
