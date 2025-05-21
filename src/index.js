import Fastify from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from '@fastify/jwt';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
dotenv.config();

const fastify = Fastify();

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.get('/', async (request, reply) => {
  return { message: 'API rodando com sucesso ' };
});

fastify.register(authRoutes);
fastify.register(userRoutes);

//inicio
fastify.listen({ port: 3000 }, err => {
  if (err) throw err;
  console.log(' Servidor rodando em http://localhost:3000');
});
