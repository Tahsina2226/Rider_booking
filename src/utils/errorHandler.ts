export const handleError = (res: any, error: any, status = 500) => {
  return res.status(status).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
