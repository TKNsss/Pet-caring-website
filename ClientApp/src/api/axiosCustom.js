import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosCustom = axios.create({
  baseURL: API_BASE_URL, // All requests using this instance will automatically start with this URL
  validateStatus: () => true, // manually handle status codes ourselves inside the thunk.
});

// Interceptors are middleware functions — they run before your request is sent.
// if the token is missing -> request will not be blocked -> server will handle the response with 401 (unauthorized) - BE
axiosCustom.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // automatically attach it to the request’s Authorization header
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Only set JSON if not uploading files
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config; // like next() in nodejs - keep the request continuing
  },
  (error) => Promise.reject(error) // error happens will block the request
);

export default axiosCustom;