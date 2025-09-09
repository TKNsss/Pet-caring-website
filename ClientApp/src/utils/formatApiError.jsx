import React from "react";

const formatApiError = (err) => {
  let data = err?.response?.data || err;

  if (typeof data === "string") {
    return data;
  }

  if (data?.errors) {
    return (
      <div>
        {Object.entries(data.errors).map(([field, messages]) => (
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
  }

  // Case: Merge title + detail if both exist
  if (data?.title && data?.detail) {
    return (
      <p className="text-base">
        <strong>{data.title}:</strong> {data.detail}
      </p>
    );
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.error) {
    return data.error;
  }

  return err || "Something went wrong!";
};

export default formatApiError;
