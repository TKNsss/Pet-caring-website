// src/utils/formatApiError.js
import React from "react";

const formatApiError = (err) => {
  let errorMessage = err.message || "Some thing went wrong!";

  if (err.response?.data) {
    if (typeof err.response.data === "string") {
      errorMessage = err.response.data;
    } else if (err.response.data.errors) {
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

  return errorMessage;
};

export default formatApiError;
