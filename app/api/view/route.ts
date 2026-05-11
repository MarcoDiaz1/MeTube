import prisma from '../../lib/prisma'

export async function POST(req: Request) {
  const { videoId, userId, videoUrl, videoTitle } = await req.json()

  await prisma.video.upsert({
    where: {
      id: videoId,
    },
    update: {},
    create: {
      id: videoId,
      title: videoTitle,
      url: videoUrl,
      viewsCount: 0,
    },
  })

  await prisma.view.create({
    data: {
      videoId,
      userId,
    },
  })

  await prisma.video.update({
    where: {
      id: videoId,
    },
    data: {
      viewsCount: {
        increment: 1,
      },
    },
  })

  const recentView = await prisma.view.findFirst({
    where: {
      videoId,
      userId: userId || null,
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 5), // last 5 minutes
      },
    },
  })

  if (!recentView) {
    await prisma.view.create({
      data: {
        videoId,
        userId,
      },
    })

    await prisma.video.update({
      where: { id: videoId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    })
  }

  return Response.json({ ok: true })
}
