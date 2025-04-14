import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loginImg, catLoginImg } from "../../constants";
import { FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useMediaQueryContext } from "../../contexts/MediaQueryProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  register,
  resetPassword,
  updateToken,
  forgotPassword,
} from "../../redux/features/auth/authSlice";
import { triggerRefreshUserProfile } from "../../redux/features/users/usersSlice";
import { toast } from "react-toastify";
import OTPModal from "./OTPModal/OTPModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  // state
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  // hooks
  const isDesktop = useMediaQueryContext();
  const navigate = useNavigate(); // navigate the user to a new page without the user interacting.
  const dispatch = useDispatch();
  const location = useLocation();
  const status = useSelector((state) => state.auth.status);
  // animation
  const formAnimation = isDesktop
    ? { x: isRegistering ? "100%" : "0%" }
    : { x: 0 };
  // form data
  const initialFormState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    navigate(isRegistering ? "/register" : "/login");
  }, [isRegistering, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      dispatch(updateToken(token));
      toast.success("Đăng nhập với Google thành công 🎉");
      navigate("/");
    }
  }, [location.search, navigate, dispatch]);

  const resetForm = () => setFormData(initialFormState);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === "showPass") {
      setShowPassword(checked);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const triggerRegistration = async (otpCode = "") => {
    const resultAction = await dispatch(
      register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        confirmPassword: formData.confirmPassword.trim(),
        ...(otpCode && { otpCode }), // only include otpCode if provided
      }),
    );

    return resultAction;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isRegistering) {
      const resultAction = await dispatch(
        login({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      );

      if (login.fulfilled.match(resultAction)) {
        navigate("/");
        dispatch(triggerRefreshUserProfile());
        resetForm();
      }
    } else {
      const resultAction = await triggerRegistration();

      if (register.fulfilled.match(resultAction)) {
        const responseData = resultAction.payload;

        if (responseData?.message?.toLowerCase().includes("otp")) {
          handleDisplayModal("register");
        }
      }
    }
  };

  const handleLoginWithGoogle = async () => {
    window.location.href = `${API_BASE_URL}/auth/login-google`;
  };

  const handleTextChange = (text) => {
    return status === "loading" ? "Loading..." : text;
  };

  const handleForgotPassword = async () => {
    await dispatch(forgotPassword({ email: formData.email }));
  };

  const handleDisplayModal = (newPurpose) => {
    if (newPurpose === "register") {
      setPurpose("register");
      setShowModal(true);
    } else if (newPurpose === "forgot-password") {
      if (formData.email !== "") {
        setPurpose("forgot-password");
        setShowModal((prev) => !prev); // toggle
      } else {
        toast.warning("Vui lòng điền email để lấy lại mật khẩu!");
      }
    } else {
      // fallback: just toggle visibility
      setShowModal((prev) => !prev);
    }
  };

  const handleOTPSubmit = async (otpValue) => {
    if (purpose === "register") {
      const resultAction = await triggerRegistration(otpValue);

      if (register.fulfilled.match(resultAction)) {
        setIsRegistering(false);
        resetForm();
        return true;
      } else {
        return false;
      }
    }

    if (purpose === "forgot-password") {
      const resultAction = await dispatch(
        resetPassword({ email: formData.email, otpCode: otpValue }),
      );

      if (resetPassword.fulfilled.match(resultAction)) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <div className="bg-lavender flex min-h-screen items-center justify-center p-4">
      <div className="relative flex w-full max-w-4xl bg-white shadow-lg">
        {/* Animated Form Section */}
        <motion.div
          className={`relative mr-auto w-full ${isRegistering ? "p-5 py-4" : "p-8"} md:w-1/2`}
          initial={{ x: 0 }}
          animate={formAnimation}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="absolute -top-35 -left-6 md:hidden">
            <img src={catLoginImg} className="h-70 w-70" />
          </div>

          <h2
            className={`text-third relative text-center ${isRegistering ? "md:text-2xl" : "md:text-3xl"} text-2xl font-semibold tracking-wider`}
          >
            {isRegistering ? "Create Your Account" : "Welcome Back"}
          </h2>

          <Link
            to="/"
            className="text-third font-Poppins flex items-center justify-center gap-1 text-sm hover:underline"
          >
            <FaArrowLeft className="text-sm" />
            back to home
          </Link>

          <form
            className={`${isRegistering ? "mt-4" : "mt-6"}`}
            onSubmit={handleSubmit}
          >
            {isRegistering && (
              <div>
                <label className="block text-gray-700">User name</label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  className="log-input"
                  onChange={handleChange}
                  name="username"
                  value={formData.username}
                  required
                />
              </div>
            )}

            <div className="mt-4">
              <label className="block text-gray-700">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="log-input"
                onChange={handleChange}
                name="email"
                value={formData.email}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="log-input"
                onChange={handleChange}
                name="password"
                value={formData.password}
                required
              />
            </div>

            {isRegistering && (
              <div className="mt-4">
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="log-input"
                  onChange={handleChange}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  required
                />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div>
                <input
                  type="checkbox"
                  id="showPass"
                  className="mr-2"
                  onChange={handleChange}
                  name="showPass"
                  checked={showPassword}
                />
                <label htmlFor="showPass" className="text-sm text-gray-600">
                  Show password
                </label>
              </div>
              {!isRegistering && (
                <button
                  className="hover:text-third cursor-pointer text-sm text-gray-600 hover:underline"
                  onClick={() => handleDisplayModal("forgot-password")}
                >
                  Forgot password?
                </button>
              )}
            </div>

            <button
              type="submit"
              className={`bg-third hover:bg-primary ${isRegistering ? "mt-4" : "mt-6"} w-full cursor-pointer rounded-lg py-3 font-medium text-white transition`}
            >
              {isRegistering
                ? handleTextChange("Register")
                : handleTextChange("Sign in")}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Social Signup */}
          <div className="mt-4">
            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border p-2 font-medium transition hover:bg-gray-100"
              onClick={handleLoginWithGoogle}
            >
              <FcGoogle className="text-2xl" />
              Sign in with Google
            </button>
          </div>

          {/* Toggle between Login and Register */}
          <p
            className={`${isRegistering ? "mt-1.5" : "mt-4"} text-center text-base text-gray-600`}
          >
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              className="text-third hover:underline"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Sign In" : "Register"}
            </button>
          </p>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          className="absolute top-0 right-0 hidden h-full md:block md:w-1/2"
          initial={{ x: 0 }}
          animate={{ x: isRegistering ? "-100%" : "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <img
            src={loginImg}
            alt="Plant"
            className={`h-full w-full ${isRegistering ? "rounded-r-3xl" : "rounded-l-3xl"} object-cover`}
          />
        </motion.div>
      </div>

      <OTPModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        onSubmit={handleOTPSubmit}
        onForgotPassword={handleForgotPassword}
        purpose={purpose}
      />
    </div>
  );
};

export default Login;
