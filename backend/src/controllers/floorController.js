import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const floorSchema = z.object({
  number: z.number().int(),
  name: z.string().min(1),
  isAvailable: z.boolean().optional()
});

const floorUpdateSchema = floorSchema.partial();

export async function listFloors(req, res) {
  const floors = await prisma.floor.findMany({ orderBy: { number: 'asc' } });
  res.json(floors);
}

export async function createFloor(req, res) {
  const data = floorSchema.parse(req.body);
  const floor = await prisma.floor.create({ data });
  res.status(201).json(floor);
}

export async function updateFloor(req, res) {
  const id = Number(req.params.id);
  const data = floorUpdateSchema.parse(req.body);
  const floor = await prisma.floor.update({ where: { id }, data });
  res.json(floor);
}

export async function deleteFloor(req, res) {
  const id = Number(req.params.id);
  const floor = await prisma.floor.findUnique({ where: { id } });
  if (!floor) {
    return res.status(404).json({ message: 'Этаж не найден или уже был удалён' });
  }

  const fallbackFloor = await prisma.floor.findFirst({
    where: { id: { not: id } },
    orderBy: { number: 'asc' }
  });

  const elevatorsOnFloor = await prisma.elevator.count({ where: { currentFloorId: id } });
  if (elevatorsOnFloor > 0 && !fallbackFloor) {
    return res.status(409).json({
      message: 'Нельзя удалить единственный этаж, потому что на нём находятся лифты. Сначала добавьте другой этаж.'
    });
  }

  await prisma.$transaction(async (tx) => {
    if (fallbackFloor) {
      await tx.elevator.updateMany({ where: { currentFloorId: id }, data: { currentFloorId: fallbackFloor.id } });
    }
    await tx.elevatorCall.deleteMany({
      where: { OR: [{ fromFloorId: id }, { toFloorId: id }] }
    });
    await tx.floor.delete({ where: { id } });
    await tx.event.create({
      data: {
        userId: req.user?.id || null,
        eventType: 'FLOOR_DELETED',
        message: `Удалён этаж ${floor.name} (#${id})`
      }
    });
  });

  res.json({ message: 'Этаж удалён' });
}
