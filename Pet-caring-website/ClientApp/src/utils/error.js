import { toast } from "react-toastify";
const handleError = (err, thunkAPI, defaultMessage) => {
  const errorMessage = err.response?.data
    ? `${err.response.data} (${err.message})`
    : `${defaultMessage} (${err.message})`;

  toast.error(errorMessage); // 🔥 Show error notification
  // rejectWithValue ensures error is being customized
  // it allows to pass a custom error message to the rejected state in Redux.
  // Axios typically stores the error response in error.response.
  // error.message - a general error message from JavaScript
  return thunkAPI.rejectWithValue(errorMessage); // Return error to Redux state
};

export default handleError;
