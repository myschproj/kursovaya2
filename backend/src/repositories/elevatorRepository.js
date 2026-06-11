import { prisma } from '../utils/prisma.js';

export class PrismaElevatorRepository {
  findAll() {
    return prisma.elevator.findMany({ include: { currentFloor: true }, orderBy: { id: 'asc' } });
  }

  findActive() {
    return prisma.elevator.findMany({
      where: { isActive: true, status: { notIn: ['ERROR', 'MAINTENANCE'] } },
      include: { currentFloor: true },
      orderBy: { id: 'asc' }
    });
  }

  findById(id) {
    return prisma.elevator.findUnique({ where: { id }, include: { currentFloor: true } });
  }

  create(data) {
    return prisma.elevator.create({ data, include: { currentFloor: true } });
  }

  update(id, data) {
    return prisma.elevator.update({ where: { id }, data, include: { currentFloor: true } });
  }

  delete(id) {
    return prisma.elevator.delete({ where: { id } });
  }
}
