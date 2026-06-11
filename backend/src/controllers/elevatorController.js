import { z } from 'zod';
import { PrismaElevatorRepository } from '../repositories/elevatorRepository.js';
import { elevatorStatusNotifier } from '../observers/elevatorStatusNotifier.js';
import { prisma } from '../utils/prisma.js';

const repository = new PrismaElevatorRepository();

const createSchema = z.object({
  name: z.string().min(1),
  currentFloorId: z.number().int().positive(),
  capacity: z.number().int().positive().default(8),
  maxFloor: z.number().int().positive().default(10),
  isActive: z.boolean().default(true)
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  currentFloorId: z.number().int().positive().optional(),
  status: z.enum(['IDLE', 'MOVING', 'DOORS_OPEN', 'MAINTENANCE', 'ERROR']).optional(),
  direction: z.enum(['UP', 'DOWN', 'STOPPED']).optional(),
  capacity: z.number().int().positive().optional(),
  maxFloor: z.number().int().positive().optional(),
  isActive: z.boolean().optional()
});

export async function listElevators(req, res) {
  res.json(await repository.findAll());
}

export async function createElevator(req, res) {
  const data = createSchema.parse(req.body);
  const elevator = await repository.create(data);
  await elevatorStatusNotifier.notify({
    userId: req.user?.id,
    elevatorId: elevator.id,
    eventType: 'ELEVATOR_CREATED',
    message: `Создан лифт ${elevator.name}`
  });
  res.status(201).json(elevator);
}

export async function updateElevator(req, res) {
  const id = Number(req.params.id);
  const data = updateSchema.parse(req.body);
  const elevator = await repository.update(id, data);
  await elevatorStatusNotifier.notify({
    userId: req.user?.id,
    elevatorId: elevator.id,
    eventType: 'ELEVATOR_UPDATED',
    message: `Обновлены параметры лифта ${elevator.name}`
  });
  res.json(elevator);
}

export async function deleteElevator(req, res) {
  const id = Number(req.params.id);
  const elevator = await prisma.elevator.findUnique({ where: { id } });
  if (!elevator) {
    return res.status(404).json({ message: 'Лифт не найден или уже был удалён' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.elevatorCall.updateMany({ where: { elevatorId: id }, data: { elevatorId: null } });
    await tx.event.updateMany({ where: { elevatorId: id }, data: { elevatorId: null } });
    await tx.elevator.delete({ where: { id } });
    await tx.event.create({
      data: {
        userId: req.user?.id || null,
        elevatorId: null,
        eventType: 'ELEVATOR_DELETED',
        message: `Удалён лифт ${elevator.name} (#${id})`
      }
    });
  });

  res.json({ message: 'Лифт удалён' });
}
