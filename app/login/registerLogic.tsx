'use client'

import React, { useEffect, useState } from 'react'
import { FaEye, FaRegEye } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '../lib/supabase'

const RegisterLogic = ({
  setRegister,
}: {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [username, setUsername] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    // basic validation
    if (!email || !password || !username) {
      setErrorMsg('Please fill in all fields')
      return
    }

    if (password !== confirmPass) {
      setErrorMsg('Passwords do not match')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username, // stored in user metadata
        },
      },
    })

    if (error) {
      setErrorMsg(error.message)
      console.log(error.message)

      return
    }

    // ⚠️ Important: depends on your Supabase settings
    // If email confirmation is ON → user must verify email
    // If OFF → user is logged in immediately

    console.log('User created:', data)

    // optional: switch back to login
    setRegister(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  useEffect(() => {
    if (!errorMsg) return

    const timer = setTimeout(() => {
      setErrorMsg(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [errorMsg])

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col items-center w-full mb-2">
        <input
          type="username"
          name="username"
          id=""
          className="bg-white w-[80%] text-black p-4 rounded-sm outline-none font-comfortaa"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-center w-full mb-2">
        <input
          type="email"
          name="email"
          id=""
          className="bg-white w-[80%] text-black p-4 rounded-sm outline-none font-comfortaa"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-center w-full  mb-2">
        <div className="flex flex-col justify-center items-center w-[80%] relative bg-white p-4 rounded-sm">
          <input
            type={showPass ? 'text' : 'password'}
            name="password"
            id=""
            className="w-full text-black outline-none font-comfortaa"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute right-0 h-full w-1/12 flex items-center justify-center cursor-pointer text-black text-2xl bg-white "
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FaEye /> : <FaRegEye />}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full  mb-2">
        <div className="flex flex-col justify-center items-center w-[80%] relative bg-white p-4 rounded-sm">
          <input
            type={showConfirmPass ? 'text' : 'password'}
            name="confirmPass"
            id=""
            className="w-full text-black outline-none font-comfortaa"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <div
            className="absolute right-0 h-full w-1/12 flex items-center justify-center cursor-pointer text-black text-2xl bg-white "
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          >
            {showConfirmPass ? <FaEye /> : <FaRegEye />}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-5">
        <button
          className="bg-[#fca311] text-black px-4 py-2 rounded-sm font-lemon w-[80%] cursor-pointer"
          onClick={handleRegister}
        >
          Register
        </button>
        <div className="flex items-center w-[80%] my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-sm text-white whitespace-nowrap">
            or continue with
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <button
          className="mt-3 flex items-center justify-center bg-white text-black py-2 rounded-sm w-[80%] font-lemon cursor-pointer"
          onClick={handleGoogleLogin}
        >
          <p className="pr-2">Continue with Google</p>
          <FcGoogle className="text-2xl" />
        </button>
      </div>
      <button
        className="text-[#fca311] underline mt-5 cursor-pointer"
        onClick={() => setRegister(false)}
      >
        Already have an account? Sign in
      </button>
      {errorMsg && (
        <p
          key={errorMsg}
          className="w-full mt-3 text-center text-md text-red-500 animate-fadeOut"
        >
          {errorMsg}
        </p>
      )}
    </div>
  )
}

export default RegisterLogic
