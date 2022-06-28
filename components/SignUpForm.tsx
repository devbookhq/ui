import {
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import Title from 'components/typography/Title'
import Input from 'components/Input'
import Button from 'components/Button'

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function signUpWithEmail() {
    setIsLoading(true)
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
    if (error) {
      setErrMessage(error.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="
          py-12
          px-4
          w-[400px]
          flex
          flex-col
          space-y-8
          items-center
          rounded
          bg-black-800
        ">
      <Title
        title="Create a new account"
        size={Title.size.T1}
      />
      <div className="flex flex-col space-y-2">
        <Input
          autoFocus
          autoComplete="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onEnterDown={signUpWithEmail}
        />
        <Input
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onEnterDown={signUpWithEmail}
        />
      </div>
      {/* <div>
        <Button
          text="Sign up"
          onClick={signUpWithEmail}
          variant={Button.variant.Full}
        />
        {isLoading}
        {errMessage}
      </div> */}
    </div>
  )
}

export default SignUpForm
