import SupportTicket from '../models/SupportTicket.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.create({ ...req.body, user: req.user._id });
  success(res, 201, 'Support ticket created', ticket);
});

export const listMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
  success(res, 200, 'Tickets fetched', tickets);
});

export const listAllTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find().populate('user', 'name email').sort({ createdAt: -1 });
  success(res, 200, 'All tickets fetched', tickets);
});

export const respondToTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');
  ticket.responses.push({ by: req.user._id, message: req.body.message });
  if (req.body.status) ticket.status = req.body.status;
  await ticket.save();
  success(res, 200, 'Response added', ticket);
});
