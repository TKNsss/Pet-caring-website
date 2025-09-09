import React, { useState } from "react";
import Modal from "react-modal";

const AppointmentModal = ({ isOpen, onRequestClose }) => {
  const [activeTab, setActiveTab] = useState("Images");
  const [compression, setCompression] = useState(80);

  const tabs = ["Images", "Video", "3D Object"];

  const exportOptions = [
    { scale: "1x", color: "sRGB", format: "PNG" },
    { scale: "1x", color: "sRGB", format: "PNG" },
    { scale: "3x", color: "Adobe Co...", format: "JPG" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mx-auto my-20 max-w-[600px] rounded-3xl bg-white shadow-lg outline-none"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      overlayClassName="fixed inset-0 bg-black/40 flex justify-center items-center z-1000"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Sidebar Tabs */}
        <div className="mb-4 w-full space-y-3 border-r-1 border-[#E8E8E8] p-3 pl-3 sm:mb-0 sm:w-1/3 sm:space-y-4 sm:pr-2.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm sm:text-base ${
                activeTab === tab
                  ? "bg-gray-200 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="mt-6 p-2">
            <img
              src="https://via.placeholder.com/100x100.png?text=Robot"
              alt="Robot"
              className="mx-auto rounded-lg"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full sm:w-2/3 px-3 pb-3 sm:p-4">
          <h2 className="font-Poppins mb-4 text-base font-bold">
            Appointment&#40;s&#41;
            <span className="text-red-500">*</span>
          </h2>

          {/* Export Options */}
          {exportOptions.map((opt, index) => (
            <div
              key={index}
              className="mb-3 flex flex-wrap items-center space-x-2 text-sm"
            >
              <select className="rounded border px-2 py-1">
                <option>{opt.scale}</option>
              </select>
              <select className="rounded border px-2 py-1">
                <option>{opt.color}</option>
              </select>
              <div className="flex space-x-1">
                <button
                  className={`rounded px-2 py-1 ${opt.format === "PNG" ? "bg-gray-200" : ""}`}
                >
                  PNG
                </button>
                <button
                  className={`rounded px-2 py-1 ${opt.format === "JPG" ? "bg-gray-200" : ""}`}
                >
                  JPG
                </button>
              </div>
              <button className="ml-auto text-gray-400">−</button>
            </div>
          ))}

          {/* Compression Slider */}
          <div className="mt-6">
            <label className="mb-1 block text-sm font-medium">
              Compression
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={compression}
                onChange={(e) => setCompression(e.target.value)}
                className="w-full"
              />
              <span className="text-sm">{compression}%</span>
            </div>
          </div>

          {/* Export Button */}
          <button className="mt-6 w-full rounded-lg bg-black py-2 text-sm text-white sm:text-base">
            Export Robot 2.0
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentModal;
