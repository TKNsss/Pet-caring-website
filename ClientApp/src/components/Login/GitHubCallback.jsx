import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { loginWithGitHub } from "../../redux/features/auth/authSlice";
import { fetchUserProfile } from "../../redux/features/users/usersSlice";

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasHandledRef = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (hasHandledRef.current) return;
    hasHandledRef.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = sessionStorage.getItem("github_oauth_state");

    const processGitHubLogin = async () => {
      if (!code) {
        toast.error(t("auth.github.invalidCode"));
        navigate("/login");
        return;
      }

      if (!state || !storedState || state !== storedState) {
        toast.error(t("auth.github.invalidState"));
        sessionStorage.removeItem("github_oauth_state");
        navigate("/login");
        return;
      }

      sessionStorage.removeItem("github_oauth_state");

      try {
        await dispatch(loginWithGitHub({ code, state })).unwrap();
        await dispatch(fetchUserProfile()).unwrap();
        toast.success(t("auth.github.success"));
        navigate("/");
      } catch (error) {
        const message = error?.message || t("auth.github.failure");
        toast.error(message);
        navigate("/login");
      }
    };

    processGitHubLogin();
  }, [dispatch, navigate, searchParams, t]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, var(--color-lightYellow), var(--color-lavender))",
      }}
    >
      {/* Rotating ring animation */}
      <motion.div
        className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "linear",
        }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-mdYellow)] border-t-[var(--color-primary)]"></div>

        <div
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[var(--color-lightYellow)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-6a2 2 0 012-2h6"
            />
          </svg>
        </div>
      </motion.div>

      {/* Text */}
      <div className="mt-8 text-center">
        <p
          className="text-xl font-semibold"
          style={{ color: "var(--color-txt-2)" }}
        >
          {t("auth.github.waitingTitle")}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--color-txt-1)" }}>
          {t("auth.github.waitingSubtitle")}
        </p>
      </div>
    </div>
  );
};

export default GitHubCallback;
