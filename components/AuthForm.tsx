import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import cn from 'clsx'
import { useLayoutEffect, useRef, useState } from 'react'

import Button from 'components/Button'
import Text from 'components/typography/Text'
import Title from 'components/typography/Title'

export enum AuthFormType {
  SignIn,
  SignUp,
}

export interface Props {
  authType: AuthFormType
}

function AuthForm({ authType }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('')

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(
    function autofocusEmailInput() {
      if (isLoading) return

      if (!emailRef.current?.value) {
        emailRef.current?.focus()
      } else if (!passwordRef.current?.value) {
        passwordRef.current?.focus()
      } else {
        emailRef.current?.focus()
      }
    },
    [isLoading],
  )

  async function authWithEmail() {
    setIsLoading(true)

    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (!email) {
      setErrMessage('Email must not be empty')
      emailRef.current?.focus()
      setIsLoading(false)
      return
    }

    if (!password) {
      passwordRef.current?.focus()
      setErrMessage('Password must not be empty')
      setIsLoading(false)
      return
    }

    const { error } =
      authType === AuthFormType.SignUp
        ? await supabaseClient.auth.signUp({
            email,
            password,
          })
        : await supabaseClient.auth.signIn({
            email,
            password,
          })

    if (error) {
      emailRef.current?.focus()
      setErrMessage(error.message)
      console.error(error.message)
    } else {
      setErrMessage('')
    }

    setIsLoading(false)
  }

  const title = authType === AuthFormType.SignUp ? 'Create a new account' : 'Sign in'

  const buttonLabel = authType === AuthFormType.SignUp ? 'Sign up' : 'Sign in'

  const buttonLoadingLabel =
    authType === AuthFormType.SignUp ? 'Signing up...' : 'Signing in...'

  const passwordAutocomplete =
    authType === AuthFormType.SignUp ? 'new-password' : 'current-password'

  return (
    <form
      autoComplete="on"
      onSubmit={e => {
        e.preventDefault()
        authWithEmail()
      }}
    >
      <div
        className="
        flex
        w-[450px]
        flex-1
        flex-col
        items-center
        space-y-8
        self-start
        rounded
        bg-black-800
        py-12
        px-4
      "
      >
        <Title title={title} />
        <div className="flex w-full flex-col space-y-8 px-16">
          <div className="flex min-w-0 flex-col space-y-2">
            <input
              autoCapitalize="off"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              name="email"
              placeholder="Email"
              ref={emailRef}
              type="email"
              className={cn(
                'w-full',
                'px-2.5',
                'py-2',
                'rounded-lg',
                'border',
                'border-black-700',
                {
                  'bg-black-900': !isLoading,
                },
                {
                  'bg-black-800': isLoading,
                },
                'outline-none',
                'focus:border-green-200',
                'text-sm',
                'placeholder:text-gray-600',
              )}
              required
            />
            <input
              autoComplete={passwordAutocomplete}
              autoCorrect="off"
              disabled={isLoading}
              name="password"
              placeholder="Password"
              ref={passwordRef}
              type="password"
              className={cn(
                'px-2.5',
                'py-2',
                'rounded-lg',
                'border',
                'flex',
                'min-w-0',
                'flex-1',
                'border-black-700',
                {
                  'bg-black-900': !isLoading,
                },
                {
                  'bg-black-800': isLoading,
                },
                'outline-none',
                'focus:border-green-200',
                'text-sm',
                'font-medium',
                'placeholder:text-gray-600',
              )}
              required
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Button
              className="self-center whitespace-nowrap"
              isDisabled={isLoading}
              text={isLoading ? buttonLoadingLabel : buttonLabel}
              type="submit"
              variant={Button.variant.Full}
            />
            {!isLoading && !!errMessage && (
              <Text
                className="self-center text-red-400"
                size={Text.size.S2}
                text={errMessage}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

AuthForm.type = AuthFormType

export default AuthForm
