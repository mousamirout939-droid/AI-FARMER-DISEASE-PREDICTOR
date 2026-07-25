import crypto from 'crypto';
import Appointment from '../models/Appointment.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

export const bookAppointment = asyncHandler(async (req, res) => {
  const { expertId, scheduledAt, mode, notes } = req.body;
  const appointment = await Appointment.create({
    farmer: req.user._id,
    expert: expertId,
    scheduledAt,
    mode,
    notes,
    roomId: mode === 'video' ? crypto.randomBytes(8).toString('hex') : '',
  });
  success(res, 201, 'Appointment booked', appointment);
});

export const listAppointments = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === 'expert'
      ? { expert: req.user._id }
      : req.user.role === 'admin'
      ? {}
      : { farmer: req.user._id };
  const appointments = await Appointment.find(filter)
    .populate('farmer', 'name avatar')
    .populate('expert', 'name avatar expertDetails')
    .sort({ scheduledAt: 1 });
  success(res, 200, 'Appointments fetched', appointments);
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  appointment.status = req.body.status;
  await appointment.save();
  success(res, 200, 'Appointment updated', appointment);
});
