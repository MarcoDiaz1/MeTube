'use client'
import React, { useRef } from 'react'
import {
  GiGalaxy,
  GiGClef,
  GiGalea,
  GiGameConsole,
  GiGearHammer,
  GiGaze,
  GiGlassShot,
  GiGlassHeart,
  GiGoldShell,
  GiGooeyDaemon,
} from 'react-icons/gi'

const icons = [
  GiGalaxy,
  GiGClef,
  GiGalea,
  GiGameConsole,
  GiGearHammer,
  GiGaze,
  GiGlassShot,
  GiGlassHeart,
  GiGoldShell,
  GiGooeyDaemon,
]

const getUserIcon = (userId) => {
  return icons[userId % icons.length]
}

export const VideoCard = ({ video }) => {
  const videoRef = useRef(null)

  const Icon = getUserIcon(video.user.id)

  const handleEnter = () => {
    videoRef.current?.play()
  }

  const handleLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className="h-[30vh]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-[80%] object-cover cursor-pointer rounded-lg"
        src={video.video_files?.[0]?.link}
        muted
        loop
      />
      <h3 className="font-ruminate mt-1 text-[1.25rem]">{video.user.name}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mt-1 font-ruminate">
          <p className="capitalize">{video.user.name}</p>
          <Icon className="text-xl" />
        </div>
        <p className="font-ruminate">{video.duration} seconds</p>
      </div>
    </div>
  )
}
