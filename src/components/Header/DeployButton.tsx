import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useRouter } from 'next/router'
import { useState } from 'react'

import SpinnerIcon from 'components/icons/Spinner'

import { getApp, upsertDeployedApp } from 'queries'
import { App } from 'queries/types'

import { showErrorNotif } from 'utils/notification'

import Button from '../Button'

export interface Props {
  className?: string
  app?: App
}

function DeployButton({ className, app }: Props) {
  const router = useRouter()
  const isEdit = router.pathname === '/[slug]/edit'

  const [isDeploying, setIsDeploying] = useState(false)

  async function deployApp() {
    if (!app) return

    setIsDeploying(true)
    try {
      // TODO: Use the local app state
      const latestSavedApp = await getApp(supabaseClient, app.id)
      await upsertDeployedApp(supabaseClient, {
        app_id: app.id,
        state: latestSavedApp.state,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(msg)
      showErrorNotif(`Error deploying app: ${msg}`)
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <>
      {isEdit && app && (
        <Button
          className={className}
          icon={isDeploying ? <SpinnerIcon /> : null}
          text={isDeploying ? 'Deploying...' : 'Deploy'}
          variant={Button.variant.Full}
          onClick={deployApp}
        />
      )}
    </>
  )
}

export default DeployButton
