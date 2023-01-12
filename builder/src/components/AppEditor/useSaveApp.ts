import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'

import { updateApp } from 'queries'

import { RootState } from 'core/EditorProvider/models/RootStoreProvider'

const saveToDBDebounce = 1_000 // 1000ms
const saveToDBMaxInterval = 3_000 // 3000ms

const debouncedUpdateApp = debounce(updateApp, saveToDBDebounce, {
  maxWait: saveToDBMaxInterval,
  leading: false,
  trailing: true,
})

function useSaveAppState(appID: string) {
  const saveAppState = useCallback(
    (state: RootState) => debouncedUpdateApp(supabaseClient, { state, id: appID }),
    [appID],
  )

  return saveAppState
}

export default useSaveAppState
