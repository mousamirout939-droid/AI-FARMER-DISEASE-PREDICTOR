import request from 'supertest';
import app from '../src/app.js';

describe('Health check', () => {
  it('GET /health returns 200 and success true', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
