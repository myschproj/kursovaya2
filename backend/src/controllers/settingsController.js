import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'contrast']).optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
  accessibilityMode: z.boolean().optional(),
  soundFeedback: z.boolean().optional(),
  language: z.enum(['ru', 'en']).optional()
});

export async function getSettings(req, res) {
  const settings = await prisma.userSettings.findUnique({ where: { userId: req.user.id } });
  res.json(settings);
}

export async function updateSettings(req, res) {
  const data = settingsSchema.parse(req.body);
  const settings = await prisma.userSettings.upsert({
    where: { userId: req.user.id },
    update: data,
    create: { userId: req.user.id, ...data }
  });
  res.json(settings);
}
