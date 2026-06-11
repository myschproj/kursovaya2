import { prisma } from '../utils/prisma.js';

export async function listEvents(req, res) {
  const events = await prisma.event.findMany({
    include: { user: { select: { id: true, name: true, email: true } }, elevator: true },
    orderBy: { createdAt: 'desc' },
    take: 200
  });
  res.json(events);
}
