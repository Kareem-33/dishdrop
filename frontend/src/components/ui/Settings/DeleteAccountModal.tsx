import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { X } from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import Input from "../Input";
import Button from "../Button";
import useAuthStore from "../../../stores/useAuthStore";

const DeleteAccountModal = ({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { deleteAccount } = useAuthStore();
  const [confirmText, setConfirmText] = useState("");
  return (
    <div>
      <div
        onClick={() => setShowModal(false)}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-999"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.05, 1] }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        exit={{ scale: 0 }}
        className="bg-card w-[90%] md:w-[400px] rounded-[15px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 max-h-[calc(100vh-125px)] overflow-y-auto"
      >
        <HugeiconsIcon
          icon={X}
          size={22}
          strokeWidth={2}
          className="absolute top-[10px] right-[10px] cursor-pointer opacity-40"
          onClick={() => setShowModal(false)}
        />
        <div className="p-[20px] border-b border-border-default bg-gray-200">
          <h3 className="text-lg font-bold">Delete Account</h3>
          <p className="opacity-60 text-sm">
            This action cannot be undone. Your account and all associated data
            will be permanently deleted.
          </p>
        </div>
        <div className="p-[20px] space-y-[30px]">
          <Input
            type="text"
            label='type "DELETE_MY_ACCOUNT" to confirm'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          <div className="flex items-center gap-[10px]">
            <Button
              variant="primary"
              className="flex-1"
              disabled={confirmText !== "DELETE_MY_ACCOUNT"}
              onClick={() => deleteAccount(confirmText)}
            >
              Delete Account
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteAccountModal;
