import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов')
});

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email }, include: { role: true, settings: true } });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role.name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
  res.json({ token, user: sanitizeUser(user) });
}

export async function register(req, res) {
  const data = registerSchema.parse(req.body);
  const passengerRole = await prisma.role.findUnique({ where: { name: 'PASSENGER' } });
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { ...data, passwordHash, roleId: passengerRole.id },
    include: { role: true }
  });
  await prisma.userSettings.create({ data: { userId: user.id } });
  res.status(201).json(sanitizeUser(user));
}

export function me(req, res) {
  const { passwordHash, ...safe } = req.user;
  res.json(safe);
}
