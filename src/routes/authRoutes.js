import bcrypt from 'bcrypt';
import { prisma } from '../../index.js';

async function routes(fastify, options) {
  fastify.post('/sign-out', async (request, reply) => {
    const { email, password, address, phone, rg, birthDate } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, address, phone, rg, birthDate: new Date(birthDate) },
    });
    reply.send({ user });
  });

  fastify.post('/sign-in', async (request, reply) => {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: 'Credenciais inválidas' });
    }
    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    reply.send({ token });
  });
}

export default routes;
