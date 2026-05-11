'use client'

import Link from 'next/link'
import React, { useRef } from 'react'
import { Video } from '../types'
import { icons, parsePexelsUrl } from './utils'

export const VideoCard = ({ video }: { video: Video }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const title = parsePexelsUrl(video.url)
  const iconIndex = video.user.id % icons.length

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
      <Link href={`video/${video.id}`}>
        <video
          ref={videoRef}
          className="w-full h-[80%] object-cover cursor-pointer rounded-lg"
          src={video.video_files?.[0]?.link}
          muted
          loop
        />
      </Link>
      <h3 className="font-ruminate mt-1 text-[1.25rem]">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mt-1 font-ruminate">
          <p className="capitalize">{video.user.name}</p>
          {React.createElement(icons[iconIndex], { className: 'text-xl' })}
        </div>
        <p className="font-ruminate">{video.duration} seconds</p>
      </div>
    </div>
  )
}
