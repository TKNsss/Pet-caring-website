import React from "react";
import { useState, useRef, useEffect } from "react";
import { FaPhoneAlt, FaCat, FaSpinner } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdOutlinePets } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import {
  IoSearch,
  IoStarOutline,
  IoStarHalfOutline,
  IoStar,
  IoListCircle,
} from "react-icons/io5";
import { GiTreeBranch } from "react-icons/gi";
import { LuAlarmClock, LuClipboardList } from "react-icons/lu";
import { BsDash } from "react-icons/bs";
import useHorizontalScroll from "../../../hooks/useHorizontalScroll";
import { useDispatch, useSelector } from "react-redux";
import {
  noDataFoundImg,
  fileUploadImg,
  bookingFields,
} from "../../../constants";
import {
  fetchServices,
  selectAllServices,
} from "../../../redux/features/services/servicesSlice";
import Pagination from "../../../shares/Pagination";
import {
  buttonHoverEffect,
  buttonTapEffect,
  buttonTransition,
} from "../../../utils/motions";
import { motion } from "framer-motion";
import { selectCurrentUser } from "../../../redux/features/users/usersSlice";
import {
  fetchSpecies,
  selectAllSpecies,
} from "../../../redux/features/species/speciesSlice";
import {
  selectAllPets,
  fetchPets,
  selectCurrentPet,
  setSelectedPet,
  clearSelectedPet,
  clearPets,
} from "../../../redux/features/pets/petsSlice";
import AppointmentModal from "../AppointmentModal/AppointmentModal";

const renderStars = (rating) => {
  // number of full stars
  const fullStars = Math.floor(rating);
  // half star shows up only if the rating is a decimal >= 0.5. ex: 4.6 -> true, 4.4 -> false
  const halfStar = rating % 1 >= 0.5;
  // total - full - half = empty
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex">
      {/* 
        Array(n) here means that create an array with n empty slots  
        -> [..Array(n)] creates an array with n undefined elements [undefined, undefined,...] -> able to map over it in this case
        => ... operator is used to turn the empty array in to a usable one
      */}
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-500">
          <IoStar />
        </span>
      ))}
      {halfStar && (
        <span className="text-yellow-500">
          <IoStarHalfOutline />
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          <IoStarOutline />
        </span>
      ))}
    </div>
  );
};

