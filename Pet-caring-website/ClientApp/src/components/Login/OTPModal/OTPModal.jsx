import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const OTPModal = ({
  isOpen,
  onRequestClose,
  onSubmit,
  onForgotPassword,
  purpose,
}) => {
  // An array of 6 strings to hold the OTP digits.
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  // holding references to each input field
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    // Only allows numeric input
    if (!/^\d*$/.test(value)) return;

    // copy the old otp array
    const newOtp = [...otp];
    // update/set value for specific index
    newOtp[index] = value;
    setOtp(newOtp);

    // If a value is entered and it's not the last field, move focus to the next one.
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    // Auto-submit when all digits are filled
    if (newOtp.every((digit) => digit !== "")) {
      setTimeout(() => {
        handleSubmit(newOtp.join("")); // Automatically submit OTP when it's fully entered
      }, 100);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (otpValue = otp.join("")) => {
    setLoading(true); // Start loading

    try {
      const result = await onSubmit(otpValue);
      setLoading(false);

      if (result) {
        onRequestClose(); // ✅ only close modal if OTP is correct
      }
    } catch (error) {
      setLoading(false); // Stop loading if there was an error
      toast.error("OTP verification failed.");
    }
  };

  const IsForgotPassword = () => {
    return purpose === "forgot-password" ? (
      <div className="text-center">
        <button
          onClick={async () => {
            setSendingOtp(true);
            try {
              await onForgotPassword();
            } catch (error) {
              toast.error("Failed to send OTP.");
            }
            setSendingOtp(false); // Reset after the request is complete
          }}
          className={`font-Poppins rounded-md bg-blue-500 px-3 py-2 text-sm text-white transition hover:bg-blue-600 ${sendingOtp ? "points-event-none" : "cursor-pointer"}`}
        >
          {sendingOtp ? (
            <FaSpinner className="animate-spin text-white" />
          ) : (
            "Send OTP"
          )}
        </button>
      </div>
    ) : null;
  };

  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(6).fill(""));
      inputsRef.current[0]?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Enter OTP"
      className="mx-auto mt-40 rounded-xl bg-white p-6 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/40 flex justify-center items-center"
    >
      <h2 className="mb-4 text-center text-xl font-semibold">Enter OTP</h2>
      <div className="mb-6 flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            maxLength="1"
            className="focus:outline-third h-12 w-10 rounded-md border border-gray-300 text-center text-lg"
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>

      {/* Show loading spinner when the form is submitting */}
      {loading ? (
        <div className="my-4 flex justify-center">
          <FaSpinner className="text-secondary animate-spin text-xl" />
        </div>
      ) : (
        <IsForgotPassword />
      )}
    </Modal>
  );
};

export default OTPModal;
