import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.number().int().positive()
});

const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roleId: z.number().int().positive().optional()
});

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function listUsers(req, res) {
  const users = await prisma.user.findMany({ include: { role: true, settings: true }, orderBy: { id: 'asc' } });
  res.json(users.map(sanitize));
}

export async function createUser(req, res) {
  const data = userCreateSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash, roleId: data.roleId },
    include: { role: true }
  });
  await prisma.userSettings.create({ data: { userId: user.id } });
  res.status(201).json(sanitize(user));
}

export async function updateUser(req, res) {
  const id = Number(req.params.id);
  const data = userUpdateSchema.parse(req.body);
  const updateData = { ...data };
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
    delete updateData.password;
  }
  const user = await prisma.user.update({ where: { id }, data: updateData, include: { role: true, settings: true } });
  res.json(sanitize(user));
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден или уже был удалён' });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (adminRole && user.roleId === adminRole.id) {
    const adminsCount = await prisma.user.count({ where: { roleId: adminRole.id } });
    if (adminsCount <= 1) {
      return res.status(409).json({ message: 'Нельзя удалить последнего администратора системы' });
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.userSettings.deleteMany({ where: { userId: id } });
    await tx.elevatorCall.updateMany({ where: { userId: id }, data: { userId: null } });
    await tx.event.updateMany({ where: { userId: id }, data: { userId: null } });
    await tx.user.delete({ where: { id } });
    await tx.event.create({
      data: {
        userId: req.user?.id === id ? null : req.user?.id || null,
        eventType: 'USER_DELETED',
        message: `Удалён пользователь ${user.name} (${user.email})`
      }
    });
  });

  res.json({ message: 'Пользователь удалён' });
}

export async function listRoles(req, res) {
  const roles = await prisma.role.findMany({ orderBy: { id: 'asc' } });
  res.json(roles);
}
