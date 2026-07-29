import { useState } from "react";
import SettingCard from "../components/ui/Settings/SettingCard";
import Button from "../components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trash2, Upload01FreeIcons } from "@hugeicons/core-free-icons";
import Input from "../components/ui/Input";
import useAuthStore from "../stores/useAuthStore";
import toast from "react-hot-toast";
import DeleteAccountModal from "../components/ui/Settings/DeleteAccountModal";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Settings = () => {
  const {
    loading,
    user,
    updateNameEmailAvatar,
    updatePassword,
    sendResetPasswordEmail,
    sendVerificationEmail,
  } = useAuthStore();

  const [avatar, setAvatar] = useState<string | undefined>(user!.avatar || "");

  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // const [selectedUnits, setSelectedUnits] = useState("metric");
  // const [activeNotifications, setActiveNotifications] = useState({
  //   updates: true,
  //   marketing: true,
  // });

  const handleChangeNameEmailAvatar = () => {
    const changedFields: { name?: string; email?: string; avatar?: string } =
      {};
    if (name !== user!.name) {
      changedFields.name = name;
    }
    if (email !== user!.email) {
      if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        return toast.error("Invalid email format");
      }
      changedFields.email = email;
    }
    if (avatar !== user!.avatar) {
      changedFields.avatar = avatar || "empty";
    }
    updateNameEmailAvatar(changedFields);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Missing required fields");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters long");
    }

    updatePassword({ currentPassword, newPassword, confirmPassword });
  };

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files![0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar((e.target as FileReader).result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  document.title = `Settings | DishDrop - Turn Cooking Videos Into Recipes You Can Actually Cook From`;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px] space-y-[35px] md:px[100px] lg:px-[465px]">
        <div className="space-y-[10px]">
          <h1 className="text-3xl md:text-4xl font-black font-heading">
            Settings
          </h1>
          <p className="opacity-60">Manage your account and preferences</p>
        </div>
        <SettingCard
          title="Account Information"
          description="Update your profile and email address"
        >
          <div className="flex flex-col items-center gap-[10px] text-center">
            <p>Profile picture</p>
            {avatar ? (
              <div
                className="w-[100px] h-[100px] rounded-full bg-accent-primary border-2 border-card cursor-default select-none
              text-card flex items-center justify-center text-5xl font-semibold shadow-lg shadow-black/15 overflow-hidden"
              >
                <img src={avatar} alt="Avatar" className="w-full h-full" />
              </div>
            ) : (
              <div
                className="w-[100px] h-[100px] rounded-full bg-accent-primary border-2 border-card cursor-default select-none
              text-card flex items-center justify-center text-5xl font-black shadow-lg shadow-black/15"
              >
                {user!.name[0].toUpperCase()}
              </div>
            )}
            <div className="flex items-center gap-[10px] w-full mt-[10px] flex-wrap justify-center">
              <Button
                variant="secondary"
                className="flex-shrink-0"
                onClick={handleAvatarUpload}
              >
                <HugeiconsIcon
                  icon={Upload01FreeIcons}
                  size={20}
                  strokeWidth={2}
                />
                Upload picture
              </Button>
              <Input type="file" className="hidden" />
              <Button
                variant="ghost"
                disabled={avatar === undefined}
                onClick={() => setAvatar(undefined)}
              >
                <HugeiconsIcon icon={Trash2} size={20} strokeWidth={2} />
                Remove
              </Button>
            </div>
          </div>
          <div className="space-y-[20px]">
            {user!.isVerified ? (
              <div className="p-[15px] bg-success/25 rounded-lg border border-success text-green-800">
                <span>Email verified</span>
              </div>
            ) : (
              <div className="p-[15px] bg-error/25 rounded-lg border border-error text-red-800 flex items-center justify-between">
                <span>Email not verified </span>{" "}
                <span
                  className="underline underline-offset-2 cursor-pointer"
                  onClick={sendVerificationEmail}
                >
                  Send verification email
                </span>
              </div>
            )}
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-center gap-[10px]">
              <Button
                variant="primary"
                disabled={
                  name === user!.name &&
                  email === user!.email &&
                  avatar === user!.avatar
                }
                onClick={handleChangeNameEmailAvatar}
              >
                Save changes
              </Button>
              <Button variant="ghost" disabled>
                Cancel
              </Button>
            </div>
          </div>
        </SettingCard>
        <SettingCard
          title="Password"
          description="Change your password or reset it"
        >
          <div className="space-y-[20px]">
            <Input
              label="Current password"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
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
                disabled={!currentPassword || !newPassword || !confirmPassword}
                onClick={handleChangePassword}
              >
                Change password
              </Button>
              <p
                className="font-bold text-accent-primary text-sm underline cursor-pointer"
                onClick={() => sendResetPasswordEmail(user!.email)}
              >
                Forgot password?
              </p>
            </div>
          </div>
        </SettingCard>
        {/* <SettingCard
          title="Preferences"
          description="Customize your Dish Drop experience"
        >
          <div className="space-y-[10px]">
            <p>Measurement Units</p>
            <RadioInput
              label="Metric (grams, liters, °C)"
              name="units"
              value="metric"
              checked={selectedUnits === "metric"}
              onChange={() => setSelectedUnits("metric")}
              className={`px-[20px] py-[15px] border ${selectedUnits === "metric" ? "border-accent-primary" : "border-black/60"}  rounded-lg`}
            />
            <RadioInput
              label="Imperial (cups, ounces, °F)"
              name="units"
              value="imperial"
              checked={selectedUnits === "imperial"}
              onChange={() => setSelectedUnits("imperial")}
              className={`px-[20px] py-[15px] border ${selectedUnits === "imperial" ? "border-accent-primary" : "border-black/60"} rounded-lg`}
            />
          </div>
          <div className="space-y-[10px]">
            <p>Email Notifications</p>
            <div
              onClick={() =>
                setActiveNotifications((prev) => ({
                  ...prev,
                  updates: !prev.updates,
                }))
              }
              className="cursor-pointer flex items-center justify-between gap-[10px] bg-gray-100 p-[10px] rounded-lg"
            >
              <div>
                <p className="text-sm">Product updates</p>
                <p className="text-xs opacity-60">
                  New features and improvements
                </p>
              </div>
              <Switch active={activeNotifications.updates} />
            </div>
            <div
              onClick={() =>
                setActiveNotifications((prev) => ({
                  ...prev,
                  marketing: !prev.marketing,
                }))
              }
              className="cursor-pointer flex items-center justify-between gap-[10px] bg-gray-100 p-[10px] rounded-lg"
            >
              <div>
                <p className="text-sm">Marketing emails</p>
                <p className="text-xs opacity-60">
                  Tips, inspiration, and offers
                </p>
              </div>
              <Switch active={activeNotifications.marketing} />
            </div>
          </div>
          <Button variant="primary">Save preferences</Button>
        </SettingCard> */}
        <SettingCard
          title="Danger Zone"
          description="Irreversible actions"
          className="border-2 border-red-500 text-red-700 bg-red-50"
        >
          <div className="space-y-[5px] bg-red-100 rounded-lg p-[10px] border border-red-300">
            <p className="font-bold">Warning</p>
            <p className="text-sm">
              Deleting your account is permanent and cannot be undone. All your
              saved recipes will be lost.
            </p>
          </div>

          <Button
            variant="primary"
            className="bg-red-700 hover:bg-red-600!"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete my account permanently
          </Button>
        </SettingCard>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal setShowModal={setShowDeleteModal} />
      )}
    </div>
  );
};

export default Settings;
