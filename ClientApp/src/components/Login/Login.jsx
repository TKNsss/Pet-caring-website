import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoginImg, catLoginImg } from "../../constants";
import { FaArrowLeft, FaGithub } from "react-icons/fa";
import { useMediaQueryContext } from "../../contexts/MediaQueryProvider";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  register,
  resetPassword,
  forgotPassword,
  loginWithGoogle,
} from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import OTPModal from "./OTPModal/OTPModal";
import { fetchUserProfile } from "../../redux/features/users/usersSlice";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  // hooks
  const isDesktop = useMediaQueryContext();
  const navigate = useNavigate(); // navigate the user to a new page without the user interacting.
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const { t } = useTranslation();
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
        dispatch(fetchUserProfile());
        navigate("/");
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

  const handleGoogleLogin = async (credentialResponse) => {
    const result = await dispatch(
      loginWithGoogle(credentialResponse.credential),
    );

    if (loginWithGoogle.fulfilled.match(result)) {
      toast.success(t("auth.google.success"));
    }
  };

  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const githubRedirectUri =
    import.meta.env.VITE_GITHUB_REDIRECT_URI ||
    `${window.location.origin}/auth/github/callback`;

  const handleGitHubLogin = () => {
    if (!githubClientId) {
      toast.error(t("auth.github.missingClientId"));
      return;
    }

    const stateValue = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2);

    sessionStorage.setItem("github_oauth_state", stateValue);

    const params = new URLSearchParams({
      client_id: githubClientId,
      redirect_uri: githubRedirectUri,
      scope: "read:user user:email",
      state: stateValue,
      allow_signup: "true",
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  const handleTextChange = (text) => {
    return status === "loading" ? t("common.loading") : text;
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
        toast.warning(t("auth.forgotPassword.missingEmail"));
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
          <div className="mb-4 flex justify-end">
            <LanguageSwitcher />
          </div>
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
            data-testid="login-back-to-home-link"
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
              <label htmlFor="email" className="block text-gray-700">
                Email address
              </label>
              <input
                id="email"
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
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                id="password"
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
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
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
                  {t("auth.labels.showPassword")}
                </label>
              </div>
              {!isRegistering && (
                <button
                  className="hover:text-third cursor-pointer text-sm text-gray-600 hover:underline"
                  onClick={() => handleDisplayModal("forgot-password")}
                >
                  {t("auth.labels.forgotPassword")}
                </button>
              )}
            </div>

            <button
              type="submit"
              className={`bg-third hover:bg-primary ${isRegistering ? "mt-4" : "mt-6"} w-full rounded-lg py-3 font-medium text-white transition ${status === "loading" ? "pointer-events-none" : "cursor-pointer"}`}
              data-testid="sign-in-register-btn"
            >
              {isRegistering
                ? handleTextChange(t("auth.login.register"))
                : handleTextChange(t("auth.login.signIn"))}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-500">{t("auth.login.divider")}</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Social Signup */}
          <div className="mt-4">
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full justify-center">
                <GoogleLogin
                  useOneTap // Enables One Tap - remember past user credential
                  auto_select={false}
                  onSuccess={async (credentialResponse) => {
                    await handleGoogleLogin(credentialResponse);
                    await dispatch(fetchUserProfile()).unwrap(); // Immediately fetch the user
                    navigate("/");
                  }}
                  onError={() => toast.error(t("auth.google.error"))}
                  text="signin_with"
                  shape="pill"
                />
              </div>

              <button
                type="button"
                onClick={handleGitHubLogin}
                className="border-third text-third hover:bg-third/10 flex items-center justify-center gap-2 rounded-full border px-4 py-2 font-medium transition cursor-pointer"
              >
                <FaGithub size={22} />
                {t("auth.github.button")}
              </button>
            </div>
          </div>
          {/* Toggle between Login and Register */}
          <p
            className={`${isRegistering ? "mt-1.5" : "mt-4"} text-center text-base text-gray-600`}
          >
            {isRegistering
              ? t("auth.login.toggleHaveAccount")
              : t("auth.login.toggleNoAccount")}{" "}
            <button
              className="text-third cursor-pointer hover:underline"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? t("auth.login.signIn") : t("auth.login.register")}
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
            src={LoginImg}
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
