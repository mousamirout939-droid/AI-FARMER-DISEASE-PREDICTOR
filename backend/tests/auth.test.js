import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Auth flow', () => {
  const user = { name: 'Test Farmer', email: 'test.farmer@example.com', password: 'Password123' };

  it('registers a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('rejects duplicate registration', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(user);
    expect(res.statusCode).toBe(409);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'WrongPassword' });
    expect(res.statusCode).toBe(401);
  });
});
