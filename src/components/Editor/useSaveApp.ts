import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { debounce } from 'lodash'
import { useCallback } from 'react'

import { updateApp } from 'utils/queries/queries'

import { RootState } from 'core/BuilderProvider/models/RootStoreProvider'

const saveToDBDebounce = 1_000 // 1000ms
const saveToDBMaxInterval = 3_000 // 3000ms

const debouncedUpdateApp = debounce(updateApp, saveToDBDebounce, {
  maxWait: saveToDBMaxInterval,
  leading: false,
  trailing: true,
})

function useSaveApp(id: string) {
  const saveAppState = useCallback(
    (state: RootState) => {
      debouncedUpdateApp(supabaseClient, { state, id })
    },
    [id],
  )

  return saveAppState
}

export default useSaveApp
