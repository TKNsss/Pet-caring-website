import { React, useEffect } from "react";
import { BsFillPatchPlusFill, BsArrowThroughHeart } from "react-icons/bs";
import { petColorPalettes, noDataFoundImg, fileUploadImg } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllPets,
  fetchPets,
  setSelectedPet,
} from "../../../redux/features/pets/petsSlice";

const PetProfile = ({ section, setSection }) => {
  const dispatch = useDispatch();
  const pets = useSelector(selectAllPets);
  const fetchStatus = useSelector((state) => state.pets.fetchStatus);

  useEffect(() => {
    if (fetchStatus === "idle") dispatch(fetchPets());
  }, [dispatch, fetchStatus]);

  const handleTogglePetForm = () => {
    if (section !== "My Pets") setSection("My Pets");

    setTimeout(() => {
      const el = document.getElementById("pet-care-form");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100); // slight delay to ensure content is rendered
  };

  const getRandomColor = () => {
    return petColorPalettes[
      Math.floor(Math.random() * petColorPalettes.length)
    ];
  };

  const formatPetAge = (ageInMonths) => {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    if (years === 0) return `${months} mth${months !== 1 ? "s" : ""}/o`;
    if (months === 0) return `${years} yr${years !== 1 ? "s" : ""}/o`;

    return `${years} yr${years !== 1 ? "s" : ""}/o and ${months} mth${months !== 1 ? "s" : ""}/o`;
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-md @xl:p-6">
      <div className="mb-4 flex flex-col items-center justify-between gap-1 @md:flex-row">
        <p className="text-third text-lg font-bold @max-md:text-center">
          Here's your lovely pets
        </p>
        <button
          className="scale-item hover:rotate-180"
          onClick={handleTogglePetForm}
        >
          <BsFillPatchPlusFill className="text-third text-3xl" />
        </button>
      </div>

      {!pets.length ? (
        <div className="flex w-full justify-center">
          <img src={noDataFoundImg} className="w-5/6" />
        </div>
      ) : (
        <ul className="space-y-4">
          {pets.map((pet) => (
            <li
              key={pet.pet_id}
              className="bg-pet flex flex-col items-center justify-between rounded-lg p-4 @max-xl:gap-3 @xl:flex-row"
            >
              <div className="flex flex-col items-center gap-5 @xl:flex-row">
                {pet?.avatar_url ? (
                  <img
                    src={pet.avatar_url}
                    alt="pet-image"
                    className="h-15 w-15 rounded-full"
                  />
                ) : (
                  <img
                    src={fileUploadImg}
                    alt="pet-image"
                    className="h-15 w-15 rounded-full"
                  />
                )}

                <div>
                  <h4 className="mb-1.5 font-bold @lg:text-center @xl:text-left">
                    {pet.pet_name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      formatPetAge(pet.age_in_months),
                      `${pet.weight} kg`,
                      pet.gender,
                      pet.breed, // this can be null/undefined
                    ]
                      .filter(Boolean) // removes null/undefined values (like breed if it's null)
                      .map((item, index) => (
                        <span
                          key={index}
                          className={`text-white ${getRandomColor()} rounded-2xl px-2.5 py-1 text-sm font-semibold`}
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end text-right">
                <button
                  className="text-third cursor-pointer text-xl"
                  onClick={() => {
                    handleTogglePetForm();
                    dispatch(setSelectedPet(pet.pet_id));
                  }}
                >
                  <BsArrowThroughHeart className="scale-item text-2xl hover:rotate-45" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PetProfile;
