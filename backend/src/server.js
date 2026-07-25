import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import { initSockets } from './sockets/index.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: env.CLIENT_URL, credentials: true },
});
initSockets(io);
app.set('io', io);

const start = async () => {
  await connectDB();
  server.listen(env.PORT, () => {
    console.log(`
==================================================
 AI Farmer Disease Predictor - Backend API
 Environment : ${env.NODE_ENV}
 Port        : ${env.PORT}
 Swagger Docs: http://localhost:${env.PORT}/api-docs
 Health Check: http://localhost:${env.PORT}/health
==================================================
    `);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
