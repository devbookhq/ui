import { useUser } from '@supabase/supabase-auth-helpers/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import AuthForm from 'components/AuthForm'
import TitleLink from 'components/TitleLink'
import SpinnerIcon from 'components/icons/Spinner'

function SignIn() {
  const router = useRouter()
  const { user } = useUser()
  const isCreatingNewAccount = router.query.signup === 'true'

  useEffect(
    function redirect() {
      if (user) {
        router.replace('/')
      }
    },
    [user, router],
  )

  return (
    <div className="flex flex-1 bg-gray-100">
      {user && (
        <div
          className="
          flex
          flex-1
          items-center
          justify-center
        "
        >
          <SpinnerIcon />
        </div>
      )}
      {!user && (
        <div
          className="
            m-auto
            flex
            flex-col
            items-center
            space-y-4
            rounded
          "
        >
          {!isCreatingNewAccount && (
            <>
              <AuthForm authType={AuthForm.type.SignIn} />
              <TitleLink
                size={TitleLink.size.T3}
                title="Create a new account"
                href={{
                  pathname: router.pathname,
                  query: {
                    signup: 'true',
                  },
                }}
                alternative
                shallow
              />
            </>
          )}
          {isCreatingNewAccount && (
            <>
              <AuthForm authType={AuthForm.type.SignUp} />
              <TitleLink
                size={TitleLink.size.T3}
                title="Sign in with an existing account"
                href={{
                  pathname: router.pathname,
                }}
                alternative
                shallow
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SignIn
