import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upsertRole(name, description) {
  return prisma.role.upsert({
    where: { name },
    update: { description },
    create: { name, description }
  });
}

async function upsertUser({ name, email, password, roleId }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, roleId },
    create: { name, email, passwordHash, roleId }
  });
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id }
  });
  return user;
}

async function main() {
  const adminRole = await upsertRole('ADMIN', 'Администратор системы');
  const dispatcherRole = await upsertRole('DISPATCHER', 'Диспетчер');
  const passengerRole = await upsertRole('PASSENGER', 'Пассажир');
  await upsertRole('TECHNICIAN', 'Технический специалист');

  await upsertUser({ name: 'Администратор', email: 'admin@example.com', password: 'admin123', roleId: adminRole.id });
  await upsertUser({ name: 'Диспетчер', email: 'dispatcher@example.com', password: 'dispatcher123', roleId: dispatcherRole.id });
  await upsertUser({ name: 'Пассажир', email: 'passenger@example.com', password: 'passenger123', roleId: passengerRole.id });

  for (let i = 1; i <= 10; i++) {
    await prisma.floor.upsert({
      where: { number: i },
      update: { name: `${i} этаж`, isAvailable: true },
      create: { number: i, name: `${i} этаж`, isAvailable: true }
    });
  }

  const firstFloor = await prisma.floor.findUnique({ where: { number: 1 } });
  for (const name of ['Лифт A', 'Лифт B', 'Лифт C']) {
    await prisma.elevator.upsert({
      where: { name },
      update: { currentFloorId: firstFloor.id, status: 'IDLE', direction: 'STOPPED', isActive: true },
      create: { name, currentFloorId: firstFloor.id, capacity: 8, maxFloor: 10 }
    });
  }

  await prisma.dispatchRule.upsert({
    where: { name: 'Ближайший свободный лифт' },
    update: { strategy: 'nearest', isEnabled: true },
    create: {
      name: 'Ближайший свободный лифт',
      strategy: 'nearest',
      isEnabled: true,
      description: 'Выбирает активный лифт с минимальной разницей между текущим этажом и этажом вызова.'
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
