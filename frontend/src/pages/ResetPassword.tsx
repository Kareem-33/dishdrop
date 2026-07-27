import { useEffect, useState } from "react";
import SettingCard from "../components/ui/Settings/SettingCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useAuthStore from "../stores/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { resetPassword } = useAuthStore();

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    resetPassword({
      resetPasswordToken: searchParams.get("token") as string,
      newPassword,
      confirmPassword,
    });
  };

  useEffect(() => {
    if (!searchParams.get("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px] space-y-[35px] md:px-[365px]">
        <SettingCard title="Reset password">
          <Input
            label="New password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex flex-col gap-[5px]">
            <Button
              variant="primary"
              className="w-fit"
              disabled={!newPassword || !confirmPassword}
              onClick={handleSubmit}
            >
              Change password
            </Button>
          </div>
        </SettingCard>
      </div>
    </div>
  );
};

export default ResetPassword;
