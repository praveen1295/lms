// utils/apiResponse.js

const success = (res: any, data: any, message = "Request successful") => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const error = (
  res: any,
  data: any,
  message = "Something went wrong",
  statusCode = 400
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};

const apiResponse = { success, error };

export default apiResponse;
