import { prisma } from '../utils/prisma.js';

export class PrismaCallRepository {
  create(data) {
    return prisma.elevatorCall.create({ data, include: { fromFloor: true, toFloor: true, elevator: true, user: true } });
  }

  findAll() {
    return prisma.elevatorCall.findMany({
      include: { fromFloor: true, toFloor: true, elevator: true, user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  findById(id) {
    return prisma.elevatorCall.findUnique({
      where: { id },
      include: { fromFloor: true, toFloor: true, elevator: true, user: true }
    });
  }

  update(id, data) {
    return prisma.elevatorCall.update({
      where: { id },
      data,
      include: { fromFloor: true, toFloor: true, elevator: true, user: true }
    });
  }
}
