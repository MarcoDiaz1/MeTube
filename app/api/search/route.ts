import { Video } from '@/app/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const query = searchParams.get('query') || ''
  const page = searchParams.get('page') || '1'

  const res = await fetch(
    `https://api.pexels.com/v1/videos/search?query=${query}&page=${page}&per_page=20`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    },
  )

  const data = await res.json()

  // ✅ Deduplicate
  const uniqueVideos = Array.from(
    new Map(data.videos.map((v: Video) => [v.id, v])).values(),
  )

  return Response.json({
    ...data,
    videos: uniqueVideos,
  })
}
