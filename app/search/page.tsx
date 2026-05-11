import React from 'react'
import VideoFeed from '../components/home/VideoFeed'

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const params = await searchParams

  const res = await fetch(
    `http://localhost:3000/api/search?query=${params.query}`,
    {
      cache: 'no-store',
    },
  )

  const data = await res.json()

  return <VideoFeed initialVideos={data.videos} query={params.query} />
}
