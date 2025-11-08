import React, { useState, useEffect } from "react";
import { ductTape1, ductTape2, petFields, circle } from "../../../../constants";
import { FaSpinner } from "react-icons/fa";
import {
  fetchSpecies,
  selectAllSpecies,
} from "../../../../redux/features/species/speciesSlice";
import {
  addPet,
  clearSelectedPet,
  deletePet,
  selectCurrentPet,
  selectCurrentPetId,
  setSelectedPet,
  updateSinglePet,
  uploadPetImage,
} from "../../../../redux/features/pets/petsSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DeletePetModal from "../DeletePetModal/DeletePetModal";

const PetCard = () => {
  const dispatch = useDispatch();
  // species
  const species = useSelector(selectAllSpecies);
  const fetchSpecieStatus = useSelector((state) => state.species.fetchStatus);
  // select specific pet data
  const selectedPet = useSelector(selectCurrentPet);
  // features status
  const addStatus = useSelector((state) => state.pets.addStatus);
  const updateStatus = useSelector((state) => state.pets.updateStatus);
  const deleteStatus = useSelector((state) => state.pets.deleteStatus);
  const uploadPetImgStatus = useSelector(
    (state) => state.pets.uploadPetImgStatus,
  );
  const selectedPetId = useSelector(selectCurrentPetId);
  // states
  const getInitialFormData = (selectedPet = {}) => ({
    petName: selectedPet?.petName || "",
    adoptDate: selectedPet?.adoptDate
      ? selectedPet?.adoptDate.slice(0, 10)
      : "",
    ageInMonths: selectedPet?.ageInMonths || "",
    spcId: selectedPet?.spcId || "",
    breed: selectedPet?.breed || "",
    gender: selectedPet?.gender || "",
    weight: selectedPet?.weight || "",
    status: selectedPet?.status || "",
    notes: selectedPet?.notes || "",
    avatarUrl: selectedPet?.avatarUrl || "",
  });
  const [formData, setFormData] = useState(getInitialFormData(selectedPet));
  const [disable, setDisable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [petImg, setPetImg] = useState(selectedPet?.avatarUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (fetchSpecieStatus === "idle") dispatch(fetchSpecies());
  }, [dispatch, fetchSpecieStatus]);

  useEffect(() => {
    setFormData(getInitialFormData(selectedPet || {}));
  }, [selectedPet]);

  const handleInputValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("petName", formData.petName);
    formDataToSend.append("adoptDate", formData.adoptDate || "");
    formDataToSend.append("ageInMonths", formData.ageInMonths);
    formDataToSend.append("spcId", formData.spcId || "");
    formDataToSend.append("breed", formData.breed);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("status", formData.status || "");
    formDataToSend.append("notes", formData.notes || "");

    if (petImg) {
      if (typeof petImg === "string") {
        formDataToSend.append("avatarUrl", petImg); // URL upload
      } else {
        formDataToSend.append("avatarImg", petImg); // File upload
      }
    }

    try {
      await dispatch(addPet(formDataToSend)).unwrap();
      resetForm("clear");
    } catch (err) {
      toast.error("Add new pet failed.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedPet) {
      toast.warning("Please select a Pet to update!");
      return;
    }

    if (formData.ageInMonths === "" || formData.weight === "") {
      toast.warning(
        "Age and Weight cannot be empty. Please provide valid values.",
      );
      resetForm("initialPetData");
      return;
    }

    const normalizedFormData = {
      ...formData,
      // this field in BE is Datetime so it'd be null or has value
      adoptDate: formData.adoptDate === "" ? null : formData.adoptDate,
      spcId: formData.spcId === "" ? null : parseInt(formData.spcId),
    };

    const updatePetData = Object.entries(normalizedFormData).reduce(
      (acc, [key, value]) => {
        // treat "" as no change for strings
        if (typeof value === "string" && value.trim() === "") {
          return acc;
        }

        if (value != selectedPet[key] && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    if (Object.keys(updatePetData).length === 0) {
      toast.info("No changes made to the profile.");
      resetForm("initialPetData");
      return;
    }

    try {
      const response = await dispatch(
        updateSinglePet({
          petId: selectedPet.petId,
          petData: normalizedFormData,
        }),
      ).unwrap();

      setSelectedPet(response.data);
      setDisable(true);
    } catch (err) {
      toast.error("Update pet profile failed.");
      console.log(err);
      setDisable(true);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePet(selectedPet.petId)).unwrap();
      setShowModal(false);
      resetForm("clear");
    } catch (err) {
      toast.error("Delete pet failed.");
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPetImg(e.target.files[0]);
    }
  };

  const handleImgUrlUpload = () => {
    let petImgUrl = formData["avatarUrl"];

    if (!petImgUrl.trim()) return;

    try {
      // regular expression '.test()' method
      const isImage = /\.(jpeg|jpg|png)$/i.test(petImgUrl);

      if (!petImgUrl.startsWith("https") || isImage) {
        toast.warning(
          "Please enter a valid image URL (only accepts jpeg|jpg|png).",
        );
      }
      setPetImg(petImgUrl);
    } catch (err) {
      toast.error("Invalid image URL.");
    }
  };

  const handleUploadPetImage = async (e) => {
    const file = e.target?.files?.[0];

    if (!selectedPetId) {
      toast.warning("Please select a pet to upload image!");
      return;
    }

    if (!file) {
      toast.warning("No image selected!");
      return;
    }

    const formData = new FormData();
    formData.append("img", file);
    formData.append("petId", selectedPet.petId);

    try {
      await dispatch(uploadPetImage(formData)).unwrap();
    } catch (err) {
      toast.error("Failed to upload pet image!");
    }
  };

  const resetForm = (resetType) => {
    if (resetType === "clear") {
      setFormData(getInitialFormData(null));
      if (petImg) setPetImg(null);
      if (selectedPetId) dispatch(clearSelectedPet());
    } else if ((resetType = "initialPetData")) {
      setFormData(getInitialFormData(selectedPet));
    }

    if (!disable) setDisable(true);
  };

  return (
    <div className="mx-auto max-w-[810px] rounded-lg border border-gray-200 bg-white p-6 font-sans shadow-lg @lg:flex @lg:justify-between @lg:gap-8">
      <form onSubmit={handleCreate}>
        <p
          className="my-5 text-base font-semibold @sm:text-xl @sm:tracking-[0.17em] @xl:text-2xl"
          id="pet-care-form"
        >
          PET CARE FORM
        </p>

        {/* Name */}
        <div className="flex flex-col items-center justify-between @max-xl:mb-1.5 @max-xl:gap-1 @3xl:flex-row">
          <div className="flex items-center gap-3 @max-xl:self-start">
            <label className="pet-form-label block">NAME</label>
            <input
              name="petName"
              type="text"
              placeholder="pet's name"
              onChange={handleInputValueChange}
              value={formData.petName}
              required
              className="pet-form-input h-15 w-full p-2 @xl:text-4xl"
            />
          </div>

          <div className="font-OoohBaby text-center font-semibold text-gray-500 @xl:min-w-[180px]">
            <p className="text-base @sm:text-xl">Photo or Drawing</p>
            <p className="text-base @sm:text-xl">w77 x h60 (mm)</p>
          </div>
        </div>

        {/* Image and Size Note */}
        <div className="mb-6 flex flex-col items-center justify-center gap-4 rounded-lg border-3 border-dotted border-gray-300 px-4 py-5">
          <div className="shadow-custom-1 relative flex -rotate-2 transform items-center justify-center p-3 @lg:h-62 @lg:w-62">
            <div className="absolute -top-3 -right-3 z-1 @lg:-top-5 @lg:-right-5">
              <img src={ductTape1} className="h-10 w-10 @lg:h-20 @lg:w-20" />
            </div>

            {selectedPet?.avatarUrl ? (
              <div className="h-full w-full">
                <img
                  src={selectedPet.avatarUrl}
                  alt="pet-image"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div>
                <div
                  className="mx-auto h-30 w-30 @max-lg:mx-auto @max-md:h-25 @max-md:w-25 @lg:h-35 @lg:w-35"
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!petImg) setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    // drag and drop work with dataTransfer
                    const file = e.dataTransfer.files?.[0];
                    if (file) setPetImg(file);
                  }}
                >
                  <label
                    htmlFor="pet-image-upload"
                    className={`${uploadPetImgStatus === "pending" && "points-event-none"} ${isDragging ? "border-third text-third" : "border-gray-300 text-gray-400 hover:bg-black/10"} ${!petImg && "cursor-pointer"} inset-0 flex h-full items-center justify-center border-3 border-dashed transition duration-200`}
                  >
                    {petImg ? (
                      <div className="relative h-full w-full">
                        <img
                          src={
                            typeof petImg === "string"
                              ? petImg
                              : URL.createObjectURL(petImg)
                          }
                          alt="pet-image"
                          className="h-full w-full object-cover"
                        />
                        {/* Optional remove button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent bubbling to <label>
                            e.preventDefault(); // Prevent default label->input click
                            setPetImg(null);
                          }}
                          className="absolute top-2 right-2 z-1000 cursor-pointer rounded-full bg-white/80 px-2 py-1 text-xs text-red-500 shadow hover:bg-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="px-2.5 py-5 text-center text-[0.625rem] font-medium @md:py-9 @lg:text-base">
                        {uploadPetImgStatus === "pending" ? (
                          <FaSpinner className="text-ink mx-auto animate-spin text-3xl" />
                        ) : (
                          "Drag & Drop or Click to Upload"
                        )}
                      </span>
                    )}

                    {!petImg && (
                      <input
                        id="pet-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    )}
                  </label>
                </div>

                <div className="relative mt-1">
                  <label
                    htmlFor="pet-image-url"
                    className="text-[0.625rem] @lg:text-sm"
                  >
                    Or upload from an URL
                  </label>
                  <input
                    id="pet-image-url"
                    type="text"
                    name="avatarUrl"
                    onChange={handleInputValueChange}
                    value={formData["avatarUrl"]}
                    placeholder="https://example.com/pet.jpg"
                    className="log-input mt-1 rounded-sm border-gray-400 pr-15 text-xs @lg:text-sm"
                  />
                  <button
                    className="hover:bg-third border-third text-third absolute right-1 bottom-1 cursor-pointer rounded-sm border px-2 py-1 text-[0.625rem] hover:text-white @lg:text-xs"
                    onClick={handleImgUrlUpload}
                    type="button"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}

            <div className="tranform absolute bottom-0 -left-4 rotate-40 @lg:-left-7">
              <img src={ductTape2} className="w-13 @lg:w-23" />
            </div>
          </div>

          {selectedPet?.avatarUrl && (
            <label className="mt-2 cursor-pointer text-sm text-blue-500 hover:underline">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPetImage}
                className={`${uploadPetImgStatus === "pending" && "pointer-events-none"} hidden`}
              />
              {uploadPetImgStatus === "pending" ? (
                <FaSpinner className="mx-auto animate-spin text-blue-500" />
              ) : (
                "Upload Image"
              )}
            </label>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 border-t-6 border-[#e5e5e5] @4xl:grid-cols-2">
          {petFields
            .filter(
              (field) => field.name !== "petName" && field.name !== "notes",
            )
            .map((field) => {
              const isSelect =
                field.name === "spcId" || field.name === "gender";
              const genders = ["Male", "Female"];
              const isStatus = field.name === "status";

              const verifyInputType = () => {
                if (field.name === "weight" || field.name === "ageInMonths")
                  return "number";

                if (field.name === "adoptDate") return "date";

                return "text";
              };

              return (
                <div
                  key={field.name}
                  className={`${isStatus ? "@4xl:col-span-2" : ""} flex flex-col border-t-2 border-gray-300 py-1.5 first:border-none @xl:flex-row @xl:items-center @xl:gap-5 @4xl:px-3 @4xl:[&:nth-child(2)]:border-none`}
                >
                  <label className={`pet-form-label block min-w-[80px]`}>
                    {field.label}
                  </label>
                  {isSelect ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputValueChange}
                      className="pet-form-input w-full rounded border border-gray-300 p-2"
                      required={field.name === "gender"}
                    >
                      <option disabled value="" className="font-semibold">
                        Select {field.label.toLowerCase()}
                      </option>
                      {field.name === "gender" &&
                        genders.map((gender) => (
                          <option
                            key={gender}
                            value={gender}
                            className="font-semibold"
                          >
                            {gender}
                          </option>
                        ))}

                      {field.name === "spcId" &&
                        (fetchSpecieStatus === "pending" ? (
                          <option disabled>Loading species...</option>
                        ) : fetchSpecieStatus === "rejected" ? (
                          <option disabled>❌ No species found</option>
                        ) : (
                          species.map((specie) => (
                            <option
                              key={specie.spc_id}
                              value={specie.spc_id}
                              className="font-semibold"
                            >
                              {specie.spc_name}
                            </option>
                          ))
                        ))}
                    </select>
                  ) : isStatus ? (
                    <div className="flex flex-col @max-md:items-center @md:flex-row @md:gap-4">
                      {["Spayed", "Neutered", "None"].map((option) => (
                        <label
                          key={option}
                          className="custom-radio-btn relative flex cursor-pointer items-center gap-1 pr-3 tracking-widest text-gray-400 last:border-none @md:border-r-2"
                        >
                          <input
                            type="radio"
                            name="status"
                            value={option}
                            checked={formData.status === option}
                            onChange={handleInputValueChange}
                            className="hidden"
                          />
                          {option}
                          <img
                            src={circle}
                            className="checkmark absolute left-1/2 w-8 -translate-x-1/2 transform"
                          />
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={verifyInputType()}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputValueChange}
                      min={
                        field.name === "ageInMonths"
                          ? 1
                          : field.name === "weight"
                            ? 0.1
                            : undefined
                      }
                      max={
                        field.name === "ageInMonths"
                          ? 300
                          : field.name === "weight"
                            ? 100
                            : undefined
                      }
                      step={field.name === "weight" ? 0.1 : undefined}
                      required={["ageInMonths", "weight"].includes(field.name)}
                      placeholder={`pet's ${field.label.toLowerCase()}`}
                      className="pet-form-input w-full rounded border border-gray-300 p-2"
                    />
                  )}
                </div>
              );
            })}
        </div>

        {/* Notes */}
        <div className="items-baseline border-t-2 border-gray-300 pt-1.5 @xl:flex @xl:gap-5 @4xl:px-3">
          <label className="pet-form-label min-w-[80px]">Pet's note</label>
          <textarea
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleInputValueChange}
            placeholder="Write some notes for your pet"
            className="pet-form-input bg-vintageGraphPaper h-25 w-full resize-none rounded p-2 text-2xl"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4 @max-2xl:flex-col">
          <button
            type="submit"
            disabled={selectedPet}
            className={`${addStatus === "pending" && "pointer-events-none"} ${selectedPet ? "cursor-not-allowed bg-gray-300" : "cursor-pointer bg-blue-500 hover:bg-blue-600"} rounded-md px-4 py-2 text-white`}
          >
            {addStatus === "pending" ? (
              <FaSpinner className="mx-auto animate-spin text-white" />
            ) : (
              "Add New"
            )}
          </button>
          <button
            onClick={() => {
              if (disable) {
                setDisable(false);
              } else {
                resetForm("initialPetData");
              }
            }}
            type="button"
            className="cursor-pointer rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          >
            {disable ? "Update" : "Cancel"}
          </button>
          <button
            type="button"
            disabled={disable}
            onClick={handleUpdate}
            className={`${updateStatus === "pending" && "pointer-events-none"} rounded-md px-4 py-2 text-white ${disable ? "cursor-not-allowed bg-gray-300" : "cursor-pointer bg-green-400 hover:bg-green-500"}`}
          >
            {updateStatus === "pending" ? (
              <FaSpinner className="mx-auto animate-spin text-white" />
            ) : (
              "Save"
            )}
          </button>
          <button
            onClick={() => {
              if (selectedPetId) {
                setShowModal(true);
              } else {
                toast.warning("Please select a pet to delete");
              }
            }}
            type="button"
            className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => resetForm("clear")}
            type="button"
            className="cursor-pointer rounded-md bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="hidden max-w-10 flex-col items-center justify-center gap-30 @lg:flex">
        <div className="flex flex-col gap-20">
          <div className="bg-profileSecondary shadow-custom-2 h-8 w-8 rounded-full"></div>
          <div className="bg-profileSecondary shadow-custom-2 h-8 w-8 rounded-full"></div>
          <div className="bg-profileSecondary shadow-custom-2 h-8 w-8 rounded-full"></div>
        </div>

        <div className="w-28 rotate-90 text-gray-500">Happy Pet Care</div>

        <div className="flex flex-col gap-20">
          <div className="bg-profileSecondary shadow-custom-2 h-8 w-8 rounded-full"></div>
          <div className="bg-profileSecondary shadow-custom-2 h-8 w-8 rounded-full"></div>
          <div className="bg-profileSecondary shadow-custom-2 h-8 w-8 rounded-full"></div>
        </div>
      </div>

      <DeletePetModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDelete}
        deleteStatus={deleteStatus}
      />
    </div>
  );
};

export default PetCard;
