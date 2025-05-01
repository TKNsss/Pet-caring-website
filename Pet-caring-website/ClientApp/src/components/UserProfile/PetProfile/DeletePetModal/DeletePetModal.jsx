import React from "react";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";

const DeletePetModal = ({ isOpen, onCancel, onConfirm, deleteStatus }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Delete Pet Confirmation"
      className="mt-40 rounded-xl bg-white p-6 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/40 flex justify-center items-center"
    >
      <h2 className="mb-4 text-center text-xl font-semibold tracking-wide">
        Do you want to delete this pet?
      </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="cursor-pointer rounded-md bg-gray-300 px-4 py-2 text-black transition hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-third cursor-pointer rounded-md px-4 py-2 text-white transition hover:bg-purple-600"
        >
          {deleteStatus === "pending" ? (
            <FaSpinner className="mx-auto animate-spin text-white" />
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default DeletePetModal;
