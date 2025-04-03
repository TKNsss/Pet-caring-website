import { toast } from "react-toastify";

const handleError = (err, thunkAPI) => {
  let errorMessage = "Something went wrong!";

  if (err.response?.data) {
    if (typeof err.response.data === "string") {
      errorMessage = err.response.data;
    } else if (err.response.data.errors) {
      // Format errors into JSX for multi-line support in Toastify
      errorMessage = (
        <div>
          {Object.entries(err.response.data.errors).map(([field, messages]) => (
            <p className="text-base" key={field}>
              <strong>{field}:</strong> <br />
              {messages.map((msg, index) => (
                <span className="text-base" key={index}>
                  - {msg}
                  <br />
                </span>
              ))}
            </p>
          ))}
        </div>
      );
    } else if (err.response.data.message) {
      errorMessage = err.response.data.message;
    }
  }

  toast.error(errorMessage); // Now supports multi-line error messages!
  return thunkAPI.rejectWithValue(errorMessage);
};

export default handleError;
