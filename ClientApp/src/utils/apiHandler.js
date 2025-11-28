import axiosCustom from "../api/axiosCustom";

const handleApiRequest = async (
  method,
  endpoint,
  payload,
  thunkAPI,
  config = {},
) => {
  try {
    const normalizedMethod = method.toLowerCase();
    let response;

    if (normalizedMethod === "get" || normalizedMethod === "delete") {
      response = await axiosCustom[normalizedMethod](endpoint, config);
    } else {
      response = await axiosCustom[normalizedMethod](endpoint, payload, config);
    }

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    
    return thunkAPI.rejectWithValue(response.data);
  } catch (err) {
    const serializedError =
      err?.response?.data ??
      (typeof err?.message === "string"
        ? {
            message: err.message,
            ...(err.code && { code: err.code }),
          }
        : { message: "Network Error" });

    return thunkAPI.rejectWithValue(serializedError);
  }
};

export default handleApiRequest;
