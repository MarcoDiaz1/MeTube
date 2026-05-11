'use client'

import { useRef, useEffect, useState } from 'react'
import { icons, parsePexelsUrl } from '@/app/lib/utils'
import { Video } from '@/app/types'
import {
  AiOutlineLike,
  AiFillDislike,
  AiOutlineDislike,
  AiFillLike,
} from 'react-icons/ai'
import { ImEye } from 'react-icons/im'

import React from 'react'
import { supabase } from '@/app/lib/supabase'

export default function VideoPlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [counted, setCounted] = useState(false)
  const [likes, setLikes] = useState(video.likesCount || 0)
  const [dislikes, setDislikes] = useState(video.dislikesCount || 0)
  const [userReaction, setUserReaction] = useState<null | 'LIKE' | 'DISLIKE'>(
    null,
  )

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const handlePlay = async () => {
      if (counted) return

      setCounted(true)

      await fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: String(video.id),
          videoUrl: video.url,
          videoTitle: parsePexelsUrl(video.url),
        }),
      })
    }

    videoEl.addEventListener('play', handlePlay)

    return () => {
      videoEl.removeEventListener('play', handlePlay)
    }
  }, [counted, video.id, video.url])

  const handleReaction = async (type: 'like' | 'dislike') => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      window.location.href = '/login'
      return
    }

    const prevLikes = likes
    const prevDislikes = dislikes
    const prevReaction = userReaction

    let newLikes = likes
    let newDislikes = dislikes
    let newReaction: typeof userReaction = userReaction

    if (userReaction === type.toUpperCase()) {
      // toggle OFF
      if (type === 'like') newLikes--
      else newDislikes--

      newReaction = null
    } else {
      // switch or create
      if (type === 'like') {
        newLikes++
        if (userReaction === 'DISLIKE') newDislikes--
      } else {
        newDislikes++
        if (userReaction === 'LIKE') newLikes--
      }

      newReaction = type.toUpperCase() as 'LIKE' | 'DISLIKE'
    }

    setLikes(newLikes)
    setDislikes(newDislikes)
    setUserReaction(newReaction)

    try {
      const res = await fetch('/api/reaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          videoId: String(video.id),
          reaction: type,
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()

      // ✅ sync with server truth
      setLikes(data.likes)
      setDislikes(data.dislikes)
      setUserReaction(data.userReaction)
    } catch (err) {
      // 💥 rollback if failed
      setLikes(prevLikes)
      setDislikes(prevDislikes)
      setUserReaction(prevReaction)
    }
  }

  useEffect(() => {
    const loadReaction = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const res = await fetch(`/api/reaction?videoId=${video.id}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!res.ok) {
        const text = await res.text()
        console.log(text)
        return
      }

      const data = await res.json()

      setUserReaction(data.userReaction)
    }

    loadReaction()
  }, [video.id])

  return (
    <div className="flex flex-col w-full">
      <video
        ref={videoRef}
        className="w-full h-[80vh]"
        src={video.video_files?.[0]?.link}
        controls
      />
      <div className="font-ruminate w-full h-[50vh] px-10 py-5 ">
        <p className="text-3xl capitalize">{parsePexelsUrl(video.url)}</p>
        <div className="flex w-full justify-between items-start">
          <div className="flex items-center gap-2 text-1xl mt-3">
            {React.createElement(icons[video.user.id % icons.length], {
              className: 'text-3xl bg-white rounded-full p-1 text-gray-800',
            })}
            <p className="capitalize">{video.user.name}</p>
          </div>
          <div className="flex justify-center gap-5 text-2xl">
            <div className="flex">
              <button
                className="cursor-pointer"
                onClick={() => handleReaction('like')}
              >
                {userReaction === 'LIKE' ? <AiFillLike /> : <AiOutlineLike />}
              </button>
              <span className="ml-2">{likes}</span>
            </div>
            <div className="flex">
              <button
                className="cursor-pointer"
                onClick={() => handleReaction('dislike')}
              >
                {userReaction === 'DISLIKE' ? (
                  <AiFillDislike />
                ) : (
                  <AiOutlineDislike />
                )}
              </button>
              <span className="ml-2">{dislikes}</span>
            </div>
            <div className="flex items-center">
              <ImEye />
              <span className="ml-2">{video.viewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
