import { prisma } from "../index.js"
import bcrypt from 'bcrypt';

async function routes(fastify) {
  fastify.get('/users', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'ADMIN') return reply.status(403).send();
    const users = await prisma.user.findMany();
    reply.send(users);
  });

  fastify.get('/users/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    if (request.user.role !== 'ADMIN' && request.user.id !== parseInt(id)) return reply.status(403).send();
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    reply.send(user);
  });

  fastify.post('/users', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'ADMIN') return reply.status(403).send();
    const { email, password, address, phone, rg, birthDate, role } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, address, phone, rg, birthDate: new Date(birthDate), role },
    });
    reply.send(user);
  });

  fastify.put('/users/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    if (request.user.role !== 'ADMIN' && request.user.id !== parseInt(id)) return reply.status(403).send();
    const { email, address, phone, rg, birthDate } = request.body;
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, address, phone, rg, birthDate: new Date(birthDate) },
    });
    reply.send(updated);
  });
}

export default routes;
