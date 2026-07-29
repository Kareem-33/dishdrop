import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios.js";

interface IUser {
  name: string,
  email: string,
  password: string,
  avatar?: string,
  measureUnits: string;
  isVerified: boolean,
  provider: string,
  googleId?: String,
  resetPasswordToken?: string | undefined,
  resetPasswordExpires?: Date | undefined,
  verificationToken?: string | undefined,
  verificationExpires?: Date | undefined,
  createdAt: Date,
  updatedAt: Date,
}

interface AuthState {
  user: IUser | null;
  loading: boolean;
  checkingAuth: boolean;

  checkAuth: () => void;
  signup: ({ name, email, password, confirmPassword }: { name?: string, email: string, password: string, confirmPassword: string }) => void;
  login: ({ email, password }: { email: string, password: string }) => void;
  logout: () => void;

  updateNameEmailAvatar: ({ name, email, avatar }: { name?: string, email?: string, avatar?: string }) => void;
  updatePassword: ({ currentPassword, newPassword, confirmPassword }: { currentPassword: string, newPassword: string, confirmPassword: string }) => void;

  sendVerificationEmail: () => void;

  sendResetPasswordEmail: (email: string) => void;
  resetPassword: ({ resetPasswordToken, newPassword, confirmPassword }: { resetPasswordToken: string, newPassword: string, confirmPassword: string }) => void;

  deleteAccount: (confirm: string) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/users/profile");
      const user = response.data.data;
      set({ user: user });
    } catch (error: any) {
      return;
    } finally {
      set({ checkingAuth: false });
    }
  },

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const response = await axios.post("/users/signup", { name, email, password });
      const message = response.data.message;
      const user = response.data.data;
      set({ user: user });
      return toast.success(message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const response = await axios.post("/users/login", { email, password });
      const message = response.data.message;
      const user = response.data.data;
      set({ user: user });
      return toast.success(message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred")
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("/users/logout");
      set({ user: null });
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  updateNameEmailAvatar: async ({ name, email, avatar }) => {
    set({ loading: true });
    try {
      const response = await axios.put("/users/profile", { name, email, avatar });
      const message = response.data.message;
      const user = response.data.data;
      set({ user: user });
      return toast.success(message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false })
    }
  },

  updatePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    set({ loading: true });
    try {
      const response = await axios.patch("/users/change-password", { currentPassword, newPassword, confirmPassword });
      const message = response.data.message;
      return toast.success(message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  sendVerificationEmail: async () => {
    set({ loading: true });
    try {
      const response = await axios.post("/users/send-verification-email");
      return toast.success(response.data.message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  sendResetPasswordEmail: async (email) => {
    set({ loading: true });
    try {
      const response = await axios.post("/users/send-reset-password-email", { email });
      const message = response.data.message;
      return toast.success(message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async ({ resetPasswordToken, newPassword, confirmPassword }) => {
    set({ loading: true });
    if (newPassword !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const response = await axios.post(`/users/reset-password?token=${resetPasswordToken}`, { newPassword, confirmPassword });
      const message = response.data.message;
      return toast.success(message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  deleteAccount: async (confirm) => {
    set({loading: true})
    try {
      const response = await axios.delete("/users/profile", { data: { confirm } });
      const message = response.data.message;
      set({ user: null });
      return toast.success(message);
    } catch (error: any) {
      return toast.error(error.response?.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  }
}));

export default useAuthStore;