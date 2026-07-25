export const success = (res, statusCode, message, data = null, meta = undefined) =>
  res.status(statusCode).json({ success: true, message, data, meta });

export const failure = (res, statusCode, message, details = undefined) =>
  res.status(statusCode).json({ success: false, message, details });
