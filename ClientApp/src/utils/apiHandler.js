import axiosCustom from "../api/axiosCustom";

const handleApiRequest = async (
  method,
  endpoint,
  payload,
  thunkAPI,
  config = {},
) => {
  try {
    const response = await axiosCustom[method](endpoint, payload, config);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    
    return thunkAPI.rejectWithValue(response.data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
};

export default handleApiRequest;
