'use client'

import React, { useState } from 'react'
import LoginLogic from './loginLogic'
import RegisterLogic from './registerLogic'
import { MdOutlineAirplay } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'

const Login = () => {
  const [register, setRegister] = useState(false)

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center w-2/6 h-[70vh] bg-[#14213d] overflow-hidden">
        <div className="flex px-[2vw] h-2/10 w-10/12 font-lemon text-2xl text-center items-center justify-center mb-5">
          <MdOutlineAirplay className="mr-3 text-[#fca311]" />
          <p>MeTube</p>
        </div>

        <AnimatePresence mode="wait">
          {register ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <RegisterLogic setRegister={setRegister} />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <LoginLogic setRegister={setRegister} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Login
