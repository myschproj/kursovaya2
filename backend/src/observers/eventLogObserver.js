import { prisma } from '../utils/prisma.js';

export class EventLogObserver {
  async update(event) {
    await prisma.event.create({
      data: {
        userId: event.userId || null,
        elevatorId: event.elevatorId || null,
        eventType: event.eventType,
        message: event.message
      }
    });
  }
}
