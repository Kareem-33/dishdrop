import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import Button from "../ui/Button";
import {
  AllBookmarkIcon,
  BugIcon,
  CustomerService01Icon,
  Folder02Icon,
  LoginSquare01Icon,
  LogoutSquare01Icon,
  Menu01Icon,
  PlusSignSquareIcon,
  Settings01Icon,
  SparklesIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

type MenuItem = {
  label: string;
  icon: IconSvgElement;
  path?: string;
  badge?: number;
};

// Single source of truth for the three action-card looks used across both
// the logged-in and guest menus, so they can never drift apart again.
const ACTION_VARIANTS = {
  neutral: {
    card: "rounded-lg bg-accent-primary/12 md:text-sm",
    button: "",
  },
  primary: {
    card: "rounded-lg bg-accent-primary md:text-sm",
    button: "text-white font-bold",
  },
  secondary: {
    card: "rounded-lg border border-accent-primary bg-accent-primary/10 md:text-sm",
    button: "text-accent-primary! font-bold",
  },
} as const;

type ActionVariant = keyof typeof ACTION_VARIANTS;

const ACCOUNT_ITEMS: MenuItem[] = [
  { label: "Saved Recipes", icon: AllBookmarkIcon, path: "/r/saved" },
  { label: "Collections", icon: Folder02Icon, path: "/c" },
];

const SETTINGS_ITEMS: MenuItem[] = [
  { label: "Settings", icon: Settings01Icon, path: "/settings" },
  { label: "How it works", icon: SparklesIcon, path: "/" },
  { label: "Help & support", icon: CustomerService01Icon, path: "/" },
];

const GUEST_ITEMS: MenuItem[] = [
  { label: "Drop a video", icon: PlusSignSquareIcon, path: "/" },
  { label: "How it works", icon: SparklesIcon, path: "/" },
  { label: "Help & support", icon: CustomerService01Icon, path: "/" },
];

const Navbar = () => {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const { user, logout } = useAuthStore();
  const [userLogged, setUserLogged] = useState(user !== null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpened ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpened]);

  const navigateTo = useCallback(
    (path: string) => {
      setMobileMenuOpened(false);
      navigate(path);
    },
    [navigate],
  );

  const handleLogout = useCallback(() => {
    setMobileMenuOpened(false);
    logout();
    setUserLogged(false);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    setUserLogged(user !== null);
  }, [user]);

  const renderMenuGroup = (items: MenuItem[], keyPrefix: string) => (
    <li className="space-y-[25px] rounded-lg p-[15px] bg-accent-primary/12 md:text-sm">
      {items.map((item) => (
        <button
          key={`${keyPrefix}-${item.label}`}
          type="button"
          onClick={() => item.path && navigateTo(item.path)}
          className="w-full flex items-center justify-between gap-[15px] text-left cursor-pointer"
        >
          <span className="flex items-center gap-[15px]">
            <HugeiconsIcon icon={item.icon} className="w-[22px] md:w-[18px]" />
            {item.label}
          </span>
          {item.badge !== undefined && <span>{item.badge}</span>}
        </button>
      ))}
      {(keyPrefix === "settings" || keyPrefix === "guest") && (
        <a
          key={`${keyPrefix}-feedback`}
          type="button"
          href="https://docs.google.com/forms/d/e/1FAIpQLScUgbZy9BqcN-VD6DgLJdevAB78sqRM54pfsZfsFF9DEgTNhA/viewform?usp=publish-editor"
          target="_blank"
          className="w-full flex items-center justify-between gap-[15px] text-left cursor-pointer"
        >
          <span className="flex items-center gap-[15px]">
            <HugeiconsIcon icon={BugIcon} className="w-[22px] md:w-[18px]" />
            Bugs & Suggestions
          </span>
        </a>
      )}
    </li>
  );

  const renderActionItem = (
    label: string,
    icon: IconSvgElement,
    onClick: () => void,
    variant: ActionVariant,
  ) => {
    const { card, button } = ACTION_VARIANTS[variant];
    return (
      <li key={label} className={card}>
        <button
          type="button"
          onClick={onClick}
          className={`w-full flex items-center gap-[15px] p-[15px] text-left cursor-pointer ${button}`}
        >
          <HugeiconsIcon icon={icon} className="w-[22px] md:w-[18px]" />
          {label}
        </button>
      </li>
    );
  };

  return (
    <div className="fixed w-full bg-dark-bg border-b border-accent-primary p-5 md:px-[80px] lg:px-[122px] flex justify-between items-center h-[80px] z-[999]">
      <a href="/">
        <img src="/logo.svg" alt="Logo" />
      </a>

      <div className="flex gap-[15px] items-center">
        {!userLogged && (
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigateTo("/login")}
          >
            Login
          </Button>
        )}
        <button
          type="button"
          aria-label={mobileMenuOpened ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpened}
          onClick={() => setMobileMenuOpened((open) => !open)}
        >
          <HugeiconsIcon
            icon={Menu01Icon}
            className={`cursor-pointer text-accent-primary ${mobileMenuOpened ? "rotate-90" : ""} transition-all duration-300 ease-in-out`}
            strokeWidth={2.5}
            size={28}
          />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileMenuOpened ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => setMobileMenuOpened(false)}
        style={{ pointerEvents: mobileMenuOpened ? "auto" : "none" }}
        className="fixed w-full h-[calc(100vh-80px)] top-[80px] left-0 bg-black/15 backdrop-blur-xs"
      />

      <motion.div
        initial={{ right: "-100%" }}
        animate={{ right: mobileMenuOpened ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-[80px] right-0 overflow-auto pb-[100px] md:pb-0 bg-dark-bg border-l-2 border-accent-primary/50 text-border-default h-[calc(100vh-80px)] w-[75%] md:w-[300px]"
      >
        {userLogged ? (
          <ul className="p-[20px] md:p-[10px] flex flex-col gap-[15px] min-h-full">
            <li>
              <button
                type="button"
                onClick={() => navigateTo("/settings")}
                className="w-full flex items-center gap-[10px] bg-accent-primary/12 hover:bg-accent-primary/15 rounded-lg p-[15px] text-left cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                ) : (
                  <span className="rounded-full w-[50px] h-[50px] bg-accent-primary border shrink-0 border-dark-text text-dark-text flex items-center justify-center text-2xl font-extrabold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs font-normal opacity-60">
                    {user?.email}
                  </p>
                </span>
              </button>
            </li>

            {renderMenuGroup(ACCOUNT_ITEMS, "account")}
            {renderMenuGroup(SETTINGS_ITEMS, "settings")}
            {renderActionItem(
              "Logout",
              LogoutSquare01Icon,
              handleLogout,
              "neutral",
            )}
            {renderActionItem(
              "Drop a video",
              PlusSignSquareIcon,
              () => navigateTo("/"),
              "primary",
            )}
          </ul>
        ) : (
          <ul className="p-[20px] md:p-[10px] flex flex-col gap-[15px] min-h-full">
            {renderMenuGroup(GUEST_ITEMS, "guest")}
            {renderActionItem(
              "Login",
              LoginSquare01Icon,
              () => navigateTo("/login"),
              "secondary",
            )}
            {renderActionItem(
              "Signup",
              UserAdd01Icon,
              () => navigateTo("/signup"),
              "primary",
            )}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default Navbar;
