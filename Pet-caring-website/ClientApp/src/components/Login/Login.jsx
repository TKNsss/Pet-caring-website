import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginImg, catLoginImg } from "../../constants";
import { FcGoogle } from "react-icons/fc";
import { useMediaQueryContext } from "../../hooks/MediaQueryProvider";
import { Link } from "react-router-dom";
const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const isDesktop = useMediaQueryContext();
  const formAnimation = isDesktop
    ? { x: isRegistering ? "100%" : "0%" }
    : { x: 0 };

  return (
    <div className="bg-lavender flex min-h-screen items-center justify-center p-4">
      <div className="relative flex max-h-[40.625rem] w-full max-w-4xl bg-white shadow-lg">
        {/* Animated Form Section */}
        <motion.div
          className={`relative mr-auto w-full ${isRegistering ? "p-5 py-4" : "p-8"} md:w-1/2`}
          initial={{ x: 0 }}
          animate={formAnimation}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="absolute -top-43 -left-5 md:hidden">
            <img src={catLoginImg} className="h-70 w-70" />
          </div>

          <h2
            className={`text-third relative text-center ${isRegistering ? "md:text-2xl" : "md:text-3xl"} text-2xl font-semibold tracking-wider`}
          >
            {isRegistering ? "Create Your Account" : "Welcome Back"}
          </h2>

          <form className={`${isRegistering ? "mt-4" : "mt-6"}`}>
            {isRegistering && (
              <div>
                <label className="block text-gray-700">User name</label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  className="log-input"
                />
              </div>
            )}

            <div className="mt-4">
              <label className="block text-gray-700">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="log-input"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="log-input"
              />
            </div>

            {isRegistering && (
              <div className="mt-4">
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="log-input"
                />
              </div>
            )}

            <div className="mt-4 flex items-center">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Show password
              </label>
            </div>

            <button
              type="submit"
              className={`bg-third hover:bg-primary ${isRegistering ? "mt-4" : "mt-6"} w-full cursor-pointer rounded-lg py-3 font-medium text-white transition`}
            >
              {isRegistering ? "Register" : "Sign In"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Social Signup */}
          <div className="mt-4">
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border p-2 font-medium transition hover:bg-gray-100">
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
    </div>
  );
};

export default Login;
