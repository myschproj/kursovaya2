import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { PrismaCallRepository } from '../repositories/callRepository.js';
import { DispatchService } from '../services/dispatchService.js';
import { elevatorStatusNotifier } from '../observers/elevatorStatusNotifier.js';

const callRepository = new PrismaCallRepository();
const dispatchService = new DispatchService('nearest');

const createSchema = z.object({
  fromFloorId: z.number().int().positive(),
  toFloorId: z.number().int().positive(),
  strategy: z.enum(['nearest', 'destination']).optional()
});

export async function listCalls(req, res) {
  res.json(await callRepository.findAll());
}

export async function createCall(req, res) {
  const data = createSchema.parse(req.body);
  if (data.fromFloorId === data.toFloorId) {
    return res.status(400).json({ message: 'Этаж отправления и этаж назначения не должны совпадать' });
  }

  const fromFloor = await prisma.floor.findUnique({ where: { id: data.fromFloorId } });
  const toFloor = await prisma.floor.findUnique({ where: { id: data.toFloorId } });
  if (!fromFloor || !toFloor || !fromFloor.isAvailable || !toFloor.isAvailable) {
    return res.status(400).json({ message: 'Выбранный этаж недоступен' });
  }

  const call = await callRepository.create({
    userId: req.user?.id || null,
    fromFloorId: data.fromFloorId,
    toFloorId: data.toFloorId
  });

  dispatchService.setStrategy(data.strategy || 'nearest');
  const result = await dispatchService.dispatch(call);
  res.status(201).json(result);
}

export async function getCall(req, res) {
  const call = await callRepository.findById(Number(req.params.id));
  if (!call) return res.status(404).json({ message: 'Вызов не найден' });
  res.json(call);
}

export async function cancelCall(req, res) {
  const id = Number(req.params.id);
  const call = await callRepository.update(id, { status: 'CANCELED' });
  await elevatorStatusNotifier.notify({
    userId: req.user?.id,
    elevatorId: call.elevatorId,
    eventType: 'CALL_CANCELED',
    message: `Вызов ${id} отменен пользователем`
  });
  res.json(call);
}
