import React from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login, sendResetPasswordEmail } = useAuthStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Missing required fields");
    login({ email, password });
  };
  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px]">
        <div className="md:w-[600px] mx-auto p-[25px] text-center rounded-lg border border-border-default bg-card flex flex-col items-center gap-[30px]">
          <div className="transition-all duration-300 ease-in-out w-full p-[10px] bg-page rounded-xl flex items-center gap-[10px] text-text-secondary">
            <Link
              to="/login"
              className="p-[10px] flex-1 bg-card shadow-lg font-bold text-accent-primary shadow-black/5 rounded-lg text-center"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="transition-all duration-300 ease-in-out p-[10px] flex-1 rounded text-center"
            >
              Sign up
            </Link>
          </div>
          <div>
            <h1 className="font-heading text-2xl">Welcome Back</h1>
            <p className="opacity-60">Log in to access your saved recipes</p>
          </div>
          <Button variant="ghost" className="w-full">
            <img
              src="/icons/google.svg"
              alt="google icon"
              className="w-[22px]"
            />
            Continue with google
          </Button>
          <div className="w-full flex items-center gap-[10px] ">
            <hr className="flex-1 opacity-20" />
            <span className="opacity-40 text-sm">OR</span>
            <hr className="flex-1 opacity-20" />
          </div>
          <form
            className="w-full text-left space-y-[25px]"
            onSubmit={handleSubmit}
          >
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex flex-col items-end w-full gap-[5px]">
              <Input
                label="Password"
                placeholder="Enter your password"
                className="w-full"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="text-sm font-bold text-accent-primary text-right w-full underline cursor-pointer"
                onClick={() => sendResetPasswordEmail(email)}
              >
                Forgot password?
              </span>
            </div>
            <Button variant="primary" className="w-full" type="submit">
              Log in
            </Button>
          </form>
          <hr className="w-full opacity-20" />
          <span className="text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-accent-primary font-bold underline"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
