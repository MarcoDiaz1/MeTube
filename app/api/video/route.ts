import prisma from '@/app/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 })
    }

    const res = await fetch(`https://api.pexels.com/v1/videos/videos/${id}`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    })

    if (!res.ok) {
      return Response.json(
        { error: 'Pexels fetch failed' },
        { status: res.status },
      )
    }

    const pexelsData = await res.json()

    const link = pexelsData.url

    let title = 'Untitled'

    if (link) {
      const segment = link.split('/').filter(Boolean).pop()
      if (segment) {
        const parts = segment.split('-')
        parts.pop()
        title = parts.join(' ')
      }
    }

    const dbVideo = await prisma.video.upsert({
      where: { id: String(id) },
      update: {},
      create: {
        id: String(id),
        title,
        description: pexelsData.video?.description || null,
        url: link || '',
      },
      select: {
        viewsCount: true,
        likesCount: true,
        dislikesCount: true,
      },
    })

    return Response.json({
      ...pexelsData,
      ...dbVideo,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
