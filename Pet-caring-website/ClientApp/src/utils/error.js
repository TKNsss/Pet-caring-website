import { toast } from "react-toastify";
const handleError = (err, thunkAPI) => {
  let errorMessage = "Something went wrong!";

  if (err.response?.data) {
    if (typeof err.response.data === "string") {
      errorMessage = err.response.data;
    } else if (err.response.data.errors) {
      // Handle ASP.NET Core model validation errors
      errorMessage = Object.values(err.response.data.errors).flat().join(" ");
    } else if (err.response.data.message) {
      errorMessage = err.response.data.message;
    }
  }

  toast.error(errorMessage); // 🔥 Show error notification
  // rejectWithValue ensures error is being customized
  // it allows to pass a custom error message to the rejected state in Redux.
  // Axios typically stores the error response in error.response.
  // error.message - a general error message from JavaScript
  return thunkAPI.rejectWithValue(errorMessage); // Return error to Redux state
};

export default handleError;
