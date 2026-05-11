'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'
import { PiFinnTheHuman } from 'react-icons/pi'
import { FaEye, FaRegEye } from 'react-icons/fa'

import { supabase } from '@/app/lib/supabase'

const Profile = () => {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('')
    setSuccessMessage('')

    const file = e.target.files?.[0]

    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Invalid image')
      return
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    console.log('AUTH USER:', authUser)
    console.log('CONTEXT USER:', user)

    const fileExt = file.name.split('.').pop()

    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    console.log('FILE PATH:', filePath)

    const { error, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    console.log('UPLOAD DATA:', data)

    if (error) {
      console.error('UPLOAD ERROR:', error)
      alert(error.message)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrlData.publicUrl,
      },
    })

    await supabase.auth.refreshSession()
  }

  const handlePasswordUpdate = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!user?.email) {
      setErrorMessage('No authenticated user')
      return
    }

    if (!oldPassword || !newPassword) {
      setErrorMessage('Fill all fields')
      return
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      return
    }

    if (oldPassword === newPassword) {
      setErrorMessage('New password must be different')
      return
    }

    try {
      setLoadingPassword(true)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      })

      if (signInError) {
        setErrorMessage('Old password is incorrect')
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setErrorMessage(updateError.message)
        return
      }

      setSuccessMessage('Password updated successfully')

      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      console.error(err)
      setErrorMessage('Something went wrong')
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleProfileUpdate = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          bio,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      await supabase.auth.refreshSession()

      setSuccessMessage('Profile updated successfully')
    } catch (err) {
      console.error(err)
      setErrorMessage('Something went wrong')
    }
  }

  useEffect(() => {
    if (user) {
      setEmail(user.email || '')
      setUsername(user.user_metadata.username || '')
      setBio(user.user_metadata.bio || '')
    }
  }, [user])

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('')
        setSuccessMessage('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorMessage, successMessage])

  useEffect(() => {
    if (user && !username) {
      setUsername(user.user_metadata.username || '')
    }
  }, [user])

  return (
    <div className="flex justify-center">
      <div className="w-11/12 h-[90vh] bg-[#212121]">
        <div className="flex row w-full h-[90%] ">
          <div className=" flex flex-col items-center justify-between m-5 w-1/3 ">
            <div className="flex flex-col items-center gap-4 w-full mt-20">
              {user?.user_metadata.avatar_url ? (
                <Image
                  src={user?.user_metadata.avatar_url}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-75 h-75"
                  alt="Picture of the author"
                />
              ) : (
                <PiFinnTheHuman className="text-[300px] text-gray-500" />
              )}
              <input
                hidden
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
              />

              <button
                className="bg-[#171717] p-3 rounded-lg cursor-pointer font-lemon text-sm w-2/3"
                onClick={() => fileInputRef.current?.click()}
              >
                Update Profile Picture
              </button>
            </div>
            <div className="flex flex-col items-center justify-around text-center w-full h-[30vh] relative">
              <div className="w-full flex items-center flex-col">
                <p className=" font-lemon">Old Password</p>
                <div className="relative bg-white flex w-2/3 mt-2 rounded-lg">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="bg-white w-[90%] px-3 text-black rounded-lg outline-none font-normal"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-0 h-full w-[10%] flex items-center justify-center cursor-pointer text-black text-2xl bg-white rounded-sm"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <FaEye /> : <FaRegEye />}
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center flex-col">
                <p className=" font-lemon">New Password</p>
                <div className="relative bg-white flex w-2/3 mt-2 rounded-lg">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    className="bg-white w-[90%] px-3 text-black rounded-lg outline-none font-normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-0 h-full w-[10%] flex items-center justify-center cursor-pointer text-black text-2xl bg-white rounded-sm"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? <FaEye /> : <FaRegEye />}
                  </div>
                </div>
              </div>
              <button
                className="bg-[#171717] p-3 rounded-lg cursor-pointer font-lemon text-sm w-2/3"
                onClick={handlePasswordUpdate}
                disabled={loadingPassword}
              >
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </button>
              {errorMessage && (
                <p className="text-red-500 text-sm transition-opacity duration-300 absolute bottom-[-3vh]">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm transition-opacity duration-300 absolute bottom-[-3vh]">
                  {successMessage}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col m-5 justify-center w-2/3 gap-10">
            <h1 className="font-lemon">Profile information</h1>
            <div>
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <p className="font-lemon"> Username</p>
                  <input
                    type="text"
                    name="username"
                    id=""
                    className="border-solid border-2 border-[#fca311] rounded-sm w-1/2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button
                    className="bg-[#171717] text-white p-2 rounded-lg ml-2 cursor-pointer"
                    onClick={handleProfileUpdate}
                  >
                    Update
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <p className="font-lemon">Email</p>
                  <input
                    disabled
                    type="email"
                    name="email"
                    id=""
                    className="border-solid border-2 border-[#fca311] rounded-sm w-1/2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="  Email changes coming soon"
                  />
                  <button className="bg-[#171717] text-white p-2 rounded-lg ml-2 cursor-pointer">
                    Update
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="font-lemon w-full">Bio</p>
                <textarea
                  name="bio"
                  id=""
                  cols={30}
                  rows={10}
                  className="border-solid border-2 border-[#fca311] rounded-sm w-2/3 p-3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <div className="w-2/3">
                  <button
                    className="bg-[#171717] text-white p-2 rounded-lg cursor-pointer w-full"
                    onClick={handleProfileUpdate}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