const RequestForm = () => {
  const [modalOpen, setModalOpen] = useState(false);
  // data
  const dispatch = useDispatch();
  const services = useSelector(selectAllServices);
  const fetchServicesStatus = useSelector(
    (state) => state.services.fetchStatus,
  );
  const user = useSelector(selectCurrentUser);
  const fetchPetsStatus = useSelector((state) => state.pets.fetchStatus);
  const pets = useSelector(selectAllPets);
  const selectedPet = useSelector(selectCurrentPet);
  const fetchSpecieStatus = useSelector((state) => state.species.fetchStatus);
  const species = useSelector(selectAllSpecies);
  const optionsSources = {
    species: species.map((s) => ({ value: s.spc_id, label: s.spc_name })),
    // ...other dynamic sources
  };
  // pagination (fetch all data)
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);
  const idxOfLastService = currentPage * servicesPerPage;
  const idxOfFirstService = idxOfLastService - servicesPerPage;
  const currentServices = services.slice(idxOfFirstService, idxOfLastService);
  const totalPages = Math.ceil(services.length / servicesPerPage);
  // scrollable effect
  const scrollRef = useRef(null);
  useHorizontalScroll(scrollRef);
  // form handler
  const getInitialFormData = (user, selectedPet) => ({
    fullName: ((user?.firstname || "") + " " + (user?.lastname || "")).trim(),
    phone: user?.phone.trim() || "",
    petName: selectedPet?.petName || "",
    spcId: selectedPet?.spcId || "",
    ageInMonths: selectedPet?.ageInMonths || "",
    weight: selectedPet?.weight,
    gender: selectedPet?.gender || "",
    notes: "",
  });
  const [formData, setFormData] = useState(getInitialFormData(user));

  useEffect(() => {
    setFormData(getInitialFormData(user, selectedPet));
  }, [user, selectedPet]);

  useEffect(() => {
    if (fetchServicesStatus === "idle") dispatch(fetchServices());
    if (fetchSpecieStatus === "idle") dispatch(fetchSpecies());
    if (user && fetchPetsStatus === "idle") dispatch(fetchPets());
    if (!user) dispatch(clearPets());
  }, [dispatch, fetchServicesStatus, fetchSpecieStatus, user, fetchPetsStatus]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className="web-container @container">
      <div className="relative my-8 px-[2.25rem]">
        <form className="grid grid-cols-1 gap-7 @6xl:grid-cols-3">
          {/* Left side: contact us */}
          <div className="md:border-navBorder pl-5 md:mr-15 md:border-r @3xl:mt-20 @7xl:mt-12">
            <h3 className="text-third mb-4 text-2xl font-bold">Contact Us</h3>
            <p className="font-Monserrat mb-4 text-base">
              We’re open for any suggestion or just to have a chat!
            </p>
            <ul className="space-y-3">
              <li className="font-Inter flex items-center font-normal text-[#33363F]">
                <FaPhoneAlt className="text-third mt-1 mr-2 flex-shrink-0 text-base opacity-[62%]" />
                <p className="block text-sm md:inline">
                  <span className="font-bold">Phone:</span> 02135-607-312
                </p>
              </li>
              <li className="font-Inter flex items-center font-normal break-all text-[#33363F]">
                <IoMdMail className="text-third mt-1 mr-2 flex-shrink-0 text-base opacity-[62%]" />
                <p className="block text-sm md:inline">
                  <span className="font-bold">Email:</span>{" "}
                  HappyPetCare@gmail.com
                </p>
              </li>
              <li className="font-Inter flex items-center font-normal text-[#33363F]">
                <FaLocationDot className="text-third mt-1 mr-2 flex-shrink-0 text-base opacity-[62%]" />
                <p className="block text-sm md:inline">
                  <span className="font-bold">Address:</span> Happy Pet Care,
                  151 Sutherland Rd. Brighton, MA
                </p>
              </li>
            </ul>
          </div>

          {/* top middle side: selectors */}
          <div className="bg-lavender absolute -top-20 left-1/2 z-100 -translate-x-1/2 shadow-xl @sm:-top-30">
            <div className="relative flex items-center justify-center gap-3 p-7 text-sm font-semibold text-gray-700 @max-4xl:flex-wrap @4xl:gap-4">
              <div className="flex items-center gap-1 @4xl:self-end @5xl:mb-1">
                <input
                  placeholder="Find services here"
                  type="text"
                  className="border-third border-b-2 px-3 py-2 focus:outline-none"
                />

                <button className="bg-third border-third scale-item border-b p-2 hover:bg-purple-800 @4xl:hidden">
                  <IoSearch className="text-xl text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pet-selector"
                  className="flex items-center text-sm @max-md:text-center"
                >
                  Select pets &#40;
                  <FaCat className="mx-0.5 text-sm" />
                  &#41; :
                </label>

                <div className="flex items-center">
                  <select
                    id="pet-selector"
                    className="cursor-pointer rounded border bg-transparent px-3 py-2"
                    value={selectedPet?.petId || ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "") {
                        dispatch(clearSelectedPet());
                      } else {
                        dispatch(setSelectedPet(parseInt(value)));
                      }
                    }}
                  >
                    <option value="">Select you pets</option>

                    {fetchPetsStatus === "pending" && (
                      <option disabled value="">
                        Loading Pets...
                      </option>
                    )}

                    {fetchPetsStatus !== "pending" && !pets.length ? (
                      <option disabled value="">
                        No pets found ❌
                      </option>
                    ) : (
                      pets.map((pet) => (
                        <option key={pet.petId} value={pet.petId}>
                          {pet.petName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-center gap-0.5 @max-md:gap-3 @md:flex-row @5xl:mr-4">
                {/* Start Date */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="start-date"
                    className="text-sm @max-md:text-center"
                  >
                    Start Date:
                  </label>

                  <input
                    id="start-date"
                    name="start-date"
                    type="date"
                    className="cursor-pointer rounded border px-3 py-2 text-sm focus:ring-1 focus:ring-gray-600 focus:outline-none"
                  />
                </div>

                {/* dash */}
                <BsDash className="mb-1.5 hidden text-2xl @md:inline-block @md:self-end" />

                {/* Start Time */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="start-time"
                    className="text-sm @max-md:text-center"
                  >
                    Start Time:
                  </label>

                  <select
                    id="start-time"
                    className="cursor-pointer rounded border px-3 py-2 text-sm focus:ring-1 focus:ring-gray-600 focus:outline-none"
                  >
                    <option value="">Select a time</option>
                    <option value="09:10">🟢09:10</option>
                    <option value="09:20">🟢09:20</option>
                    <option value="09:35">🟢09:35</option>
                    <option value="09:45">🟢09:45</option>
                    <option value="10:10">🟢10:10</option>
                    <option value="10:20">🟢10:20</option>
                    <option value="10:35">🟢10:35</option>
                    <option value="10:45">🟢10:45</option>
                  </select>
                </div>
              </div>

              <button className="bg-third border-third scale-item group -mr-15 hidden border-b p-6 hover:bg-purple-700 @4xl:inline-block">
                <IoSearch className="transform-all text-xl text-white duration-400 group-hover:rotate-360" />
              </button>
            </div>
          </div>

          {/* Right side: form */}
          <div className="space-y-6 md:col-span-2">
            {/* Select Services */}

            <h3 className="text-third mt-42 mb-6 text-center text-2xl font-bold @md:mt-20 @3xl:text-left @7xl:mt-12">
              Request Services
            </h3>

            <p className="font-Monserrat mb-8 text-center text-base @3xl:text-left">
              Please select any services you’re interested in and fill out the
              form
            </p>

            {/* Services section */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-Monserrat text-base font-bold">
                  Select Service(s)<span className="text-red-500">*</span>:
                </h3>

                <button
                  type="button"
                  className="relative cursor-pointer"
                  onClick={() => setModalOpen(true)}
                >
                  <IoListCircle className="text-third text-4xl hover:text-purple-800" />
                  <span className="absolute -top-0.5 -right-1 hidden rounded-full bg-red-500 px-1.5 py-0.5 text-[0.625rem] font-semibold text-white">
                    0
                  </span>
                </button>
              </div>

              <div
                className="flex gap-6 overflow-x-auto scroll-smooth p-3 sm:max-h-180 sm:flex-col sm:flex-wrap sm:overflow-y-auto"
                ref={scrollRef}
              >
                {fetchServicesStatus === "pending" && (
                  <FaSpinner className="text-third mx-auto animate-spin text-5xl" />
                )}

                {fetchServicesStatus !== "pending" && !services.length ? (
                  <div className="flex w-full justify-center">
                    <img
                      src={noDataFoundImg}
                      className="shadow-custom-1 w-4/6"
                    />
                  </div>
                ) : (
                  currentServices.map((service, idx) => (
                    <div
                      className="shadow-custom-1 flex w-70 flex-none flex-col justify-between rounded-lg bg-white sm:w-140 sm:flex-row"
                      key={service?.serviceId || idx}
                    >
                      {/* Hotel Image */}
                      <div className="flex w-full items-center justify-center pt-4 sm:w-1/3 sm:pt-0 sm:pl-4">
                        {service?.serviceImgUrl ? (
                          <img
                            src={service?.serviceImgUrl} // Replace with real image
                            alt="service_img"
                            className="max-h-45 object-contain shadow-lg sm:h-45 sm:max-h-none sm:w-full"
                            title={`${service?.serviceName || "Service Image"}`}
                          />
                        ) : (
                          <img
                            src={fileUploadImg}
                            alt="no-data"
                            className="h-full max-h-45 w-full object-contain sm:max-h-none"
                            title="No image available"
                          />
                        )}
                      </div>

                      {/* Service Details */}
                      <div className="w-full p-4 sm:w-2/3">
                        {/* Title + Rating */}
                        <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row">
                          <div className="font-Inter">
                            <h2
                              className="font-Inter cursor-default text-base font-semibold text-black sm:max-w-42 sm:truncate sm:text-lg"
                              title={service?.serviceName || "Service Title"}
                            >
                              {service?.serviceName || "Service Title"}
                            </h2>
                            <a
                              href="#"
                              className="text-third hover:text-primary flex items-center gap-1 text-sm underline"
                            >
                              <MdOutlinePets />
                              {service?.serviceType || "Service Type"}
                            </a>
                            <p className="font-Inter mt-1 text-xs text-gray-400">
                              {service?.isActive
                                ? "(available) ✅"
                                : "(unavailable) ❌"}
                            </p>
                          </div>

                          <div className="text-center sm:text-right">
                            <div className="flex items-center justify-center sm:justify-end">
                              <span className="text-md mr-1.5 text-yellow-500">
                                {renderStars(service?.ratingStars || 0)}
                              </span>
                              <GiTreeBranch className="rotate-180" />
                              <div className="bg-third rounded px-2 py-1 text-sm font-bold text-white">
                                {service?.ratingStars.toFixed(1) || "0.0"}
                              </div>
                              <GiTreeBranch className="-scale-x-100 rotate-180 transform" />
                            </div>
                            <a
                              href="#"
                              className="text-third mt-1 inline-block text-xs underline sm:mr-3"
                            >
                              {service?.ratingCount || 0} reviews
                            </a>
                          </div>
                        </div>

                        {/* Price and Availability */}
                        <div className="border-t border-gray-200 pt-3">
                          <div
                            className="font-Inter mb-2 line-clamp-2 max-w-80 cursor-default space-y-1 text-sm text-gray-700"
                            title={
                              service?.desc || "Service description goes here."
                            }
                          >
                            {service?.desc || "Service description goes here."}
                          </div>

                          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
                            <div>
                              <p className="font-Inter flex items-center gap-1 text-sm font-medium text-green-600">
                                <LuAlarmClock />
                                {service?.minDuration === service?.maxDuration
                                  ? `${service?.minDuration || service?.maxDuration || "Delivery"}`
                                  : `${service?.minDuration || "min"} - ${service?.maxDuration || "max"}`}
                              </p>
                              <p className="font-Inter mt-1 text-lg font-bold text-green-700">
                                ${service?.minPrice || "min price"} - $
                                {service?.maxPrice || "max price"}
                              </p>
                              <p className="font-Inter text-sm text-gray-500">
                                Per pet
                              </p>
                            </div>
                            <button className="font-Inter bg-third w-full cursor-pointer self-end rounded px-4 py-2 text-sm text-white hover:bg-purple-800 sm:w-auto">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {services.length > 0 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {bookingFields.map((field) => {
                if (field.type === "select") {
                  const options = Array.isArray(field.options)
                    ? field.options
                    : optionsSources[field.options];
                  // Pet Type
                  return (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="font-Monserrat mb-1 block text-sm font-bold"
                      >
                        {field.label}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleFormChange}
                        required
                        className="focus:ring-third w-full border border-[#D9D9D9] px-3 py-2 text-sm shadow-lg focus:ring-2 focus:outline-none"
                      >
                        <option value="">
                          Select {field.label.toLowerCase()}
                        </option>
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="font-Monserrat mb-1 block text-sm font-bold"
                      >
                        {field.label}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        id={field.name}
                        name={field.name}
                        onChange={handleFormChange}
                        value={formData.notes}
                        className="focus:ring-third h-18 w-full resize-none border border-[#D9D9D9] px-3 py-2 text-sm shadow-lg focus:ring-2 focus:outline-none"
                        placeholder="Write notes..."
                      />
                    </div>
                  );
                }

                // Default: input
                return (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="font-Monserrat mb-1 block text-sm font-bold"
                    >
                      {field.label}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleFormChange}
                      required
                      type={field.type}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      placeholder={`Enter ${field.label}`}
                      className="focus:ring-third w-full border border-[#D9D9D9] px-3 py-2 text-sm shadow-lg focus:ring-2 focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>

            {/* add to list button */}
            <motion.button
              className="font-chewy bg-third flex cursor-pointer items-center justify-center gap-1 rounded-full px-8 py-2 text-sm tracking-wider text-white hover:bg-purple-800 @max-3xl:w-full @sm:text-base @3xl:justify-self-center"
              whileHover={buttonHoverEffect}
              whileTap={buttonTapEffect}
              transition={buttonTransition}
              type="button"
            >
              Add to your list
              <LuClipboardList className="text-xl" />
            </motion.button>
          </div>

          <AppointmentModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
          />
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
