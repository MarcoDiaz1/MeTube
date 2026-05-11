import { Video } from '@/app/types'
import VideoPlayer from './logic'

export default async function SingleVideo({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const res = await fetch(`http://localhost:3000/api/video?id=${id}`, {
    cache: 'no-store',
  })

  const data = await res.json()

  return <VideoPlayer video={data as Video} />
}
