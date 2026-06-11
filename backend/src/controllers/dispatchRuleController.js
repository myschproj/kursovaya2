import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const schema = z.object({
  name: z.string().min(1),
  strategy: z.enum(['nearest', 'destination']),
  isEnabled: z.boolean().optional(),
  description: z.string().optional()
});

export async function listRules(req, res) {
  res.json(await prisma.dispatchRule.findMany({ orderBy: { id: 'asc' } }));
}

export async function createRule(req, res) {
  const data = schema.parse(req.body);
  res.status(201).json(await prisma.dispatchRule.create({ data }));
}

export async function updateRule(req, res) {
  const id = Number(req.params.id);
  const data = schema.partial().parse(req.body);
  res.json(await prisma.dispatchRule.update({ where: { id }, data }));
}

export async function deleteRule(req, res) {
  await prisma.dispatchRule.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
}
