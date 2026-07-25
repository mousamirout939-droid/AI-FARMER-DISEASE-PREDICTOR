import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import Chat from '../models/Chat.js';

export const initSockets = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication token required'));
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);

    socket.on('chat:join', (chatId) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on('chat:message', async ({ chatId, text, imageUrl }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;
        const message = { sender: socket.userId, text, imageUrl };
        chat.messages.push(message);
        await chat.save();
        io.to(`chat:${chatId}`).emit('chat:message', {
          ...message,
          chatId,
          createdAt: new Date(),
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('notification:read', (notificationId) => {
      io.to(`user:${socket.userId}`).emit('notification:updated', notificationId);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.userId}`);
    });
  });
};
