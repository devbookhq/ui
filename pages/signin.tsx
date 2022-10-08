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

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

  return (
    <>
      {user && (
        <div
          className="
          flex-1
          flex
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
            rounded
            space-y-4
          "
        >
          {!isCreatingNewAccount && (
            <>
              <AuthForm authType={AuthForm.type.SignIn} />
              <TitleLink
                size={TitleLink.size.T2}
                title="Create a new account"
                shallow
                href={{
                  pathname: router.pathname,
                  query: {
                    signup: 'true',
                  },
                }}
              />
            </>
          )}
          {isCreatingNewAccount && (
            <>
              <AuthForm authType={AuthForm.type.SignUp} />
              <TitleLink
                size={TitleLink.size.T2}
                title="Sign in with an existing account"
                shallow
                href={{
                  pathname: router.pathname,
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}

export default SignIn
